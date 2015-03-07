'use strict'

var request = require('request'),
    qs = require('querystring'),
    Errors = require('./errors.js');

var Get = function () {
};

Get.prototype.send = function (q, options, cb) {
    var postUrl = process.env.WEBHOSE_URI + '?'; // + '?token=' + process.env.WEBHOSE_TOKEN + '&q=' + q;

    if (!q) {
        throw Errors.MissingQueryArgumentException;
    }

    if (!cb) {
        throw Errors.MissingCallbackArgumentException;
    }

    options = options || {};
    options.token = process.env.WEBHOSE_TOKEN;
    options.q = q;

    var queryString = qs.stringify(options);

    postUrl += queryString;

    request
        .get(postUrl)
        .on('response', function (response) {
            var output = '';
            response
                .on('data', function (chunk) {
                    output += chunk;
                })
                .on('end', function () {
                    console.log(response.statusCode);
                    console.log(output);
                    if (response.statusCode == 200) {
                        return cb(null, JSON.parse(output));
                    } else {
                        return cb({code: response.statusCode, msg: output});
                    }
                });
        })
        .on('error', function (error) {
            return cb(error, null);
        });
};

Get.prototype.errors = {
    MissingQueryException: 'q is required'
};

module.exports = Get;