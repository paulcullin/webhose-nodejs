'use strict'

var request = require('request'),
    qs = require('querystring'),
    Errors = require('./errors.js'),
    Enums = require('./enums.js');

var Get = function () {
};

//var parseBody = function(data, format) {
//    switch (format) {
//        case Enums.format.json:
//            return JSON.parse(data);
//        case Enums.format.xml:
//            parseString(data, function (err, result) {
//                if(err) throw Errors.XmlFormatResultException;
//                return result;
//            });
//    }
//};

Get.prototype.send = function (q, options, cb) {
    var requestUrl = process.env.WEBHOSE_URI + '?';

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

    requestUrl += queryString;

    request.get(requestUrl, function(err, response, body) {
        if(err) return cb(err, null);

        var webhoseResult = {
            status: response.statusCode,
            data: {},
            msg: ''
        }

        if (response.statusCode == 200) {
            webhoseResult.data = body;
            webhoseResult.msg =  'Success';
            return cb(null, webhoseResult);
        } else {
            webhoseResult.msg = body;
            return cb(webhoseResult, null);
        }
    });
};

module.exports = Get;