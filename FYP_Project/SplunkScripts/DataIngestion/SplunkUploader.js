const splunkjs = require("splunk-sdk");
let service = new splunkjs.Service({
        username: "administrator",
        password: "admin123456",
    }
)
//Login to splunk
service.login(function(err, success) {
        if (err) {
            throw err;
        } else {
            console.log('Logged in successfully');
            console.log(success)
        }
    }
)


function uploadDataToSplunk(data){
    let myindexes = service.indexes()
    // Use orgName in data to create index with checkIndexExists()
    // If index exists, use that index to submit data
    // If index does not exist, create index and then submit data
    // console.log("There are "+indexes.list().length+" indexes");
    let tempIndexList = []
    for (let i = 0; i < data.length; i++) {
        // console.log(data)
        let indexName = data[i].orgName.toLowerCase().replace(/\s/g, '_')

        //Strip out special characters
        indexName = indexName.replace(/[^a-zA-Z0-9]/g, '')
        //Strip "(" and ")"
        indexName = indexName.replace(/[\(\)]/g, '')
        //Don't push duplicate index name to tempIndexList
        if(!tempIndexList.includes(indexName)){
            tempIndexList.push(indexName)
        }
    }
    // Use checkIndexExists() to check if index exists
    checkIndexExists(tempIndexList)
    // Submit data to splunk using indexName if matches orgName
    myindexes.fetch(function(err,myindexes){
        for (let i = 0; i < data.length; i++) {
            let indexName = data[i].orgName.toLowerCase().replace(/\s/g, '_')
            indexName = indexName.replace(/[^a-zA-Z0-9]/g, '')
            //Strip "(" and ")"
            indexName = indexName.replace(/[\(\)]/g, '')
            let myindex = myindexes.item(indexName);

            // console.log(myindex)
            myindex.submitEvent([data[i].id, data[i]],
                {
                    source: "NinjaRMM",
                    sourcetype: "JSON",
                }, function(err, job) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Submitted data to index: " + indexName);
                    }
                }
            )
        }
    })
}

// Check if index "indexName" exists in splunk if not create it
function checkIndexExists(indexName){
    // Loop through indexName list
    for (let i = 0; i < indexName.length; i++) {
        // Convert indexName to lowercase and replace spaces with underscore and store in list
        let tempIndexName = indexName[i].toLowerCase().replace(/\s/g, '_')
        //Strip out special characters
        tempIndexName = tempIndexName.replace(/[^a-zA-Z0-9]/g, '_')
        //Strip "(" and ")"
        tempIndexName = tempIndexName.replace(/[\(\)]/g, '')


        // Retrieve list of existing indexes in splunk
        let splunkIndex = service.indexes()
        // Create index if it does not exist in splunk
        splunkIndex.create(`${tempIndexName}`, {}, function(err, myindex) {
            if (err) {
                // If index already exists, do nothing
                if (err.status === 409) {
                    console.log(`Index ${tempIndexName} already exists`);
                }else {
                    console.log(err);
                }
            } else {
                console.log("Created index: " + `${tempIndexName}`);
            }
        })
    }
}


module.exports = uploadDataToSplunk