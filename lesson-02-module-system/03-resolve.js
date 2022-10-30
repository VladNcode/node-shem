'use strict';

const exp = require('./01-export.js');
const expPath = require.resolve('./01-export.js');
const expModule = require.cache[expPath];
console.log({ exp, expPath, expModule });

const events = require('node:events');
const eventsPath = require.resolve('node:events');
const eventsModule = require.cache[eventsPath];
console.log({ events, eventsPath, eventsModule });
