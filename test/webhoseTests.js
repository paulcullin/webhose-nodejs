'use strict'

/*
 Requires
 */
var Webhose = require('../webhose.js'),
    sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect;

/*
 Globals
 */
var token = process.env.WEBHOSE_TOKEN;

/*
 Tests
 */
describe('webhose.io Client Tests:', function () {

    describe('Options Defaults: ', function () {
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

    describe('Client Request Query Argument: ', function () {
        it('must be non-null', function () {
            var client = new Webhose();
            client.query(null, null, function (err, res) {
                expect(err).to.be.a('string').and.to.equal(client.errors.QueryArgumentException);
            });
        });

        it('must be an array', function () {
            var client = new Webhose();
            client.query('some non-array value', null, function (err, res) {
                expect(err).to.be.a('string').and.to.equal(client.errors.QueryArgumentException);
            });
        });

        it('must have at least one element (search term)', function () {
            var client = new Webhose();
            client.query([], null, function (err, res) {
                expect(err).to.be.a('string').and.to.equal(client.errors.QueryArgumentException);
            });
        });
    });

    describe('Client Request Options Argument: ', function () {

        var client = new Webhose();
        var q = ['test'];
        var options = {};

        describe('format option', function () {
            options = {format: 'invalid'};

            it('cannot have value other than json or xml', function () {
                client.query(q, options, function (err, res) {
                    expect(err).to.be.a('string').and.to.equal(client.errors.InvalidFormatOptionException);
                });
            });

            it('can have value json', function () {
                options.format = 'json';
                client.query(q, options, function (err, res) {
                    expect(err).to.be.null;
                });
            });

            it('can have value xml', function () {
                options.format = 'json';
                client.query(q, options, function (err, res) {
                    expect(err).to.be.null;
                });
            });
        });

        describe('language option', function () {
            var options = {language: 'invalid'};

            it('cannot have value not defined in enums.language', function () {
                client.query(q, options, function (err, res) {
                    expect(err).to.be.a('string').and.to.equal(client.errors.InvalidLanguageOptionException);
                });
            });

            it('can have value english', function () {
                options.language = 'english';
                client.query(q, options, function (err, res) {
                    expect(err).to.be.null;
                });
            });

            it('can have value spanish', function () {
                options.language = 'spanish';
                client.query(q, options, function (err, res) {
                    expect(err).to.be.null;
                });
            });
        });

        describe('site_type option', function () {
            var options = {site_type: 'invalid'};

            it('cannot have value not defined in enums.siteType', function () {
                client.query(q, options, function (err, res) {
                    expect(err).to.be.a('string').and.to.equal(client.errors.InvalidSiteTypeOptionException);
                })
            });

            it('can have value news', function () {
                options.site_type = 'news';
                client.query(q, options, function (err, res) {
                    expect(err).to.be.null;
                });
            });

            it('can have value blogs', function () {
                options.site_type = 'blogs';
                client.query(q, options, function (err, res) {
                    expect(err).to.be.null;
                });
            });

            it('can have value discussions', function () {
                options.site_type = 'discussions';
                client.query(q, options, function (err, res) {
                    expect(err).to.be.null;
                });
            });
        })
    });

});