const splunkjs = require('splunk-sdk');

const service = new splunkjs.Service({
    host: "219.74.7.85",
    port: 12345,
    username: "administrator",
    password: "admin123456",
    scheme: "https",
    version: "default"
}
);

const init = new splunkjs.Service
service.login(function(err, success) {
    if (err) {
        throw err;
    } else {
        console.log('Logged in successfully');
    }
}
);
