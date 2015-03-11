[![Build Status](https://api.shippable.com/projects/54f527155ab6cc135290d816/badge?branchName=develop)](https://app.shippable.com/projects/54f527155ab6cc135290d816/builds/latest)

webhose.io client for Node.js
============================

A simple way to access the `webhose.io <https://webhose.io>` API from your Node.js code

API Key
-------

To make use of the webhose.io API, you need to obtain a token that would be
used on every request. To obtain an API key, create an account at
https://webhose.io/auth/signup, and then go into
https://webhose.io/dashboard to see your token.

Installing
----------
```bash
$ npm install webhose-nodejs
```

Quick Start
-----------
The module depends on two Node environment variables:
```bash
$ WEBHOSE_TOKEN=[your_token] WEBHOSE_URI=https://webhose.io/search
```
WEBHOSE_URI has been included so you can dynamically set the value for multi-environment and integration testing support.

Once these environment variables have been set, executing a query is as easy as this:
```node
var webhose = require('webhose-nodejs');

var q = '(iphone OR ipad) -android';

var options = {
    format: 'json',
    language: 'english',
    site_type: 'news',
    exclude: 'yahoo.com',
    size: 5
};

webhose.search(q, options, function(err, res) {
  if(err) console.log(err);
  
  console.log(res.status);  // HTTP status code
  console.log(res.msg);     // Status message
  console.log(res.data);    // Webhose response body
});
```

Search Method Documentation
----------------------------
### Query Argument
 - required, string

For now, the q argument simply accepts a string that must be formatted according to the Webhose.io API requirements.

### Options Argument
 - optional, object

The following options can be passed into the search method to narrow/filter the search. Some options support enum values to help narrow down the scope of those options. The Webhose client includes an enums object you can access statically. Here's an example using the `format` option:

```node
var webhose = require('webhose-nodejs');

var enums = webhose.enums;
var options = {
    format: enums.format.json
};
```

Similarly, the `exclude` option can use another attached object, `Post`, in order to specify which thread properties to exclude.

```node
var Post = webhose.Post;
var options = {
    exclude: { site: 'yahoo.com' }
};
```

Option                  | Value Type    | Acceptable Values             | Example
------------------------| --------------| ------------------------------|----------------------
format                  | string        | json, xml                     | enums.format.json...
language                | string        | any, english, spanish         | enums.language.any...
site_type               | string        | any, news, blogs, discussions | enums.language.any...
site                    | string        | <passthrough>                 | N/A
author                  | string        | <passthrough>                 | N/A
exclude                 | object        | key: Any property of Post.thread, value: <passthrough>| {site: 'yahoo.com'}
size                    | int           | Any integer greater than zero | 10
thread.country          | string        | <passthrough>                 | N/A
thread.url              | string        | <passthrough>                 | N/A
thread.section_title    | string        | <passthrough>                 | N/A
thread.title            | string        | <passthrough>                 | N/A
person                  | string        | <passthrough>                 | N/A
organization            | string        | <passthrough>                 | N/A
location                | string        | <passthrough>                 | N/A
spam_score              | float         | Any float between 0 and 1     | N/A
is_first                | boolean       | true, false                   | N/A

### Callback
The callback expects error and response arguments. If there is an error, `res` will be null and vice-versa. In either case, the data will be wrapped with a result object.

Examples:

#### Success
```js
{
    status: 200, // HTTP response.statusCode from Webhose.io
    msg: 'Success',
    data: '{"posts": [{"thread": {"url": "http:// ... }}]}'
}
```

#### Error
```js
{
    status: 401, // HTTP response.statusCode from Webhose.io
    msg: 'Some Webhose error', // Error message/body returned from Webhose.io
    data: null
}
```

The `res.data` property will be the raw response body passed directly through from Webhose, in order to provide flexibility. The response will default to JSON, but if you specify `options: {format: 'xml'}` for example, the response will come back from Webhose as XML.

Exception Handling
-------
To enable a cohesive exception handling flow, surround your calls to the `search()` method with a try/catch block. There is an `errors` object attached to Webhose that you can use if necessary to trap specific exceptions.

```node
try {
    webhose.search('query', options, function(err, res) {
        // do stuff...
    }
} catch (ex) {
    switch (ex) {
        case webhose.errors.SearchArgumentException:
            console.log(ex);
            break;
    }
}
```

Hack the Module
-------
### Contribute
Please feel free to contribute to webhose-nodejs. Simply fork and submit any changes as a Pull Request.

### Test
There is a unit/integration test suite included in the module. You can run it using the preconfigured NPM test script (Mocha), or configure your own IDE to run the tests with Mocha. Remember to set the WEBHOSE environment variables first.

```bash
$ WEBHOSE_TOKEN=[your_token] WEBHOSE_URI=https://webhose.io/search npm test
```

### Continuous Integration
There is a `shippable.yml` configuration file included in webhose-nodejs that can be used to integrate with Shippable, a Docker-backed CI service. For more details, go here:
http://docs.shippable.com/en/latest/
