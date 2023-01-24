const splunkjs = require("splunk-sdk");
const fs = require('fs');

// Declare the file path and index name as constants
const filePath = 'C:\\temp\\test.csv';
const indexName = 'diagnostics';

// Create a new Splunk service instance using the provided credentials
let service = new splunkjs.Service({
        username: "administrator",
        password: "admin123456",
    }
);

// Login to the Splunk service
service.login(function(err, success) {
        if (err) {
            // Throw an error if login fails
            throw err;
        } else {
            console.log('Logged in successfully');
        }
    }
);

// Function to upload data to Splunk
function uploadDataToSplunk(){
    // Fetch the indexes from the Splunk service
    let myindexes = service.indexes();
    myindexes.fetch(function(err,myindexes){
        // Read the data from the file
        fs.readFile(filePath, 'utf8', function(err, data) {
            if (err) {
                // Return an error if reading the file fails
                return console.log(err);
            }
            // Get the index by its name
            let myindex = myindexes.item(indexName);
            // Submit the data to the index
            myindex.submitEvent(data,
                {
                    // The source of the data
                    source: "NinjaRMM",
                    // The sourcetype of the data
                    sourcetype: "CSV",
                },
                // Callback function to handle the response
                function(err, job) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Submitted data to index: " + indexName);
                    }
                }
            )
        });
    });
}

// Call the function to upload data to Splunk
uploadDataToSplunk();
