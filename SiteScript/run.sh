#!/bin/bash

cd ../app
npm install
cd ../api
php -S localhost:8000 &
ps
cd ../app
npm run dev


