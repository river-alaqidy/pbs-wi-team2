# pbs-wi-team2

- Link to Repository: [pbs-wi-team2](https://github.com/river-alaqidy/pbs-wi-team2)

## Set Up Steps

### Run Site (React + PHP User Interface)

#### Summary

> The React + PHP site that displays AWS-powered show recommendations uses **Vite** for React in development mode and a **PHP proxy server** to connect to the Media Manager API. The site is not deployed, so it must be run locally.

### ⚠️ IMPORTANT - API Key + Password Safety

> The application requires a `.env.php` file at `api/.env.php`. This file is **git-ignored** for security reasons. The `make setup` command will automatically generate the structure if it does not already exist. You must then fill in your actual credentials.

Generated content:

```php
<?php

return [
    'CLIENT_ID' => 'API Key',
    'CLIENT_SECRET' => 'Secret Key',
    'BASE_URL' => 'https://media.services.pbs.org/api/v1',
    'BASIC_AUTH_KEY' => 'Base64-encoded basic authorization key that is combination of key + secret key'
];
```

### ✅ Running the App Locally

From the **root `pbs-wi-team2/` directory**, use the following commands via Makefile:

1. **Set up dependencies and `.env.php` file (only if missing)**

```bash
make setup
```

- Creates `api/.env.php` if it doesn't already exist
- Installs React frontend dependencies in `app/`

2. **Run the app (starts PHP proxy and Vite dev server)**

```bash
make run
```

- Starts the PHP proxy server at `localhost:8000`
- Starts the React frontend (Vite dev server) at `localhost:5173`

3. **Stop the PHP server**

```bash
make kill
```

- Cleanly stops the PHP proxy server using `pkill -f "php -S localhost:8000"`

---

### Required Resouces

> This is just a list of resources that were needed to run React site and their links. The actual\
> descriptions of how to use the AWS services are discussed in the _Overview of AWS Services and Code_ \
> section listed below.

AWS Resources:

- S3
  - Bucket: [pbs-data-team2](https://us-east-1.console.aws.amazon.com/s3/buckets/pbs-data-team-2?region=us-east-1&tab=objects&bucketType=general)
  - Files:
    - Interactions Data: [interactions.csv](https://us-east-1.console.aws.amazon.com/s3/object/pbs-data-team-2?region=us-east-1&bucketType=general&prefix=interactions.csv)
    - Items Data: [Team2ItemsAllDistinctGenreOnly.csv](https://us-east-1.console.aws.amazon.com/s3/object/pbs-data-team-2?region=us-east-1&bucketType=general&prefix=Team2ItemsAllDistinctGenreOnly.csv)
    - Users Data: [users.csv](https://us-east-1.console.aws.amazon.com/s3/object/pbs-data-team-2?region=us-east-1&bucketType=general&prefix=users.csv)
- Lambda
  - Recommendation Retriever Function: [team2PersonalizeRecommender](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/team2PersonalizeRecommender?tab=code)
- API Gateway
  - Gateway to make Recommendations Accessible for UI: [Personalize2API](https://us-east-1.console.aws.amazon.com/apigateway/main/apis/8v7afwqlb1/resources?api=8v7afwqlb1&region=us-east-1)
- Personalize
  - Team 2 Dataset Group: [pbs-recommendation-team2v2](https://us-east-1.console.aws.amazon.com/personalize/home?region=us-east-1#arn:aws:personalize:us-east-1:715841365024:dataset-group$pbs-recommendation-team2v2/setup)
  - Solutions:
    - User Personalization: [user-pers](https://us-east-1.console.aws.amazon.com/personalize/home?region=us-east-1#arn:aws:personalize:us-east-1:715841365024:dataset-group$pbs-recommendation-team2v2/solutionsAndRecipes/solutionDetail/arn:aws:personalize:us-east-1:715841365024:solution$user-pers)
    - Similar Items: [sims](https://us-east-1.console.aws.amazon.com/personalize/home?region=us-east-1#arn:aws:personalize:us-east-1:715841365024:dataset-group$pbs-recommendation-team2v2/solutionsAndRecipes/solutionDetail/arn:aws:personalize:us-east-1:715841365024:solution$sims)
  - Campaigns:
    - User Personalization: [userpers-team2-Campaign](https://us-east-1.console.aws.amazon.com/personalize/home?region=us-east-1#arn:aws:personalize:us-east-1:715841365024:dataset-group$pbs-recommendation-team2v2/campaigns/campaignDetail/arn:aws:personalize:us-east-1:715841365024:campaign$userpers-team2-Campaign)
    - Similar Items: [sims-campaign](https://us-east-1.console.aws.amazon.com/personalize/home?region=us-east-1#arn:aws:personalize:us-east-1:715841365024:dataset-group$pbs-recommendation-team2v2/campaigns/campaignDetail/arn:aws:personalize:us-east-1:715841365024:campaign$sims-campaign)
- Glue
  - Pre-map Glue Job: [team2-pre-map-job](https://us-east-1.console.aws.amazon.com/gluestudio/home?region=us-east-1#/editor/job/team2-pre-map-job)
  - Post-map Glue Job: [team2-Post-map-job](https://us-east-1.console.aws.amazon.com/gluestudio/home?region=us-east-1#/editor/job/team2-post-map-job)
- Step Functions
  - ETL State Machine: [team2-state-machine](https://us-east-1.console.aws.amazon.com/states/home?region=us-east-1#/statemachines)

🔒 Note: Some of the console link includes your AWS Account ID, so it only works if you're logged into the correct AWS account with permission.

API:

- [Media Manager API](https://docs.pbs.org/space/CDA/3047426/Media+Manager+API)
- [PBS Media Manager Client](https://github.com/tamw-wnet/PBS_Media_Manager_Client?tab=readme-ov-file)

## _Overview of AWS Services and Code_

### AWS Resources

#### S3

- S3 is used to store input datasets required by Amazon Personalize. Three files are needed: `interactions.csv`, `users.csv`, and `items.csv`.
- We created an S3 bucket named [pbs-data-team-2](https://us-east-1.console.aws.amazon.com/s3/buckets/pbs-data-team-2?region=us-east-1&tab=objects&bucketType=general).
- **Dataset file schemas**:
  - `interactions.csv`: `USER_ID`, `ITEM_ID`, `TIMESTAMP`, `EVENT_TYPE`
  - `users.csv`: `USER_ID`, `EMAIL`, `MEMBERSHIP_ID`, `DEVICE`, `GENRE_PREFERENCE`
    - `GENRE_PREFERENCE` is a derived list of genres each user has engaged with, based on the WPNE dataset.
  - `items.csv`: `ITEM_ID`, `GENRES`, `CREATION_TIMESTAMP`
    - Our final demo file was named `Team2ItemsAllDistinctGenreOnly.csv`.

#### Lambda

- AWS Lambda is used to connect Personalize recommendation results to API Gateway, allowing frontend access.
- We created a Lambda function named [team2PersonalizeRecommender](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/team2PersonalizeRecommender?tab=code).
- The function supports two routes:
  - `/recommendations` → calls the **user-personalization** campaign
  - `/sims` → calls the **similar-items** campaign

#### API Gateway

- API Gateway exposes our Lambda functionality to the frontend via HTTP endpoints.
- Our API is called [Personalize2API](https://us-east-1.console.aws.amazon.com/apigateway/main/apis/8v7afwqlb1/resources?api=8v7afwqlb1&region=us-east-1) and has two routes:
  1. `POST /recommendations`: retrieves user-personalization recommendations
  2. `POST /sims`: retrieves similar-item recommendations for a given item ID
- CORS must be enabled (we used `*` for simplicity)
- After setting up, click **"Deploy API"** and choose your desired stage (e.g., `dev`)

#### Personalize

- We created a dataset group named [pbs-recommendation-team2v2](https://us-east-1.console.aws.amazon.com/personalize/home?region=us-east-1#arn:aws:personalize:us-east-1:715841365024:dataset-group$pbs-recommendation-team2v2/setup), with the **Video on Demand** domain.
- Steps followed:
  1. Created 3 datasets: `interactions`, `users`, and `items`, and imported the corresponding S3 data
  2. Ran data analysis to verify quality and compatibility
  3. Under **Custom Resources → Solutions and Recipes**, created:
     - A solution for **user-personalization**
     - A solution for **similar-items**
     - We **disabled automatic retraining** to reduce ongoing costs
  4. For each solution, we created a **campaign** (a live, queryable endpoint for your app)
     - The campaign ARNs are used in the Lambda function to route the correct recommendation logic

#### Step Functions

- We used **AWS Step Functions** to orchestrate the entire ETL pipeline, combining multiple AWS Glue and Lambda tasks into a streamlined, repeatable workflow.
- State machine: [`team2-state-machine`](https://console.aws.amazon.com/states/home?region=us-east-1#/v2/statemachines/view/arn:aws:states:us-east-1:715841365024:stateMachine:team2-state-machine)

1. **Pre-Map Glue Job**

   - Splits the raw input into three structured datasets: `items`, `users`, and `interactions`.
   - Drops duplicates in `items` and `users`, normalizes timestamps in `interactions`.
   - Outputs cleaned files to S3, ready for enrichment.

2. **Map State Over Items Dataset**

   - The Step Functions **Map** state is used to iterate over batches of the `items` dataset (36 total batches in our 50,000-row test case).
   - ❗️**Important Note:**  
     The **batching logic is handled inside the Lambda function**, not through the Map state's built-in batch size config.
     - Each Lambda invocation receives a batch of item IDs.
     - It performs a **batch API call** to the PBS Media Manager API (10 items per call).
     - Each item is enriched with the `creation_timestamp` field from the API’s JSON response.
   - The result is a set of **enriched JSON batches** stored in S3.

   > 💡 Although Step Functions Map supports batch size and concurrency limits, we did **not explicitly configure** them.  
   > With 36 concurrent Lambda executions, the current setup worked for our dataset (~50,000 rows), but **scaling** would benefit from adding a **concurrency cap**.

3. **Post-Map Glue Job**

   - Combines all enriched `items` and `users` JSON batches into unified, clean datasets.
   - The `interactions.csv` dataset is passed through untouched from the pre-map stage.

4. **Final Lambda Function**
   - Renames the output datasets in S3 to `items.csv`, `users.csv`, and `interactions.csv`.
   - This ensures the final outputs conform to Amazon Personalize’s import format.

### Website Code

#### React + JavaScript

> Our React app is built using Vite. `main.jsx` loads the `App` component, which handles all API calls and rendering of TV show recommendations.

- In `App.jsx`, `react-bootstrap` is used to create:

  - A **navbar** with a user dropdown to switch between different anonymized users
  - **Three swimlanes** (horizontal carousels) of TV show recommendations using `react-multi-carousel`
  - **Loading placeholders** that animate while data is being fetched

- **Box Component**:

  - A reusable card-like component that displays TV show information such as title, image, genre, duration, etc.

- **SwimLane Component**:

  - Displays a title and either loading placeholders or a scrollable carousel of `Box` components based on the loading state.

- **App Component**:
  - Loads 3 predefined anonymized users (based on WPNE dataset)
  - Uses `useEffect` to trigger 3 API calls upon user selection:
    - AWS Personalize for user-based recommendations
    - AWS Personalize for similar-items to 2 previously watched shows
  - Each set of recommended item IDs is passed to a local Media Manager API to fetch show metadata (images, genres, durations, etc.)
  - This metadata is displayed inside the corresponding `SwimLane` carousel

#### PHP

> `index.php` acts as a proxy server that makes **Multi-cURL Asset Requests** to send parallel requests to the Media Manager API in order to retrieve detailed information about TV shows. Notably, instead of using the Media Manager API client, we use direct URL calls due to performance issues related to slow data loading when using the client for getting one item at a time.

- **Backend Setup**:

  - First, **CORS permissions** are enabled through HTTP headers. This is necessary to allow the frontend (React) to make cross-origin requests to the backend API, enabling communication between different domains.
  - The `POST` request sent from the frontend is parsed to retrieve the **recommendation IDs**. These IDs are extracted from the incoming request and are then prepared to be used in the cURL requests to fetch the corresponding asset data.

- **cURL**:

  - For each **recommendation ID**, a parallel cURL request is made to fetch the associated **asset details**. This is achieved using **multi-cURL**, which allows multiple HTTP requests to be sent simultaneously. This approach reduces loading time compared to sequential requests.
  - After fetching the assets, the script **processes the results** to extract relevant details, such as the **show ID**. This is necessary to collect additional information about the show, both specific to the asset and general information about the show itself (e.g., title, genre).

- **Data Processing**:

  - After all asset and show data is fetched, the script **combines** the information into a structured final response. This response includes:

    - **Show name**: The title of the show related to the recommendation.
    - **Show image**: A URL to the image of the show.
    - **Show genre**: The genre of the show (e.g., Drama, Comedy).
    - **Episode name**: The title of the specific episode tied to the recommendation.
    - **Episode duration**: The length of the episode (e.g., 45 minutes).
    - **Episode premiere date**: The date the episode originally aired.

  - The script outputs this combined data as a **JSON response**, which is then returned to the frontend for rendering. This structured data enables the frontend to display the information to the user in a clear and organized manner.

### Data Processing Code

- #### /ItemFileHandlers Directory

  - addCharacteristics.py:
    > This script enriches the items.csv file with characteristics like duration and genre by asynchronously fetching data from\ the media manager API, using a progress bar to track the potentially lengthy process.
  - dup.py:
    > This helper script checks for and reports duplicate entries in an items file to ensure clean data for AWS Personalize usage.
  - remove_repeat.py:
    > This script removes duplicate rows from an input file and saves only unique entries to an output file to improve data quality for AWS Personalize.

- #### /UserFileHandlers Directory
  - dup.py:
    > This helper script checks a dataset for duplicate rows to ensure clean, unique data for use with AWS Personalize.
  - transform.py
    > This script processes anonymized user interaction data to create a users.csv file with one row per user, consolidating each user's genre preferences into a single list for AWS Personalize.

## _What Works & What Doesn’t_

Works:

- Current combination of S3, Lambda, Personalize, API Gateway, Step Functions, React + PHP UI

Doesn't Work:

- Everything should be working

## _What We Would Work On Next_

Cost Analysis:

- Per our mentor discussions the next highest priority is finding services or\
  approaches that are more cost effective then the current combination of AWS services

## Other Resources

- [Media Manager API](https://docs.pbs.org/space/CDA/3047426/Media+Manager+API)
- [PBS Media Manager Client](https://github.com/tamw-wnet/PBS_Media_Manager_Client?tab=readme-ov-file)
