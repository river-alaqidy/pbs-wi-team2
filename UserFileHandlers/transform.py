"""
This script takes in initial anonymized user data and 
cleans up instances of user interactions into a user
file that contains one row per unique user.

Most important functioning is to gather genre preferences
for each user by taking multiple rows of user interactions
with the genre listed for each show they watched in WPNE
file, and adding the genre to a list of genre preferences in
users.csv file which will go into single row.
"""

import csv
import os
from collections import defaultdict

INPUT_FILE = 'WPNE_1_Cleaned_Updated.csv' # initial anonymized dataset
OUTPUT_FILE = 'users.csv' # located in s3 bucket

# Mapping of input to output field names
FIELD_MAP = {
    'UID': 'USER_ID',
    'Email': 'EMAIL',
    'Membership ID': 'MEMBERSHIP_ID',
    'Device': 'DEVICE'
}

GENRE_COLUMN = 'Genre'
OUTPUT_GENRE_FIELD = 'GENRE_PREFERENCE'

def main():
    user_data = {}
    genre_map = defaultdict(set)  # Use set to automatically deduplicate genres

    with open(INPUT_FILE, 'r', newline='', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)

        for row in reader:
            uid = row.get('UID', '').strip()
            if not uid:
                continue  # Skip rows with no UID

            # Initialize the user data if not already present
            if uid not in user_data:
                user_data[uid] = {
                    output_field: row.get(input_field, '').strip()
                    for input_field, output_field in FIELD_MAP.items()
                }

            # Add genre if available
            genre = row.get(GENRE_COLUMN, '').strip()
            if genre:
                genre_map[uid].add(genre)

    # Prepare final output rows
    output_rows = []
    for uid, data in user_data.items():
        genres = genre_map.get(uid, set())
        if genres:
            data[OUTPUT_GENRE_FIELD] = '|'.join(sorted(genres))  # Sorted for consistency
        else:
            data[OUTPUT_GENRE_FIELD] = ''
        output_rows.append(data)

    # Final fieldnames
    output_fieldnames = list(FIELD_MAP.values()) + [OUTPUT_GENRE_FIELD]

    # Write to output CSV
    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=output_fieldnames)
        writer.writeheader()
        writer.writerows(output_rows)

    print(f"Processed {len(output_rows)} users and saved to '{OUTPUT_FILE}'.")

if __name__ == "__main__":
    main()
