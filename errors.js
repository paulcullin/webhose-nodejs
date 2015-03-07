'use strict'

var Errors = {
    SearchError: {
        msg: '',
        errors: []
    },
    SearchArgumentException: 'There are one or more search argument validation errors',
    MissingQueryArgumentException: 'q is required',
    InvalidQueryArgumentFormatException: 'q must be a string',
    MissingCallbackArgumentException: 'cb is required',
    InvalidCallbackArgumentFormatException: 'cb must have two arguments (err, res)',
    InvalidFormatOptionException: 'options.format must be either json or xml',
    InvalidLanguageOptionException: 'options.language has an invalid value',
    InvalidSiteTypeOptionException: 'options.site_type has an invalid value',
    InvalidSizeOptionException: 'options.size must be between 1 and 100',
    InvalidSpamScoreOptionException: 'options.size must be between 0 and 1',
    InvalidIsFirstOptionException: 'options.is_first must be a boolean value',
    InvalidExcludeOptionException: 'options.exclude must be a valid thread property key',
    MissingGetDependencyError: 'An instance of Get must be provided to the Webhose constructor'
};

module.exports = Errors;