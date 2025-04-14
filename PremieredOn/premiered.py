import csv
import asyncio
import aiohttp
from tqdm.asyncio import tqdm_asyncio
from datetime import datetime
import os
from dotenv import load_dotenv

API_URL = os.getenv("API_URL")
AUTH_HEADER = {
    'Authorization': f"Basic {os.getenv('AUTH_HEADER')}"
}
INPUT_FILE = "Team2Items.csv"

# Convert the date string to Unix epoch time
def to_unix_timestamp(date_str):
    try:
        # Handle "YYYY-MM-DD" format
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        return int(dt.timestamp())
    except ValueError:
        return None  # Return None if the date format is not as expected

async def fetch_asset(session, item_id):
    url = f"{API_URL}/{item_id}"
    try:
        async with session.get(url, headers=AUTH_HEADER) as response:
            if response.headers.get('Content-Type', '').startswith('application/json'):
                data = await response.json()
                premiered_on = data["data"]["attributes"]["premiered_on"]
                return to_unix_timestamp(premiered_on)
            else:
                return None
    except Exception:
        return None

async def fetch_all_assets(item_ids):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_asset(session, item_id) for item_id in item_ids]
        return await tqdm_asyncio.gather(*tasks, desc="Fetching", total=len(tasks))

def main():
    # Read the CSV into memory
    with open(INPUT_FILE, 'r', newline='') as file:
        reader = list(csv.DictReader(file))
        fieldnames = list(reader[0].keys())

    # Ensure CREATION_TIMESTAMP is a column
    if 'CREATION_TIMESTAMP' not in fieldnames:
        fieldnames.append('CREATION_TIMESTAMP')
        for row in reader:
            row['CREATION_TIMESTAMP'] = ''

    # Extract item IDs
    item_ids = [row['ITEM_ID'] for row in reader]

    # Fetch premiered_on values
    loop = asyncio.get_event_loop()
    premiered_dates = loop.run_until_complete(fetch_all_assets(item_ids))

    # Update the rows with Unix timestamp values
    for i, timestamp in enumerate(premiered_dates):
        reader[i]['CREATION_TIMESTAMP'] = timestamp if timestamp is not None else ''

    # Write updated data back to file
    with open(INPUT_FILE, 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(reader)

    print(f"Updated {len(premiered_dates)} items and wrote back to '{INPUT_FILE}'.")

if __name__ == "__main__":
    main()

# THIS VERSION DOES REGULAR TIME
# import csv
# import asyncio
# import aiohttp
# from tqdm.asyncio import tqdm_asyncio

# API_URL = 'https://media.services.pbs.org/api/v1/assets'
# AUTH_HEADER = {
#     'Authorization': 'Basic YThCUkl3REZnaU5FZnJWaTozSXlLZzBSSHF6SkVjekpqOFgyQmNzMU5nalVhT0F3YQ=='
# }
# INPUT_FILE = 'Team2Items.csv'

# async def fetch_asset(session, item_id):
#     url = f"{API_URL}/{item_id}"
#     try:
#         async with session.get(url, headers=AUTH_HEADER) as response:
#             if response.headers.get('Content-Type', '').startswith('application/json'):
#                 data = await response.json()
#                 return data["data"]["attributes"]["premiered_on"]
#             else:
#                 return ''
#     except Exception:
#         return ''

# async def fetch_all_assets(item_ids):
#     async with aiohttp.ClientSession() as session:
#         tasks = [fetch_asset(session, item_id) for item_id in item_ids]
#         return await tqdm_asyncio.gather(*tasks, desc="Fetching", total=len(tasks))

# def main():
#     # Read the CSV into memory
#     with open(INPUT_FILE, 'r', newline='') as file:
#         reader = list(csv.DictReader(file))
#         fieldnames = list(reader[0].keys())

#     # Ensure CREATION_TIMESTAMP is a column
#     if 'CREATION_TIMESTAMP' not in fieldnames:
#         fieldnames.append('CREATION_TIMESTAMP')
#         for row in reader:
#             row['CREATION_TIMESTAMP'] = ''

#     # Extract item IDs
#     item_ids = [row['ITEM_ID'] for row in reader]
#     # item_ids = item_ids[:3] # limit 3 for testing

#     # Fetch premiered_on values
#     loop = asyncio.get_event_loop()
#     premiered_dates = loop.run_until_complete(fetch_all_assets(item_ids))

#     # Update the rows with premiere dates
#     for i, date in enumerate(premiered_dates):
#         reader[i]['CREATION_TIMESTAMP'] = date

#     # Write updated data back to file
#     with open(INPUT_FILE, 'w', newline='') as file:
#         writer = csv.DictWriter(file, fieldnames=fieldnames)
#         writer.writeheader()
#         writer.writerows(reader)

#     print(f"Updated {len(premiered_dates)} items and wrote back to '{INPUT_FILE}'.")

# if __name__ == "__main__":
#     main()


