'use strict'

var Post = require('./post.js'),
    Errors = require('./errors.js');

// Constructor
var Webhose = function (get) {
    if (!get) {
        throw Errors.MissingGetDependencyError;
    }
    this.get = get;
    this.options = {};
};

var SearchError = function (msg, errors) {
    this.msg = msg;
    this.errors = errors;
};

Webhose.prototype.search = function (q, options, cb) {
    if (!q || typeof q === 'undefined') {
        var err = Errors.SearchError;
        err.msg = Errors.SearchArgumentException;
        err.errors = [Errors.MissingQueryArgumentException];
        throw err;
    }

    if (typeof q !== 'string') {
        var err = Errors.SearchError;
        err.msg = Errors.SearchArgumentException;
        err.errors = [Errors.InvalidQueryArgumentFormatException];
        throw err;
    }

    if (!cb || typeof cb === 'undefined') {
        var err = Errors.SearchError;
        err.msg = Errors.SearchArgumentException;
        err.errors = [Errors.MissingCallbackArgumentException];
        throw err;
    }

    if (cb.length != 2) {
        var err = Errors.SearchError;
        err.msg = Errors.SearchArgumentException;
        err.errors = [Errors.InvalidCallbackArgumentFormatException];
        throw err;
    }

    if (options) {
        var errors = this.validateOptions(options);
        if (errors.length > 0) {
            var err = Errors.SearchError;
            err.msg = Errors.SearchArgumentException;
            err.errors = errors;
            throw err;
            //var searchError = new SearchError(Errors.SearchArgumentException, errors);
            //return cb(searchError, null);
        }
    }

    this.get.send(q, options, function(err, res) {
        return cb(err, res);
    });
};

Webhose.prototype.validateOptions = function (options) {
    var errors = [];

    if (options.format) {
        if (options.format !== this.enums.format.json && options.format !== this.enums.format.xml) {
            errors.push(Errors.InvalidFormatOptionException);
        }
    }

    if (options.language) {
        if (!this.isObjectProperty(this.enums.language, options.language)) {
            errors.push(Errors.InvalidLanguageOptionException);
        }
    }

    if (options.site_type) {
        if (!this.isObjectProperty(this.enums.siteType, options.site_type)) {
            errors.push(Errors.InvalidSiteTypeOptionException);
        }
    }

    if (typeof options.size !== 'undefined') {
        var numSize = parseInt(options.size);
        if (isNaN(numSize) || 1 > numSize || numSize > 100) {
            errors.push(Errors.InvalidSizeOptionException);
        }
    }

    if (typeof options.spam_score !== 'undefined') {
        var numSize = parseFloat(options.spam_score);
        if (isNaN(numSize) || 0 > numSize || numSize > 1) {
            errors.push(Errors.InvalidSpamScoreOptionException);
        }
    }

    if (options.is_first) {
        if (typeof options.is_first !== 'boolean') {
            errors.push(Errors.InvalidIsFirstOptionException);
        }
    }

    if(options.exclude) {
        if (typeof options.exclude !== 'object') {
            errors.push(Errors.InvalidExcludeOptionException);
        }
        for (var excludeProp in options.exclude) {
            if (!this.isObjectProperty(Post.thread, excludeProp)) {
                errors.push(Errors.InvalidExcludeOptionException);
            }
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

module.exports = Webhose;