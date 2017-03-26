# BCOIN BOILERPLATE

## Overview
This repo is to help you get up and running with a bcoin project on node

## Includes
* Option for React front end build
* Option for jQuery front end build
* Front end forms have functionality available for most wallet database interactions:
  * creating new wallets
  * generating addresses
  * getting wallet information
  * adding data to blockchain via OP_RETURN
* Nodejs router to send client side requests to a bcoin node endpoint
* Bcoin Node with two configs available: one for testnet full node and one for testnet spv node

## Architecture
1.  The client offers several forms to access useful features of the bcoin node REST API.
2. These forms make AJAX requests to a NodeJS/Express server (default runs on port 5000). Non-bcoin requests can be handled as normal on this server (e.g. static assets)
3. Any request from the client that starts with `/node` is routed to a bcoin server (default runs on port 18332)


## Setup
* Clone repository to local
* Navigate to project directory
* run `npm install`

#### Default Front End (w/ jQuery)
*(This builds from the `client/src` directory, with `client/src/index.js` as its entry point)*
* run `npm run watch` to build js and output to `dist/build.js`. Will watch for updates to js in react-src directory
* run `npm run build` for prod build (no verbose or source maps or watch)

**-- OR --**

#### React Front End
*(This builds from the `client/react-src` directory, with `client/react-src/index.js` as its entry point)*
* run `npm run watch:react` to build js and output to `dist/build.js`. Will watch for updates to js in src directory
* run `npm run build:react` for prod build (no verbose or source maps or watch)

#### Styling
By default, stylings are just in `client/dist/build.css` which is requested in the empty index.html file. You can add your own build process for SASS, LESS, modularized css, uglification, etc. but there are none by default

#### Steps to Run Servers
* navigate to project directory
* run `npm run start-server`
* in another session run either `npm run start-bcoin` for a testnet full node or `npm run start-spv` for SPV node
* send bcoin requests to http://localhost:5000/node/
* client is served from http://localhost:5000

default config file is setup in `./bcoin-config.js`. This can be customized with your own options or you can specify your own config with the npm config param `--config`. e.g. `npm --config=./custom-config.js run start-bcoin`


Nodejs server runs on port 5000 by default and acts as a router sending any requests to /node/ to the bcoin node (which runs on port 8080)

## Gotchas and Troubleshooting
* when in doubt `rm -rf node_modules && npm i`. There are some tricky dependencies that sometimes get missed, so deleting your node modules will usually help fix this.
* bcoin is still in active development so we've stabilized on the most recent version where this repo was known to work (currently 1.0.0-beta.11)
* Check that the NodeJS server/router is using the correct port for bcoin requests

## Notes
* uses eslint with airbnb configs. These are quite strict but make the code nice and consistent, enforcing ES6 notation where possible. This can be changed via the .eslintrc.json config file.
* There are two servers that need to be run- one is the bcoin node (which is set at a default :8080 port) and the other is a regular node server with router that runs on port :5000. The node server routes requests to the `/node` endpoint to the bcoin node
* create your own config.js in the main directory that exports an object with your BCOIN_API_KEY
