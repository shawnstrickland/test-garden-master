# test-garden-master
![deploy to lambda](https://github.com/shawnstrickland/test-garden-master/workflows/deploy%20to%20lambda/badge.svg)

Lawn & garden advice via AI and text messaging

## Why a Monorepo?
Since these are Lambdas and are written independently of each other, it does make sense to have a repo for each function, but for the time being, and organization of this project, it made sense to keep everything in one repo.

## Build & Deply
Github Actions will run all the build and testing necessary, then deploy to each lambda automatically.

## Test
Code coverage is important, and testing should be as well

## Use
Utilizing S3, Lambdas, Google Sheets API< and Twilio, create a chat-bot style text messaging app to help lawn and garden users.
Provides a rain guage interface using weather stations to grab data every day, save the results to S3 and report back at specified intervals. Gardeners can use this information to water more responsibly, predict when to start and stop their season, and provide other tips and tricks based on language and data.
