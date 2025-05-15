#!/usr/bin/env python
import time
import json
import pandas as pd
from bs4 import BeautifulSoup
import requests
from datetime import datetime

# First, let's install selenium if not present
try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException
    selenium_available = True
except ImportError:
    print("Selenium not installed. Installing...")
    import subprocess
    subprocess.check_call(["pip", "install", "selenium", "webdriver-manager"])
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException
    from webdriver_manager.chrome import ChromeDriverManager
    selenium_available = True

# App details
APP_ID = '6499447981'
APP_NAME = 'one-pass'
OUTPUT_FILE_BASE = f"{APP_NAME.replace('-', '_')}_appstore_reviews_browser"
APP_STORE_URL = f"https://apps.apple.com/us/app/{APP_NAME}/id{APP_ID}"

def fetch_app_metadata():
    """Fetch basic app metadata from iTunes API"""
    lookup_url = f"https://itunes.apple.com/lookup?id={APP_ID}&country=us"
    
    try:
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

def setup_browser():
    """Set up the Chrome browser with appropriate options"""
    options = Options()
    options.add_argument("--headless")  # Run in headless mode (no visible browser)
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36")
    
    try:
        # Try to use the webdriver manager to get the driver
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
    except:
        # Fallback if webdriver_manager is not available
        driver = webdriver.Chrome(options=options)
    
    return driver

def scroll_to_load_reviews(driver, num_scrolls=5):
    """Scroll down to load more reviews"""
    try:
        # Wait for the reviews section to be visible
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".we-customer-ratings__averages"))
        )
        
        # Find the reviews section
        reviews_section = driver.find_element(By.CSS_SELECTOR, ".we-customer-review")
        
        # Scroll down to load more reviews
        for _ in range(num_scrolls):
            driver.execute_script("arguments[0].scrollIntoView(true);", reviews_section)
            driver.execute_script("window.scrollBy(0, 500);")
            time.sleep(2)  # Wait for reviews to load
            
    except TimeoutException:
        print("Timed out waiting for reviews section to load")
    except Exception as e:
        print(f"Error scrolling for reviews: {e}")

def extract_reviews(driver):
    """Extract reviews from the loaded page"""
    reviews = []
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    
    try:
        review_elements = soup.select(".we-customer-review")
        
        if not review_elements:
            print("No review elements found. Check if the CSS selector is still valid.")
            return reviews
        
        for idx, review_element in enumerate(review_elements):
            try:
                # Extract review data
                title_element = review_element.select_one(".we-customer-review__title")
                content_element = review_element.select_one(".we-customer-review__body")
                rating_element = review_element.select_one(".we-customer-review__rating")
                author_element = review_element.select_one(".we-customer-review__user")
                date_element = review_element.select_one(".we-customer-review__date")
                
                # Build review object
                review = {
                    'id': f"appstore_review_{idx+1}",
                    'title': title_element.text.strip() if title_element else "No Title",
                    'content': content_element.text.strip() if content_element else "No Content",
                    'rating': int(rating_element['aria-label'].split()[0]) if rating_element and 'aria-label' in rating_element.attrs else None,
                    'author': author_element.text.strip() if author_element else "Anonymous",
                    'date': date_element.text.strip() if date_element else datetime.now().strftime("%Y-%m-%d"),
                    'version': "N/A",  # App Store doesn't always show version in reviews
                    'source': "App Store Browser Automation"
                }
                
                reviews.append(review)
                
            except Exception as e:
                print(f"Error extracting review {idx+1}: {e}")
                continue
    
    except Exception as e:
        print(f"Error finding review elements: {e}")
    
    return reviews

def scrape_app_store_reviews():
    """Main function to scrape App Store reviews"""
    print(f"Setting up browser automation to scrape reviews for {APP_NAME} (ID: {APP_ID})...")
    
    # Fetch app metadata
    metadata = fetch_app_metadata()
    
    # Initialize an empty reviews list
    reviews = []
    
    try:
        # Set up and use the browser
        driver = setup_browser()
        driver.get(APP_STORE_URL)
        print(f"Loaded App Store page: {APP_STORE_URL}")
        
        # Wait for the page to load
        time.sleep(5)
        
        # Scroll to load more reviews
        scroll_to_load_reviews(driver, num_scrolls=10)
        
        # Extract reviews from the page
        reviews = extract_reviews(driver)
        print(f"Extracted {len(reviews)} reviews from the App Store page.")
        
        # Close the browser
        driver.quit()
        
    except Exception as e:
        print(f"Error during browser automation: {e}")
        
        # Add a fallback message if no reviews could be extracted
        if not reviews:
            fallback_review = {
                'id': 'fallback_review_1',
                'title': 'Browser Automation Attempted',
                'content': 'Automated browser scraping was attempted but encountered issues. You may need to manually check the App Store for reviews.',
                'rating': None,
                'author': 'System',
                'date': datetime.now().isoformat(),
                'version': 'N/A',
                'source': 'Fallback Message'
            }
            reviews.append(fallback_review)
    
    # Save the results
    save_data(metadata, reviews)
    
    return reviews

def save_data(metadata, reviews):
    """Save app metadata and reviews to JSON and CSV files"""
    output = {
        'app_id': APP_ID,
        'app_name': APP_NAME,
        'metadata': metadata,
        'reviews': reviews,
        'app_store_url': APP_STORE_URL,
        'scrape_date': datetime.now().isoformat()
    }
    
    # Save to JSON
    json_filename = f"{OUTPUT_FILE_BASE}.json"
    with open(json_filename, 'w') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    print(f"Saved app metadata and reviews to {json_filename}")
    
    # Save reviews to CSV
    if reviews:
        csv_filename = f"{OUTPUT_FILE_BASE}.csv"
        df = pd.DataFrame(reviews)
        df.to_csv(csv_filename, index=False)
        print(f"Saved {len(reviews)} reviews to {csv_filename}")

if __name__ == "__main__":
    if not selenium_available:
        print("Error: Selenium could not be installed or imported. Browser automation requires Selenium.")
        print(f"Please manually install with: pip install selenium webdriver-manager")
        exit(1)
    
    print("Starting App Store review scraper using browser automation...")
    scrape_app_store_reviews()
    print("\nDone! Check output files for results.") 