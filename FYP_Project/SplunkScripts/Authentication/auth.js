const splunkjs = require('splunk-sdk');

const service = new splunkjs.Service({
    username: "administrator",
    password: "admin123456",
}
);

service.login(function(err, success) {
    if (err) {
        throw err;
    } else {
        console.log('Logged in successfully');
        console.log(success)
    }
}
);
module.exports = service;
