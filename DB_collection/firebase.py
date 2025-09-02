import firebase_admin
from firebase_admin import credentials, firestore

# Your service account key path
path_to_key = "/Users/adityasrikanth/Documents/Projects/derma-match-dublin/DB_collection/skinside-7b6df-firebase-adminsdk-fbsvc-f23e69482a.json"

# Initialize the app
if not firebase_admin._apps:
    cred = credentials.Certificate(path_to_key)
    firebase_admin.initialize_app(cred)

# Get a Firestore client
db = firestore. client()

# The data you want to add
user_data = {
    'name': 'Jeisun P',
    'age': 23,
    'school': 'UC Dublin',
}

#collection name: test document name: name
doc_ref = db.collection('test').document('jeisun_p')

# Use .set() to add the data
# doc_ref.set(user_data)

students_ref = db.collection('test')
query = students_ref.where('age', '==', 23)

docs = query.stream()
for doc in docs:
    data = doc.to_dict()
    print(f"Data: {data['name']}")

# print("Document added successfully with ID: aditya_srikanth")