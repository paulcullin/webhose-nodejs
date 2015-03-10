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

Use the API
-----------
```node
var client = require('webhose-nodejs');

var q = '(iphone OR ipad) -android';

var options = {
    format: 'json',
    language: 'english',
    site_type: 'news',
    exclude: 'yahoo.com',
    size: 5
};

client.search(q, options, function(err, res) {
  if(err) console.log(err);
  
  console.log(res.status);  // HTTP status code
  console.log(res.msg);     // Status message
  console.log(res.data);    // Webhose response body
});
```

Full documentation
------------------


Polling
-------

