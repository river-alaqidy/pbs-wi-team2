"""
Remove duplicate items from input file and save file
with only unique rows in output file.

While working there were some issues with initial
files having duplicates and AWS Personalize gives better 
results if files such as items and users have unique rows.
"""

import csv

INPUT_FILE = 'Team2ItemsAll.csv' # located in s3 bucket
OUTPUT_FILE = 'Team2ItemsAllDistinct.csv' # located in s3 bucket

def deduplicate_items(input_file, output_file):
    seen = set()
    unique_rows = []

    with open(input_file, 'r', newline='', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames

        for row in reader:
            row_tuple = tuple(row[field] for field in fieldnames)
            if row_tuple not in seen:
                seen.add(row_tuple)
                unique_rows.append(row)

    with open(output_file, 'w', newline='', encoding='utf-8') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(unique_rows)

    print(f"Deduplicated file saved as '{output_file}'. Removed {len(seen) - len(unique_rows)} duplicates.")

if __name__ == '__main__':
    deduplicate_items(INPUT_FILE, OUTPUT_FILE)
