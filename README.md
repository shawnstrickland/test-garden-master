# test-garden-master
![deploy to lambda](https://github.com/shawnstrickland/test-garden-master/workflows/deploy%20to%20lambda/badge.svg)

Lawn & garden advice and automation via AI and text messaging

## Roadmap
[x] Collect Daily Precipitation for purposes of microclimates and exactness
[x] Log Precipitation rates, every X days send a text reminder about rainfall totals
[ ] Add personalized Alexa Skill for updates
[ ] Add bi-directional text messaging and NLP ("How much rainfall have we had this month?", "Do I need to water my X this week?")
[ ] Measure stored water via rain barrels
[ ] Utilize precipitation rates from above to determine when and how often to water landscape and garden with harvested rain water
[ ] Automate watering from rain barrels via Pi-like devices, servos, small pumps and drip irrigation.
[ ] Web interface/dashboard for it all

## But Why?
I'm really into plants and landscaping, but I'm kinda busy sometimes. So I sought out a hyper-local solution to watching how much rain has *actually* fallen in my space on Earth. This is helpful for determining what kind of watering I need to do right now to keep my plants and landscaping happy - and in the future - can even reactively compensate when water is available. Ideally, no water is wasted, and excess isn't used from municipal water services (because it's simply not needed).

## Why Hyper-local?
Microclimates are a very interesting weather phenomenon. You've probably experienced them before and never realized it. Just like it can rain on one side of the street but not the other, a microclimate can dictate how much more or less environment adjustments your location may need based on sun exposure, tree canopies, and other factors. This will wildly adjust what kind of rainfall (in particular) an area may need to flourish before it goes dormant. Spring rainfall flushes here (1.5" over an hour or two) provide plenty of rainfall to harvest and utilize in droughts during the hot and dry summer. If I can utilize technology and recycled resources to modify this as needed, why not? It's a lower water bill, fewer consumed resources, and better aesthetic (landscaped) value. A win, win, win!

## Why a Monorepo?
Since these are Lambdas and are written independently of each other, it does make sense to have a repo for each function, but for the time being, and organization of this project, it made sense to keep everything in one repo.

## Build & Deply
Github Actions will run all the build and testing necessary, then deploy to each lambda automatically.

## Test
Code coverage is important, and testing should be as well. So please nudge me and let me know to write more tests!

## Use
Utilizing S3, Lambdas, and Google Sheets API, create a chat-bot style text messaging app to help in my own lawn and garden.
Provides a rain guage interface using weather stations to grab data every day, save the results to S3 and report back at specified intervals. Ideally, gardeners can use this information to water more responsibly, predict when to start and stop their season, and provide other tips and tricks based on language and data.
