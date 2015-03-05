'use strict'

// Constructor
var Webhose = function () {
    this.token = process.env.WEBHOSE_TOKEN;
    this.options.format = this.enums.format.json;
    this.options.language = this.enums.language.any;
    this.options.site_type = this.enums.siteType.any;
};

// private members

// properties and methods
Webhose.prototype.query = function (q, options, cb) {
    if (!q || q.constructor !== Array || q.length < 1) {
        return cb(this.errors.QueryArgumentException, null);
    }

    if (options) {
        var errors = this.validateOptions(options);
        if (errors.length > 0) {
            return cb(errors[0], null);
        }
    }

    // TODO: implement POST request to Webhose.io API here
    var response = {};
    cb(null, response);
};

Webhose.prototype.validateOptions = function (options) {
    var errors = [];

    if (options.format) {
        if (options.format !== this.enums.format.json && options.format !== this.enums.format.xml) {
            errors.push(this.errors.InvalidFormatOptionException);
        }
    }

    if (options.language) {
        if (!this.isObjectProperty(this.enums.language, options.language)) {
            errors.push(this.errors.InvalidLanguageOptionException);
        }
    }

    if (options.site_type) {
        if (!this.isObjectProperty(this.enums.siteType, options.site_type)) {
            errors.push(this.errors.InvalidSiteTypeOptionException);
        }
    }

    return errors;
};

Webhose.prototype.isObjectProperty = function (obj, prop) {
    for (var objProp in obj) {
        if (obj.hasOwnProperty(objProp)) {
            if (objProp == prop) {
                return true;
            }
        }
    }
    return false;
};

Webhose.prototype.options = {
    format: null,
    language: null,
    site_type: null,
    author: null,
    exclude: 'exclude_',
    size: 100,
    thread_country: null,
    thread_url: null,
    thread_section_title: null,
    spam_score: null,
    is_first: null
};

Webhose.prototype.enums = {
    format: {
        json: 'json',
        xml: 'xml'
    },
    language: {
        any: 'any',
        english: 'english',
        spanish: 'spanish'
    },
    siteType: {
        any: 'any',
        news: 'news',
        blogs: 'blogs',
        discussions: 'discussions'
    },
    size: 100
};

Webhose.prototype.errors = {
    QueryArgumentException: 'At least one query term is required',
    InvalidFormatOptionException: 'options.format must be either json or xml',
    InvalidLanguageOptionException: 'options.language has an invalid value',
    InvalidSiteTypeOptionException: 'options.site_type has an invalid value'
};

module.exports = Webhose;