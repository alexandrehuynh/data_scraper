# App Review Scraper

A Python project for scraping app reviews from both Google Play Store and Apple App Store.

## Overview

This tool helps collect app reviews from mobile app stores to analyze user feedback. The project contains:

- Google Play Store review scraper - Fully functional
- App Store review scrapers - Two approaches due to Apple restrictions

## Project Structure

- `googleplay_scraper.py`: Scrapes reviews from Google Play Store (full functionality)
- `appstore_api_scraper.py`: Attempts to use various API methods to get App Store reviews (limited success)
- `appstore_browser_scraper.py`: Uses Selenium browser automation to scrape App Store reviews directly from the web interface (most reliable method for App Store)
- `appstore_final_scraper.py`: A metadata-only scraper that explains Apple's API restrictions

## Apple App Store Review Scraping Challenges

Apple has implemented strict API restrictions that make it difficult to programmatically access App Store reviews. Here's what we've learned:

1. **API Restrictions**: Apple's official API doesn't provide direct access to user reviews
2. **RSS Feed Deprecation**: The old RSS feed method no longer works (returns 500 errors)
3. **StoreFront API Limitations**: The internal StoreFront API requires authentication tokens that are difficult to extract and use

Our solutions:

1. **Browser Automation (Most Reliable)**: `appstore_browser_scraper.py` uses Selenium to automate a web browser, visit the App Store page, and extract reviews directly from the HTML. This is the most reliable method but requires Chrome and ChromeDriver installed.

2. **API Attempts**: `appstore_api_scraper.py` tries multiple API-based methods but has limited success due to Apple's restrictions.

## Google Play Store

The `googleplay_scraper.py` script works reliably to extract reviews from Google Play using the `google-play-scraper` library.

## Installation

1. Clone this repository:
```bash
git clone https://github.com/alexandrehuynh/data_scraper.git
cd data_scraper
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# On Windows
venv\\Scripts\\activate

# On macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Google Play Reviews

```bash
python googleplay_scraper.py
```

### App Store Reviews

For browser automation approach (most reliable):
```bash
python appstore_browser_scraper.py
```

For API attempt approach:
```bash
python appstore_api_scraper.py
```

## Output

The scripts generate both CSV and JSON files containing the scraped reviews:

- `one_pass_googleplay_reviews.csv`/`.json`: Google Play reviews
- `one_pass_appstore_reviews_browser.csv`/`.json`: App Store reviews from browser automation
- `one_pass_appstore_reviews_api.csv`/`.json`: App Store data from API attempts

## Limitations

- App Store scraping is challenging due to Apple's API restrictions
- The browser automation approach requires Chrome and ChromeDriver installed
- The number of reviews that can be scraped may be limited by the app stores 