"""
Helper Script used for Data Processing to make sure no duplicates are
in items or users for their usage in AWS Personalize
"""

import csv

INPUT_FILE = 'Team2ItemsAllDistinct.csv' # located in s3 bucket

def find_duplicates(input_file):
    seen = set()
    duplicates = 0
    total_rows = 0

    with open(input_file, 'r', newline='', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames

        for row in reader:
            total_rows += 1
            row_tuple = tuple(row[field] for field in fieldnames)
            if row_tuple in seen:
                duplicates += 1
            else:
                seen.add(row_tuple)

    print(f"Total rows: {total_rows}")
    print(f"Duplicate rows: {duplicates}")
    print(f"Unique rows: {total_rows - duplicates}")

if __name__ == '__main__':
    find_duplicates(INPUT_FILE)
