
// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.


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


// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.