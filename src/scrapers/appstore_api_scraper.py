#!/usr/bin/env python
import requests
import json
import pandas as pd
import time
import re
from datetime import datetime
import random
import base64

# App details for One Pass
APP_ID = '6499447981'
APP_NAME = 'one-pass'
OUTPUT_FILE_BASE = f"{APP_NAME.replace('-', '_')}_appstore_reviews_api"

# Modern user agent
USER_AGENTS = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
]

def get_random_user_agent():
    return random.choice(USER_AGENTS)

def fetch_app_metadata():
    """Fetch app metadata using the iTunes Lookup API"""
    lookup_url = f"https://itunes.apple.com/lookup?id={APP_ID}&country=us"
    
    try:
        print(f"Fetching app metadata for {APP_NAME} (ID: {APP_ID})...")
        response = requests.get(lookup_url)
        response.raise_for_status()
        data = response.json()
        
        if data.get('resultCount', 0) > 0:
            print("Successfully fetched app metadata")
            return data['results'][0]
        else:
            print("No app metadata found")
            return {}
    except Exception as e:
        print(f"Error fetching app metadata: {e}")
        return {}

def extract_token_from_app_store_page():
    """
    Extract the token from the App Store page
    """
    url = f"https://apps.apple.com/us/app/{APP_NAME}/id{APP_ID}"
    headers = {
        'User-Agent': get_random_user_agent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Accept-Language': 'en-US,en;q=0.9',
    }
    
    try:
        print("Getting App Store page to extract token...")
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        # Look for the media-api token in the HTML
        pattern = r'token%22%3A%22([^%]+)%22'
        match = re.search(pattern, response.text)
        
        if match:
            token = match.group(1)
            print(f"Found token: {token[:10]}...{token[-10:]}")
            return token
            
        # Try alternate pattern
        alt_pattern = r'"token":"([^"]+)"'
        alt_match = re.search(alt_pattern, response.text)
        if alt_match:
            token = alt_match.group(1)
            print(f"Found token (alternate pattern): {token[:10]}...{token[-10:]}")
            return token
            
        print("Could not extract token from App Store page")
        return None
    
    except Exception as e:
        print(f"Error getting token: {e}")
        return None

