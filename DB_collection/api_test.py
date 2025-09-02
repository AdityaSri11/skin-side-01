# This script retrieves clinical trial information from the ClinicalTrials.gov API,
# filters the results based on specific criteria, and prints the matching trials.

import requests
import json
import time
import re

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
    "countTotal": "true",
    "pageSize": 50
}

def get_eudract_from_nct_list(nct_ids):
    """
    Fetches the full API response for a list of NCT IDs and extracts the EudraCT number
    from each using a regular expression.

    Args:
        nct_ids (list): A list of strings, where each string is an NCT ID.

    Returns:
        None: Prints the results directly to the console.
    """
    base_url = "https://clinicaltrials.gov/api/v2/studies"
    
    # The updated pattern matches both YYYY-######-##-## and YYYY-######-## formats.
    # The last part '(-\d{2})?' is an optional group, allowing the pattern to match both.
    eudract_pattern = re.compile(r'\b(20\d{2}-\d{6}-\d{2}(-\d{2})?)\b')

    for nct_id in nct_ids:
        endpoint = f"{base_url}/{nct_id}"
        
        try:
            # Make a GET request for the full study details.
            response = requests.get(endpoint)
            response.raise_for_status()
            
            # Get the entire response body as a single text string.
            response_text = response.text
            
            # Search the entire text for the EudraCT pattern.
            match = eudract_pattern.search(response_text)
            
            if match:
                eudract_number = match.group(1)
                print(f"NCT ID: {nct_id} | EudraCT Number: {eudract_number}")
            else:
                print(f"NCT ID: {nct_id} | EudraCT Number: Not found")
                
        except requests.exceptions.RequestException as e:
            print(f"An error occurred while fetching data for {nct_id}: {e}")

def fetch_and_filter_trials():
    """
    Fetches clinical trial data from ClinicalTrials.gov,
    applies filters, and prints the results.
    """

    list_of_nct_ids = [] 
    try:
        response = requests.get(API_URL, params=params, timeout=20)
        response.raise_for_status()  # This will raise an exception for HTTP errors
        data = response.json()

        studies = data.get("studies", [])
        if studies:
            for i, study in enumerate(studies):
                nct_number = study.get("protocolSection", {}).get("identificationModule", {}).get("nctId", "N/A")
                list_of_nct_ids.append(nct_number)
            
            get_eudract_from_nct_list(list_of_nct_ids)
        else:
            print("No trials found matching the specified criteria.")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred during the API request: {e}")
        print("Please check your internet connection and the API endpoint.")

# Run the function when the script is executed
if __name__ == "__main__":
    fetch_and_filter_trials()
