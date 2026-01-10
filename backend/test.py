import requests
import dotenv
import csv
import json
import sys

dotenv.load_dotenv()
N8N_WEBHOOK_URL = dotenv.get_key(dotenv.find_dotenv(), "N8N_WEBHOOK_URL")


def csv_to_json(csv_file_path, json_file_path):
    json_data = []
    
    with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
        # DictReader uses the first row as field names (keys)
        csv_reader = csv.DictReader(csvfile)
        
        for row in csv_reader:
            json_data.append(row)

    with open(json_file_path, 'w', encoding='utf-8') as jsonfile:
        # Dump the list of dictionaries to a JSON file
        # indent=4 makes the file human-readable
        json.dump(json_data, jsonfile, indent=4)

if __name__ == "__main__":
    csv_file_path = 'backend\\fedex_input.csv'
    json_file_path = 'backend\\fedex_output.json'
    csv_to_json(csv_file_path, json_file_path)
    
    # Send JSON data to n8n webhook
    with open(json_file_path, 'r', encoding='utf-8') as jsonfile:
        data = json.load(jsonfile)
        response = requests.post(N8N_WEBHOOK_URL, json=data)
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Content: {response.text}")
        # remove the json
    import os
    os.remove(json_file_path)
    