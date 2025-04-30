# pbs-wi-team2
- Link to Repository: [pbs-wi-team2](https://github.com/river-alaqidy/pbs-wi-team2)

## *Set Up Steps*

### Run Site (React + PHP User Interface):
#### Summary
> The React + PHP site that displays the show recommendations from aws in a user friendly\
way was done by using react vite in development mode and using a php proxy server to interact\
with the Media Manager API. The Site is not deployed so it must be run in these following steps
in development mode.

> Actual Description of how the site works is discussed in the *Overview of AWS Services and Code* section below

### IMPORTANT - Must DO: API Key + Password Safety
> In order for the site to run it needs an env file in the api folder `api/.env.php`\
This is git ignored for the repo so that api information is protected. You will need to\
make this file with this structure (you can copy and paste, then fill out with actual keys and passwords):
```php
<?php

return [
    'CLIENT_ID' => 'API Key',
    'CLIENT_SECRET' => 'Secret Key',
    'BASE_URL' => 'https://media.services.pbs.org/api/v1',
    'BASIC_AUTH_KEY' => 'Base64-encoded basic authorization key that is combinatiton of key + secret key'
];
```

#### Run (steps done in terminal)
1. In pbs-wi-team2 folder change directories to **/SiteScript**
2. Make sure run.sh has execution persmissions, if not enter `chmod +x run.sh`
3. run program `./run.sh` and follow link [http://localhost:5173/] generated in terminal

#### What the run.sh Script Does
1. Frontend Portion was made with Vite ReactJS
    - MUST first change directory to /app and run `npm install`
2. Change directory to /api
    - run `php -S localhost:8000 &`
    - this will run a proxy server that we can access the Media Manager API through the API client
3. Change directory back to /app
    - run `npm run dev`

#### MUST DO: Once Done Using The Site
> the php code makes a proxy server that is running on your local machine. You'll want to\
kill the php program, and the cleanest way to do it is listed below
- type in terminal `q + enter` to finish running site in dev mode
- run `ps`
- run `kill #` where # is the PID for localhost:8000

Example: 
- the php proxy server will be labeled as `php -S localhost:8000`
```
PID TTY           TIME CMD
76522 ttys000    0:00.11 -zsh
76563 ttys002    0:00.10 /bin/zsh -il
77807 ttys002    0:00.01 /bin/bash ./run.sh
77811 ttys002    0:00.00 php -S localhost:8000
76913 ttys004    0:00.04 /bin/zsh -i
```
- run `kill 77811` to end proxy server

### Required Resouces
> This is just a list of resources that were needed to run React site and their links. The actual\
descriptions of how to use the AWS services are discussed in the *Overview of AWS Services and Code* \
section listed below.

AWS Resources:
- S3 
    - Bucket: [pbs-data-team2](https://us-east-1.console.aws.amazon.com/s3/buckets/pbs-data-team-2?region=us-east-1&tab=objects&bucketType=general)
    -  Files: 
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
- Step Functions

API:
- [Media Manager API](https://docs.pbs.org/space/CDA/3047426/Media+Manager+API)
- [PBS Media Manager Client](https://github.com/tamw-wnet/PBS_Media_Manager_Client?tab=readme-ov-file)

## *Overview of AWS Services and Code*
### AWS Resources

- #### S3
    - In order to use Personalize for recommendations S3 needs a bucket with atleast 3 files
        1. Created S3 bucket, we have made bucket [pbs-data-team-2](https://us-east-1.console.aws.amazon.com/s3/buckets/pbs-data-team-2?region=us-east-1&tab=objects&bucketType=general)
        2. In Bucket you need 3 files, interactions.csv, users.csv, and items.csv
            - Schemas For Files:
                > interactions.csv: USER_ID, ITEM_ID, TIMESTAMP, EVENT_TYPE

                > users.csv: USER_ID, EMAIL, MEMBERSHIP_ID, DEVICE, GENRE_PREFERENCE\
                    - GENRE_PREFERENCE is collected list of genres user has watched in past according to WPNE dataset

                > items.csv: ITEM_ID, GENRES, CREATION_TIMESTAMP\
                    - Team2ItemsAllDistinctGenreOnly.csv is the name of the final file we used for demo
- #### Lambda
    - Lambda was used to connect our Personalize recommendation results to API Gateway so that our frontend could retrieved results
        1. Created Lambda Function, we made function [team2PersonalizeRecommender](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/team2PersonalizeRecommender?tab=code)
        2. This lamnda function follows one of two routes, /recommendatons or /sims and will use our Personalize campaigns that align with the designated route. /recommendations goes with user-personalizetion recipe and sims goes with similar-items recipe.
- #### API Gateway
    - We made an API that has 2 routes in which the frontend can connect to and get different results. Our API is [Personalize2API](https://us-east-1.console.aws.amazon.com/apigateway/main/apis/8v7afwqlb1/resources?api=8v7afwqlb1&region=us-east-1)
        1. Route /recommendations gets user-personaliztion recommendations for our user, this is a POST Method
        2. Route /simis gets similar-items recommendations for inputted item, we used items the user has watched in the past, this is a POST method
        3. In order for both routes to work you must enable CORS, we just used the '*' option.
        4. Final step to get gateway running is to click Deploy API button, you can then select any staging route you would like. 

- #### Personalize
    - We created a Dataset group: [pbs-recommendation-team2v2](https://us-east-1.console.aws.amazon.com/personalize/home?region=us-east-1#arn:aws:personalize:us-east-1:715841365024:dataset-group$pbs-recommendation-team2v2/setup)
        - The Domain for this dataset group is Video On Demand
    1. This dataset group uses 3 datasets interactions, users, and items in step 1 titled: Create datasets and import data
    2. You can then run an analysis on the data and see what the contents of the files are and any adjustments you can make
    3. In the left navigator you can go to Custom Resources -> Solutions and recipes, to see solutions for user-personalization recipes and similar items recipes. Solutions are basically ai models trained on your data imported. If you are expecting more data to enventually come in you can make the solutions automatically train and update. For our implementation we turned off automatic training to hopefully decrease costs
        - our two solutions are user-pers and sims. For these to be usable you will need to create a current version for each
    4. For each solution you need to make a campaign. A campaign is essentially an accessible version of the solution for an app to use.
        - The campaign arn is needed for usage in the Lambda functions. There are currently 2 campaigns, one for each solutions

- #### Glue

- #### Step Functions

### Website Code

- #### React + JavaScript

- #### PHP

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











## *What Works & What Doesn’t*
Works:
- Current combination of S3, Lambda, Personalize, API Gateway, Step Functions, React + PHP UI

Doesn't Work:
- Everything should be working

## *What We Would Work On Next*
Cost Analysis:
- Per our mentor discussions the next highest priority is finding services or\
approaches that are more cost effective then the current combination of AWS services

## Other Resources
- [Media Manager API](https://docs.pbs.org/space/CDA/3047426/Media+Manager+API)
- [PBS Media Manager Client](https://github.com/tamw-wnet/PBS_Media_Manager_Client?tab=readme-ov-file)