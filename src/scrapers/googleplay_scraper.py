from google_play_scraper import Sort, reviews_all
import pandas as pd
import json

# Fetch all reviews
play_reviews = reviews_all(
    'com.pearhealthlabs.onepass',
    sleep_milliseconds=0,  # Delay between requests
    lang='en',  # Language
    country='us',  # Country
    sort=Sort.NEWEST  # Sort order (NEWEST, RATING, RELEVANCE)
)

# Save to CSV
reviews_df = pd.DataFrame(play_reviews)
reviews_df.to_csv('one_pass_googleplay_reviews.csv', index=False)

# Or save as JSON

# Custom JSON encoder to handle datetime objects
def datetime_handler(x):
    if hasattr(x, 'isoformat'):
        return x.isoformat()
    raise TypeError("Unknown type")

with open('one_pass_googleplay_reviews.json', 'w') as f:
    json.dump(play_reviews, f, default=datetime_handler, indent=2) # Added default handler and indent