# App Review Scraper

A Python project for scraping app reviews from both Google Play Store and Apple App Store.

## Overview

This tool helps collect app reviews from mobile app stores to analyze user feedback. The project contains:

- Google Play Store review scraper
- App Store metadata fetcher

## Project Structure

- `googleplay_scraper.py`: Script to scrape reviews from Google Play Store
- `appstore_final_scraper.py`: Script to fetch app metadata from Apple App Store

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
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Google Play Store Reviews

To scrape reviews from Google Play:

```bash
python googleplay_scraper.py
```

This will create:
- `one_pass_googleplay_reviews.csv`
- `one_pass_googleplay_reviews.json`

### App Store Metadata

To fetch app metadata from the App Store:

```bash
python appstore_final_scraper.py
```

This will create:
- `one_pass_appstore_reviews.csv` (with metadata)
- `one_pass_appstore_reviews.json` (with metadata)

## Notes

- Due to Apple's API restrictions, direct programmatic access to App Store reviews is limited. The App Store scraper fetches metadata but directs users to the actual App Store page to view reviews.
- Google Play reviews can be accessed and scraped without restrictions.

## Requirements

- Python 3.6+
- Required Python packages are listed in `requirements.txt` 