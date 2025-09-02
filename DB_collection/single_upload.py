import csv

def convert_csv_to_dict_list(file_path):
   
    selected_indices = [0, 2, 3, 5, 10, 13]

    dict_list = []

    with open(file_path, mode='r', newline='', encoding='utf-8-sig') as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader) 
        selected_headers = [headers[i] for i in selected_indices]           

        for row in reader:
            if len(row) > max(selected_indices):
                row_dict = {
                    selected_headers[i]: row[selected_indices[i]] 
                    for i in range(len(selected_indices))
                }
                dict_list.append(row_dict)
    
    print(dict_list)
    return dict_list

####################################

def upload_to_db(dict_data):
    for entry in dict_data:
        entry['source'] = 'CTIS'
        doc_ref = db.collection('derm').document(entry['EudraCT'])
        doc_ref.set(entry)

def main():
    dict_data = convert_csv_to_dict_list("/Users/adityasrikanth/Documents/Projects/derma-match-dublin/DB_collection/CTIS_Data/CTIS_trials_20250831.csv")

    upload_to_db(dict_data)

main()