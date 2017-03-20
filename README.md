# BCOIN BOILERPLATE
## Overview
This repo is to help you get up and running with a bcoin project on node

## Includes

## Setup
* Navigate to project directory

### Default Frontend (w/ jQuery, no other framework)
This builds from the `client/react-src` directory, with `client/react-src/index.js` as its entry point
* run `npm run watch` to build js and output to dist/build.js. Will watch for updates to js in react-src directory
* run `npm run build` for prod build (no verbose or source maps or watch)

### React Frontend
* run `npm run watch:react` to build js and output to dist/build.js. Will watch for updates to js in src directory
* run `npm run build:react` for prod build (no verbose or source maps or watch)

## Steps to Run Servers
* navigate to project directory
* run `npm run start-server`
* in another session `npm run start-bcoin` to start a testnet full node. To start an SPV node on testnet run `npm run start-spv` instead
* send bcoin requests to http://localhost:5000/node/
* client is served from http://localhost:5000

default config file is setup in ./bcoin-config.js. This can be customized with your own options or you can specify your own config with the npm config param --config. e.g. `npm --config=./custom-config.js run start-bcoin`


Nodejs server runs on port 5000 by default and acts as a router sending any requests to /node/ to the bcoin node (which runs on port 8080)

## Notes
* uses eslint with airbnb configs. These are quite strict but make the code nice and consistent, enforcing ES6 notation where possible. This can be changed via the .eslintrc.json config file.
* There are two servers that need to be run- one is the bcoin node (which is set at a default :8080 port) and the other is a regular node server with router that runs on port :5000. The node server routes requests to the `/node` endpoint to the bcoin node
* create your own config.js in the main directory that exports an object with your BCOIN_API_KEY
