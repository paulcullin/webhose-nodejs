'use strict'

var Get = require('./get.js'),
    Webhose = require('./webhose.js');

var get = new Get();
var client = new Webhose(get);
client.enums = require('./enums.js');
client.errors = require('./errors.js');
client.Post = require('./post.js');

module.exports = client;