'use strict'

/*
 Requires
 */
var Webhose = require('../webhose.js'),
    Get = require('../get.js'),
    Errors = require('../errors.js'),
    Post = require('../post.js'),
    sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect;

/*
 Globals
 */
var validQuery = '(iphone OR ipad) -android';

/*
 Tests
 */
describe('webhose.io Client Tests:', function () {

    // stub Get so it doesn't actually hit the Webhose API with valid tests
    var getStub = sinon.stub(new Get());
    var client = new Webhose(getStub);
    var q = null;
    var options = null;

    var validationExpectations = function(q, options, cb, argException){
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

    //TODO: Options defaults - removing for now
    /*
    //
    describe('Options Defaults Tests:', function () {
        describe('format option', function () {
            it('defaults to the string json', function () {
                var client = new Webhose();
                expect(client.options.format).to.be.a('string').and.to.equal('json');
            })
        });

        describe('language option', function () {
            it('defaults to the string any', function () {
                var client = new Webhose();
                expect(client.options.language).to.be.a('string').and.to.equal('any');
            })
        });

        describe('site_type option', function () {
            it('defaults to the string any', function () {
                var client = new Webhose();
                expect(client.options.site_type).to.be.a('string').and.to.equal('any');
            })
        });

        describe('author option', function () {
            it('defaults to null', function () {
                var client = new Webhose();
                expect(client.options.author).to.be.null;
            })
        });

        describe('exclude option', function () {
            it('defaults to the string exclude_', function () {
                var client = new Webhose();
                expect(client.options.exclude).to.be.a('string').and.to.equal('exclude_');
            })
        });

        describe('size option', function () {
            it('defaults to the number 100', function () {
                var client = new Webhose();
                expect(client.options.size).to.equal(100);
            })
        });

        describe('thread_url option', function () {
            it('defaults to null', function () {
                var client = new Webhose();
                expect(client.options.thread_url).to.be.null;
            })
        });

        describe('thread_section_title option', function () {
            it('defaults to null', function () {
                var client = new Webhose();
                expect(client.options.thread_section_title).to.be.null;
            })
        });

        describe('spam_score option', function () {
            it('defaults to null', function () {
                var client = new Webhose();
                expect(client.options.spam_score).to.be.null;
            })
        });
    });
    */

    describe('Webhose Constructor', function() {
        it('requires an instance of Get', function(){
            expect((Webhose).bind(Webhose)).to.throw(Errors.MissingGetDependencyError);
        });
    });

    describe('Search Argument Validation:', function () {

        describe('q argument:', function() {

            var cb = function(err, res){};

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

        describe('cb argument:', function() {

            var cb = null;

            it('cannot be null/undefined', function () {
                validationExpectations(validQuery, options, cb, Errors.MissingCallbackArgumentException);
            });

            it('must have two arguments', function() {
                cb = function(oneArg){};
                validationExpectations(validQuery, options, cb, Errors.InvalidCallbackArgumentFormatException);
            });

            it('can have two arguments', function () {
                cb = function(oneArg, twoArg){};
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });
        });
    });

    describe('Search Options Argument Validation Tests:', function () {

        var cb = function(err, res){};
        var options = {};

        describe('format option', function () {
            it('cannot have value other than json or xml', function () {
                options.format = 'invalid';
                validationExpectations(validQuery, options, cb, Errors.InvalidFormatOptionException);
            });

            it('can have value json', function () {
                options.format = client.enums.format.json;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });

            it('can have value xml', function () {
                options.format = client.enums.format.xml;
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
                options.language = client.enums.language.any;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });

            it('can have value english', function () {
                options.language = client.enums.language.english;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });

            it('can have value spanish', function () {
                options.language = client.enums.language.spanish;
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
                options.site_type = client.enums.siteType.any;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });

            it('can have value news', function () {
                options.site_type = client.enums.siteType.news;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });

            it('can have value blogs', function () {
                options.site_type = client.enums.siteType.blogs;
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });

            it('can have value discussions', function () {
                options.site_type = client.enums.siteType.discussions;
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
                    if(property == 'site') threadKey = property;
                };
                options.exclude = {};
                options.exclude[threadKey] = 'wired.com';
                var exec = client.search(validQuery, options, cb);
                expect(exec).to.not.throw;
            });
        });

    });

    describe('Search Method Tests: ', function() {
        var get = sinon.stub(new Get());
        var client = new Webhose(get);
        var cb = function(err, res){};

        it('calls get.send() once', function() {
            client.search(validQuery, null, cb);
            expect(get.send).to.have.been.calledOnce;
        });

        it('calls cb once', function() {
            client.search(validQuery, null, cb);
            expect(cb).to.have.been.calledOnce;
        });
    });

    describe('Get Tests:', function(){
        describe('Get.send() Method:', function(){
            it('prevents execution with missing query', function() {
                var get = new Get();
                expect(get.send.bind(get, null, null, function(){})).to.throw(Errors.MissingQueryArgumentException);
            });

            it('prevents execution with missing callback', function() {
                var get = new Get();
                expect(get.send.bind(get, 'test', null, null)).to.throw(Errors.MissingCallbackArgumentException);
            });
        });

    });

});