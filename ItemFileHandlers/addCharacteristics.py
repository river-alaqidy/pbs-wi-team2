"""
This file adds distinct characterstics specified to items.csv file
The characteristics can be things like duration, creation_timestamp,
genre, content-rating, etc.

It retrieves these characteristics from the media manager api. Since
these calls can be time consuming promised async calls are used to do 
mass data processing at once. A progress bar library is used to show
the script is still running because it can take some time
"""

import csv
import asyncio
import aiohttp
from tqdm.asyncio import tqdm_asyncio
from datetime import datetime

# info below removed to keep out of commit history
API_URL = '' # need to input media manager api ASSET url
AUTH_HEADER = {
    'Authorization': '' # needs to have Base64-encoded string from media manager combo of user and pass
}
# input file will be modified when script is run
INPUT_FILE = 'Team2ItemsAllDistinct.csv' # uses item id to find specified attribute in media manager api

MEDIA_ATTRIBUTE = 'premiered_on' # characterisitc in media manager api
ITEM_COLUMN = 'CREATION_TIMESTAMP' # new column corresponding to media manager api attribute

# Convert the date string to Unix epoch time
# this is for the creation timestamp use case, not used for non-datetime objects
def to_unix_timestamp(date_str):
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        return int(dt.timestamp())
    except ValueError:
        return None

async def fetch_asset(session, item_id):
    url = f"{API_URL}/{item_id}"
    try:
        async with session.get(url, headers=AUTH_HEADER) as response:
            if response.headers.get('Content-Type', '').startswith('application/json'):
                data = await response.json()
                attr = data["data"]["attributes"][MEDIA_ATTRIBUTE]
                return to_unix_timestamp(attr) # only used for datetime strings/objects
                # return attr # in other cases
            else:
                return None
    except Exception:
        return None

async def fetch_all_assets(item_ids):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_asset(session, item_id) for item_id in item_ids]
        return await tqdm_asyncio.gather(*tasks, desc="Fetching", total=len(tasks))

def main():
    seen = {}
    with open(INPUT_FILE, 'r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            seen[row['ITEM_ID']] = row 

    rows = list(seen.values())
    fieldnames = list(rows[0].keys())

    if ITEM_COLUMN not in fieldnames:
        fieldnames.append(ITEM_COLUMN)
        for row in rows:
            row[ITEM_COLUMN] = ''

    item_ids = [row['ITEM_ID'] for row in rows]

    loop = asyncio.get_event_loop()
    durations = loop.run_until_complete(fetch_all_assets(item_ids))

    for i, duration in enumerate(durations):
        rows[i][ITEM_COLUMN] = duration if duration is not None else ''

    with open(INPUT_FILE, 'w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Updated and deduplicated {len(rows)} items, saved to '{INPUT_FILE}'.")

if __name__ == "__main__":
    main()
