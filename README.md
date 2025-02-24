# pbs-wi-team2

## Resources
- [Media Manager API](https://docs.pbs.org/space/CDA/3047426/Media+Manager+API)
- [PBS Media Manager Client](https://github.com/tamw-wnet/PBS_Media_Manager_Client?tab=readme-ov-file)

## Password Safety
- in api folder make .env.php file and make .gitignore with .env.php in it
- make .env have this stucture
```
<?php

return [
    'CLIENT_ID' => 'user',
    'CLIENT_SECRET' => 'pass',
    'BASE_URL' => 'base url from media manager api'
];
```

## Scrum Sprint 1 Instructions to Run Proxy Server and Dev Site with Media Manager Client

### IMPORTANT: Before Running Scripts Change Directory to /Scrum1Scripts

### Run Website Dev Session
1. give execution persmission to run.sh `chmod +x run.sh`
2. run program and follow link generated in terminal `./run.sh`

### What the run.sh Script Does
1. Frontend Portion was made with Vite ReactJS
    - MUST first change directory to /app and run `npm install`
2. Change directory to /api
    - run `php -S localhost:8000 &`
    - this will run a proxy server that we can access the Media Manager API through the API client
3. Change directory back to /app
    - run `npm run dev`
    - follow the local host link that generates in terminal


### MUST DO: When done with using site
- type in terminal `q + enter` to finish running site in dev mode
- run `ps`
- run `kill #` where # is the PID for localhost:8000


