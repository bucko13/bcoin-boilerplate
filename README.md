# BCOIN BOILERPLATE
## Overview
This repo is to help you get up and running with a bcoin project on node

## Includes

## Steps to Run
* navigate to project directory
* run `node server/server.js`
* in another session `node server/bcoin-server.js`
* send bcoin requests to http://localhost:5000/node/
* open client on http://localhost:5000

Nodejs server runs on port 5000 by default and acts as a router sending any requests to /node/ to the bcoin node (which runs on port 8080)

## Notes
* uses eslint with airbnb configs. These are quite strict but make the code nice and consistent, enforcing ES6 notation where possible. This can be changed via the .eslintrc.json config file.
* There are two servers that need to be run- one is the bcoin node (which is set at a default :8080 port) and the other is a regular node server with router that runs on port :5000. The node server routes requests to the `/node` endpoint to the bcoin node
* create your own config.js in the main directory that exports an object with your BCOIN_API_KEY
