var request = require('request');

var PostRequest = function (q, options) {
    this.data = options;
    this.q = q;
};

PostRequest.prototype.send = function (cb) {
    var requestOptions = {
        body: JSON.stringify(this.data),
        json: true
    };

    var postUrl = process.env.WEBHOSE_URI + '?token=' + process.env.WEBHOSE_TOKEN + '&q=' + this.q;

    request
        .post(postUrl, requestOptions)
        .on('response', function (response) {
            var output = '';
            response
                .on('data', function (chunk) {
                    output += chunk;
                })
                .on('end', function () {
                    console.log(response.statusCode);
                    console.log(output);
                    if (response.statusCode == 200) {
                        return cb(null, JSON.parse(output));
                    } else {
                        return cb({code: response.statusCode, msg: output});
                    }
                });
        })
        .on('error', function (error) {
            return cb(error, null);
        });
};

module.exports = PostRequest;