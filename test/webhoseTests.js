'use strict'

/*
 Requires
 */
var Webhose = require('../webhose.js'),
    Get = require('../get.js'),
    Errors = require('../errors.js'),
    Enums = require('../enums.js'),
    Post = require('../post.js'),
    sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    rewire = require('rewire'),
    qs = require('querystring'),
    url = require('url');

/*
 Globals
 */
var validQuery = '(iphone OR ipad) -android';

/*
 Tests
 */
describe('webhose.io Unit Tests:', function () {

    // stub Get so it doesn't actually hit the Webhose API with valid tests
    var getStub = sinon.stub(new Get());
    var client = new Webhose(getStub);
    var q = null;
    var options = null;

    var validationExpectations = function (q, options, cb, argException) {
        expect(client.search.bind(client, q, options, cb))
            .to.throw(Errors.SearchError)
            .that.has.property('msg')
            .that.is.a('string')
            .that.equals(Errors.SearchArgumentException);
        expect(client.search.bind(client, q, options, cb))
            .to.throw(Errors.SearchError)
            .that.has.property('errors')
            .that.is.an('array')
            .that.contains(argException);
    };

    describe('Webhose Constructor:', function () {
        it('requires an instance of Get', function () {
            expect((Webhose).bind(Webhose)).to.throw(Errors.MissingGetDependencyError);
        });
    });

    describe('Search Argument Validation:', function () {

        describe('q argument:', function () {

            var cb = function (err, res) {
            };

            it('must be non-null', function () {
                validationExpectations(q, options, cb, Errors.MissingQueryArgumentException);
            });

            it('cannot be a non-string', function () {
                q = {iam: 'not a string'};
                validationExpectations(q, options, cb, Errors.InvalidQueryArgumentFormatException);
            });

            it('can be a string', function () {
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });
        });

        describe('cb argument:', function () {

            var cb = null;

            it('cannot be null/undefined', function () {
                validationExpectations(validQuery, options, cb, Errors.MissingCallbackArgumentException);
            });

            it('must have two arguments', function () {
                cb = function (oneArg) {
                };
                validationExpectations(validQuery, options, cb, Errors.InvalidCallbackArgumentFormatException);
            });

            it('can have two arguments', function () {
                cb = function (oneArg, twoArg) {
                };
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });
        });
    });

    describe('Search Options Argument Validation Tests:', function () {

        var cb = function (err, res) {
        };
        var options = {};

        describe('format option', function () {
            it('cannot have value other than json or xml', function () {
                options.format = 'invalid';
                validationExpectations(validQuery, options, cb, Errors.InvalidFormatOptionException);
            });

            it('can have value json', function () {
                options.format = Enums.format.json;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });

            it('can have value xml', function () {
                options.format = Enums.format.xml;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });
        });

        describe('language option', function () {
            it('cannot have value not defined in enums.language', function () {
                options.language = 'invalid';
                validationExpectations(validQuery, options, cb, Errors.InvalidLanguageOptionException);
            });

            it('can have value any', function () {
                options.language = Enums.language.any;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });

            it('can have value english', function () {
                options.language = Enums.language.english;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });

            it('can have value spanish', function () {
                options.language = Enums.language.spanish;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });
        });

        describe('site_type option', function () {
            it('cannot have value not defined in enums.siteType', function () {
                options.site_type = 'invalid';
                validationExpectations(validQuery, options, cb, Errors.InvalidSiteTypeOptionException);
            });

            it('can have value any', function () {
                options.site_type = Enums.siteType.any;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });

            it('can have value news', function () {
                options.site_type = Enums.siteType.news;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });

            it('can have value blogs', function () {
                options.site_type = Enums.siteType.blogs;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });

            it('can have value discussions', function () {
                options.site_type = Enums.siteType.discussions;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });
        });

        describe('size option', function () {
            it('cannot be non-numeric', function () {
                options.size = 'non-numeric value';
                validationExpectations(validQuery, options, cb, Errors.InvalidSizeOptionException);
            });

            it('cannot be less than 1', function () {
                options.size = 0;
                validationExpectations(validQuery, options, cb, Errors.InvalidSizeOptionException);
            });

            it('cannot be greater than 100', function () {
                options.size = 101;
                validationExpectations(validQuery, options, cb, Errors.InvalidSizeOptionException);
            });

            it('must be between 1 and 100 inclusively', function () {
                // Uses a random integer between min (inclusive) and max (inclusive)
                var min = 1, max = 100;
                options.size = (Math.floor(Math.random() * (max - min + 1)) + min);
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });
        });

        describe('spam_score option', function () {
            it('cannot be non-numeric', function () {
                options.spam_score = 'non-numeric value';
                validationExpectations(validQuery, options, cb, Errors.InvalidSpamScoreOptionException);
            });

            it('cannot be less than 0', function () {
                options.spam_score = -.0000000001;
                validationExpectations(validQuery, options, cb, Errors.InvalidSpamScoreOptionException);
            });

            it('cannot be greater than 1', function () {
                options.spam_score = 1.0000000001;
                validationExpectations(validQuery, options, cb, Errors.InvalidSpamScoreOptionException);
            });

            it('must be between 0 and 1', function () {
                options.spam_score = Math.random();
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });
        });

        describe('is_first option', function () {
            it('cannot be non-boolean', function () {
                options.is_first = 'non-boolean value';
                validationExpectations(validQuery, options, cb, Errors.InvalidIsFirstOptionException);
            });

            it('can be boolean', function () {
                options.is_first = false;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });
        });

        describe('exclude option', function () {
            it('must be an object', function () {
                options.exclude = 'not an object';
                validationExpectations(validQuery, options, cb, Errors.InvalidExcludeOptionException);
            });

            it('cannot be an object with a key that is not a member of the Post.thread object', function () {
                options.exclude = {key_not_in_post_thread: 'invalid'};
                validationExpectations(validQuery, options, cb, Errors.InvalidExcludeOptionException);
            });

            it('can be an object with a key that is a member of the Post.thread object', function () {
                var threadKey = '';
                for (var property in Post.thread) {
                    if (property == 'site') threadKey = property;
                }
                options.exclude = {};
                options.exclude[threadKey] = 'wired.com';
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });
        });

    });

    describe('Search Method Tests: ', function () {
        var get = sinon.stub(new Get());
        var client = new Webhose(get);
        var cb = function (err, res) {
        };

        it('calls get.send() once', function () {
            client.search(validQuery, null, cb);
            expect(get.send).to.have.been.calledOnce;
        });

        it('calls cb once', function () {
            client.search(validQuery, null, cb);
            expect(cb).to.have.been.calledOnce;
        });
    });

    describe('Get Tests:', function () {
        describe('Get.send() Method:', function () {

            describe('Query Argument', function () {
                it('cannot be null/undefined', function () {
                    var get = new Get();
                    expect(get.send.bind(get, null, null, function () {
                    })).to.throw(Errors.MissingQueryArgumentException);
                });
            });

            describe('Callback Argument', function () {
                it('cannot be null/undefined', function () {
                    var get = new Get();
                    expect(get.send.bind(get, 'test', null, null)).to.throw(Errors.MissingCallbackArgumentException);
                });
            });

            describe('request.get', function () {

                var Get, mockRequest, get, revert;

                beforeEach(function() {
                    Get = rewire('../get.js');
                    mockRequest = {
                        get: sinon.stub()
                    };
                    revert = Get.__set__('request', mockRequest);
                    get = new Get();
                });

                afterEach(function() {
                    revert();
                })

                it('is called once', function () {
                    get.send(validQuery, options, function(){});
                    expect(mockRequest.get.calledOnce).to.be.true;
                });

                it('is called with options serialized into the query string', function () {
                    var testOptions = {
                        format: 'json',
                        language: 'english',
                        site_type: 'news',
                        exclude: 'yahoo.com',
                        size: 5
                    };
                    get.send(validQuery, testOptions, function(){});
                    var requestGetCall = mockRequest.get.getCall(0);
                    var requestUrl = requestGetCall.args[0];
                    var requestUrlParts = url.parse(requestUrl, true);
                    var queryObj = requestUrlParts.query;
                    expect(queryObj).to.have.property('format', testOptions.format);
                    expect(queryObj).to.have.property('language', testOptions.language);
                    expect(queryObj).to.have.property('site_type', testOptions.site_type);
                    expect(queryObj).to.have.property('exclude', testOptions.exclude);
                    expect(queryObj).to.have.property('size', testOptions.size.toString());
                    expect(queryObj).to.have.property('token', process.env.WEBHOSE_TOKEN);
                    expect(queryObj).to.have.property('q', validQuery);
                });
            });
        });

    });
});

describe('webhose.io Integration Tests:', function() {
    var client = require('../client.js');
    this.timeout(5000);

    describe('Search', function() {
        it('returns the correct number of posts when the size option is specified', function(done) {
            // generate a random size between 1 and 10
            var testSize = (Math.floor(Math.random() * (10 - 1 + 1)) + 1)
            client.search('jimmy graham AND seahawks AND trade', {size: testSize}, function(err, res) {
                expect(err).to.not.exist;
                expect(res).to.have.property('status', 200);
                expect(JSON.parse(res.data)).to.have.property('posts').that.is.an('array').with.length(testSize);
                done();
            });
        });
    });
});