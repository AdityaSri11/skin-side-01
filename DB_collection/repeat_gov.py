# This script retrieves clinical trial information from the ClinicalTrials.gov API,
# filters the results based on specific criteria, and prints the matching trials.

import requests
import json
import time

# --- API Configuration ---
# The API endpoint for searching studies on ClinicalTrials.gov (v2)
API_URL = "https://clinicaltrials.gov/api/v2/studies"

# --- Request Setup ---
# Your search parameters
# Filter by condition (query.cond), location (query.locn), and overall status
keywords = ["Psoriasis", "Dermatitis", "Acne", "Eczema", "Hidradenitis", "Melanoma"]
country = "Ireland"
desired_statuses = ["RECRUITING", "NOT_YET_RECRUITING", "ENROLLING_BY_INVITATION"]

# The params dictionary is a clean way to handle URL query parameters.
# The 'requests' library automatically handles the URL encoding.
params = {
    "query.cond": " OR ".join(keywords),
    "query.locn": country,
    "filter.overallStatus": ",".join(desired_statuses),
    "fields": "NCTId,BriefTitle,OverallStatus,StdAge,Condition,Intervention",
    "countTotal": "true",
    "pageSize": 50
}

# --- Main Logic ---

def fetch_and_filter_trials():

    try:
        response = requests.get(API_URL, params=params, timeout=20)
        response.raise_for_status()  # This will raise an exception for HTTP errors
        data = response.json()

        studies = data.get("studies", [])
        trial_list = []
        
        if studies:
            for study in studies:

                nct_number = study.get("protocolSection", {}).get("identificationModule", {}).get("nctId", "N/A")
                title = study.get("protocolSection", {}).get("identificationModule", {}).get("briefTitle", "N/A")
                status = study.get("protocolSection", {}).get("statusModule", {}).get("overallStatus", "N/A")
                age_group = study.get("protocolSection", {}).get("eligibilityModule", {}).get("stdAge", "N/A")
                conditions = study.get("protocolSection", {}).get("conditionsModule", {}).get("conditions", [])
                
                interventions = [i.get("interventionName", "N/A") for i in study.get("protocolSection", {}).get("interventionsModule", {}).get("interventions", [])]

                trial_info = {
                    "Trial Number": nct_number,
                    "Tiutle of the trial": title,
                    "Overall trial status": status,
                    "Age group": age_group,
                    "Medical conditions": conditions,
                    "Product": interventions
                }
                trial_list.append(trial_info)
            
            return trial_list
            # print(json.dumps(trial_list, indent=2))

        else:
            print("No trials found matching the specified criteria.")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred during the API request: {e}")
        print("Please check your internet connection and the API endpoint.")


def CTIS_check(dict_list):

    students_ref = db.collection('derm')
    query = students_ref.where('EudraCT', '==', 23)

    for i in range(len(dict_list)):


if __name__ == "__main__":

    import firebase_admin
    from firebase_admin import credentials, firestore

    path_to_key = "/Users/adityasrikanth/Documents/Projects/derma-match-dublin/DB_collection/skinside-7b6df-firebase-adminsdk-fbsvc-f23e69482a.json"

    # Initialize the app
    if not firebase_admin._apps:
        cred = credentials.Certificate(path_to_key)
        firebase_admin.initialize_app(cred)

    # Get a Firestore client
    db = firestore. client()

    dict_list = fetch_and_filter_trials()
    docs = query.stream()