def get_reviews_with_storefront_api(token):
    """
    Try to get reviews using the StoreFront API with the extracted token
    """
    all_reviews = []
    review_url = f"https://amp-api.apps.apple.com/v1/catalog/us/apps/{APP_ID}/reviews"
    
    headers = {
        'User-Agent': get_random_user_agent(),
        'Authorization': f'Bearer {token}',
        'Accept': 'application/json',
        'Connection': 'keep-alive',
        'Origin': 'https://apps.apple.com',
        'Referer': f'https://apps.apple.com/us/app/{APP_NAME}/id{APP_ID}',
    }
    
    # Try with different combinations of parameters and pagination
    for attempt in range(3):
        for offset in range(0, 30, 10):
            try:
                params = {
                    'l': 'en-US',
                    'offset': offset,
                    'limit': 10,
                    'platform': 'web',
                    'additionalPlatforms': 'appletv,ipad,iphone,mac'
                }
                
                print(f"Attempt {attempt+1}, Offset {offset}: Fetching reviews from StoreFront API...")
                response = requests.get(review_url, headers=headers, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if 'data' not in data or not data['data']:
                        print("No reviews found in this batch")
                        continue
                        
                    print(f"Found {len(data['data'])} reviews!")
                    
                    for review in data['data']:
                        try:
                            review_data = {
                                'id': review['id'],
                                'title': review['attributes'].get('title', ''),
                                'content': review['attributes'].get('review', ''),
                                'rating': review['attributes'].get('rating', 0),
                                'author': review['attributes'].get('reviewerNickname', 'Anonymous'),
                                'date': review['attributes'].get('date', ''),
                                'version': review['attributes'].get('storeSortVersion', ''),
                                'source': 'StoreFront API'
                            }
                            all_reviews.append(review_data)
                        except KeyError as e:
                            print(f"Skipping review due to missing key: {e}")
                            continue
                else:
                    print(f"Failed to fetch reviews. Status code: {response.status_code}")
                    if attempt == 0:  # Only print the error details on first attempt
                        print(f"Error: {response.text[:200]}")
                
                time.sleep(1)  # Be polite
                
            except Exception as e:
                print(f"Error fetching reviews with StoreFront API: {e}")
                time.sleep(2)
    
    return all_reviews

def try_rss_feed_api():
    """Try the older RSS feed API that might still work in some cases"""
    all_reviews = []
    
    # Different country codes to try
    countries = ['us', 'gb', 'ca', 'au']
    
    for country in countries:
        base_url = f"https://itunes.apple.com/{country}/rss/customerreviews"
        
        for page in range(1, 4):  # Try first 3 pages
            params = {
                'id': APP_ID,
                'page': page,
                'sortby': 'mostrecent',
                'json': 'true'
            }
            
            headers = {'User-Agent': get_random_user_agent()}
            
            try:
                print(f"Trying RSS feed for country {country}, page {page}...")
                response = requests.get(base_url, params=params, headers=headers)
                
                if response.status_code == 200:
                    try:
                        data = response.json()
                        
                        if 'feed' in data and 'entry' in data['feed']:
                            entries = data['feed']['entry']
                            if isinstance(entries, dict):  # if only one review, it's a dict not a list
                                entries = [entries]
                                
                            # Skip the first entry if it's the app description rather than a review
                            if 'im:name' in entries[0]:
                                entries = entries[1:]
                                
                            print(f"Found {len(entries)} reviews in RSS feed!")
                            
                            for entry in entries:
                                try:
                                    review = {
                                        'id': entry['id']['label'],
                                        'title': entry.get('title', {}).get('label', ''),
                                        'content': entry.get('content', {}).get('label', ''),
                                        'rating': entry.get('im:rating', {}).get('label', ''),
                                        'author': entry['author']['name']['label'],
                                        'date': entry.get('updated', {}).get('label', ''),
                                        'version': entry.get('im:version', {}).get('label', ''),
                                        'source': f'RSS Feed ({country})'
                                    }
                                    all_reviews.append(review)
                                except KeyError as e:
                                    continue
                            
                            # If we found reviews, no need to try other countries
                            if entries:
                                break
                    except json.JSONDecodeError:
                        print("Failed to parse JSON from RSS feed")
                else:
                    print(f"RSS feed request failed with status code: {response.status_code}")
            
            except Exception as e:
                print(f"Error trying RSS feed: {e}")
            
            time.sleep(1)
    
    return all_reviews

def save_data(metadata, reviews):
    """Save app metadata and reviews to JSON and CSV files"""
    output = {
        'app_id': APP_ID,
        'app_name': APP_NAME,
        'metadata': metadata,
        'reviews': reviews,
        'app_store_url': f"https://apps.apple.com/us/app/{APP_NAME}/id{APP_ID}",
        'scrape_date': datetime.now().isoformat(),
        'total_reviews': len(reviews)
    }
    
    # Save to JSON
    json_filename = f"{OUTPUT_FILE_BASE}.json"
    with open(json_filename, 'w') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    print(f"Saved app metadata and {len(reviews)} reviews to {json_filename}")
    
    # Save reviews to CSV if we have any
    if reviews:
        csv_filename = f"{OUTPUT_FILE_BASE}.csv"
        df = pd.DataFrame(reviews)
        df.to_csv(csv_filename, index=False)
        print(f"Saved {len(reviews)} reviews to {csv_filename}")
    else:
        print("No reviews to save to CSV")

def try_all_api_methods():
    """Try all available methods to get App Store reviews"""
    print(f"Attempting to scrape reviews for {APP_NAME} (ID: {APP_ID}) using API methods...")
    
    # First, get the app metadata which is reliable
    metadata = fetch_app_metadata()
    
    # Initialize an empty reviews list
    all_reviews = []
    
    # Method 1: Try the StoreFront API
    print("\n=== Attempting StoreFront API method ===")
    token = extract_token_from_app_store_page()
    if token:
        storefront_reviews = get_reviews_with_storefront_api(token)
        if storefront_reviews:
            print(f"StoreFront API method found {len(storefront_reviews)} reviews.")
            all_reviews.extend(storefront_reviews)
    
    # Method 2: Try the RSS feed API
    if not all_reviews:
        print("\n=== Attempting RSS Feed API method ===")
        rss_reviews = try_rss_feed_api()
        if rss_reviews:
            print(f"RSS Feed API method found {len(rss_reviews)} reviews.")
            all_reviews.extend(rss_reviews)
    
    # If we still have no reviews, add a fallback note
    if not all_reviews:
        fallback_review = {
            'id': 'api_fallback_1',
            'title': 'API Access Restricted',
            'content': 'All API methods were tried, but no reviews could be accessed due to Apple\'s restrictions. Consider using browser automation or manually checking the App Store page.',
            'rating': None,
            'author': 'System',
            'date': datetime.now().isoformat(),
            'version': 'N/A',
            'source': 'API Fallback'
        }
        all_reviews.append(fallback_review)
    
    # Save all collected reviews
    save_data(metadata, all_reviews)
    
    return all_reviews

if __name__ == "__main__":
    print("Starting App Store review scraper using API methods...")
    reviews = try_all_api_methods()
    print(f"\nFound a total of {len(reviews)} reviews across all methods.")
    print("Done! Check output files for results.") 