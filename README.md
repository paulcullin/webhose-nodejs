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
$ WEBHOSE_TOKEN=[your token] WEBHOSE_URI=https://webhose.io/search
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

### Options
 - optional, object

Option                  | Value Type    | Acceptable Values             | Example
------------------------| --------------| ------------------------------|----------------------
format                  | string        | json, xml                     | enums.format.json...
language                | string        | any, english, spanish         | enums.language.any...
site_type               | string        | any, news, blogs, discussions | enums.language.any...
site                    | string        | <passthrough>                 | N/A
author                  | string        | <passthrough>                 | N/A
exclude                 | string        | Any property of Post.thread   | Post.thread.site
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

Polling
-------

