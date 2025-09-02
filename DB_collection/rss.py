import feedparser
import re

import firebase_admin
from firebase_admin import credentials, firestore

def find_status (entry):
    description = entry.get('description', '')

    ireland_status = "N/A"

    pattern = re.compile(r'<b>Status in each country</b>:([^<]*)<br />')
    match = pattern.search(description)

    if match:
        country_statuses_str = match.group(1).strip()
        statuses_list = [s.strip() for s in country_statuses_str.split(',')]
        
        for status in statuses_list:
            if status.startswith("Ireland:"):
                ireland_status = status.replace("Ireland:", "").strip()
                break
        
    return ireland_status

def extract_trial_details(entry: feedparser.FeedParserDict) -> dict:

    description = entry.get('description', '')
    if not description:
        return None

    title = entry.get('title', 'Not available')

    trial_number_match = re.search(r'<b>Trial number</b>:([^<]*)<br />', description)
    trial_number = trial_number_match.group(1).strip() if trial_number_match else 'Not available'

    medical_conditions_match = re.search(r'<b>Medical conditions</b>:([^<]*)<br />', description)
    medical_conditions = medical_conditions_match.group(1).strip() if medical_conditions_match else 'Not available'

    age_group_match = re.search(r'<b>Age of participants</b>:([^<]*)<br />', description)
    age_group = age_group_match.group(1).strip() if age_group_match else 'Not available'

    product_match = re.search(r'<b>Trial product</b>:([^<]*)<br />', description)
    product = product_match.group(1).strip() if product_match else 'Not available'

    return {
        'Title of the trial': title,
        'Trial Number': trial_number,
        'Medical conditions': medical_conditions,
        'Age group': age_group,
        'Product': product
    }

# Age group
# Trial Number
# Medical conditions
# Product
# Title of the trial

if __name__ == "__main__":

    path_to_key = "/Users/adityasrikanth/Documents/Projects/derma-match-dublin/DB_collection/skinside-7b6df-firebase-adminsdk-fbsvc-f23e69482a.json"

    if not firebase_admin._apps:
        cred = credentials.Certificate(path_to_key)
        firebase_admin.initialize_app(cred)
    db = firestore. client()

    rss_url = "https://euclinicaltrials.eu/ctis-public-api/rss/updates.rss?search_criteria=%7B%22containAny%22%3A%22psoriasis%2C%20eczema%2C%20acne%2C%20hidradenitis%2C%20melanoma%22%2C%22msc%22%3A%5B372%5D%2C%22mscStatus%22%3A%5B2%2C3%2C4%2C5%5D%7D"
    feed = feedparser.parse(rss_url)

    derm_ref = db.collection('derm')

    acceptable_statuses = [
        'Ongoing, recruitment ended',
        'Ongoing, recruiting',
        'Authorised, recruiting',
        'Authorised, not recruiting'
    ]

    for entry in feed.entries:
        trial_number = re.search(r'<b>Trial number</b>:([^<]*)<br />', entry.get('description', '')).group(1).strip()
        status_update = find_status(entry)

        query = derm_ref.where('EudraCT', '==', trial_number)
        docs = query.stream()
    
        if docs is not None:
            for doc in docs:
                data = doc.to_dict()

                if data['Overall trial status'] != status_update:
                    if status_update not in acceptable_statuses:
                        doc_ref = db.collection('derm').document(trial_number)
                        doc_ref.delete()
                    else:
                        doc_ref = db.collection('derm').document(trial_number)
                        doc_ref.update({'Overall trial status': status_update})
        
        else:
            upload_dict = extract_trial_details(entry)
            upload_dict['Overall trial status'] = status_update
            upload_dict['source'] = 'CTIS'

            doc_ref = db.collection('derm').document(entry['EudraCT'])
            doc_ref.set(entry)
    
