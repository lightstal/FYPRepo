// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.

const deviceData = require("../../getDevicesByOrg/getSomeDevices");
const splunkjs = require('splunk-sdk');
const softwareData = require("../../getSoftware/getSoftware");

let service = new splunkjs.Service({
        username: "administrator",
        password: "admin123456",
    }
)
let orgName = []
service.login(function(err, success) {
        if (err) {
            throw err;
        } else {
            console.log('Logged in successfully');
            console.log(success)
        }
    }
)

const currentTime = new Date();

const hours = currentTime.getHours();

let roundedHours;

if (hours < 6) {
    roundedHours = 0;
} else if (hours < 12) {
    roundedHours = 6;
} else if (hours < 18) {
    roundedHours = 12;
} else {
    roundedHours = 18;
}

const day = currentTime.getDate().toString().padStart(2, '0');
const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
const year = currentTime.getFullYear();

const roundedTime = `${year}-${month}-${day}T${roundedHours}:00:00.000Z`;
const formattedRoundedTime = `${day}-${month}-${year} ${roundedHours}:00`;

const timestamp = Date.parse(roundedTime);
const utcTime = new Date(timestamp);


// console.log("There are "+myindexes.list().length+" indexes");
// let myindex = myindexes.item("main");
// for (let i = 0; i < data.length; i++) {
//     myindex.submitEvent([data[i].id, data[i]],
//         {
//         source: "NinjaRMM",
//         sourcetype: "JSON",
//     }, function(err, job) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("Submitted job with SID: " + job);
//         }
//     }
//     )
// }

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
                console.log("Submitted job with SID: " + job);
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

        // Check if index exists
        let splunkIndex = service.indexes()
        // Create index if it does not exist in splunk
        console.log(typeof(tempIndexName))
        splunkIndex.create(`${tempIndexName}`, {}, function(err, myindex) {
            if (err) {
                console.log(err);
            } else {
                console.log("Created index: " + `${tempIndexName}`);
            }
        })
    }
}
async function main(selectedOrgs, mainOrganization) {
    let deviceDataList = []
    // Get device data and org name list
    await deviceData(selectedOrgs, mainOrganization).then(async (deviceData) => {
            // Add org name to orgName list for each list
            for (let z = 0; z < deviceData.length; z++) {
                orgName.push(deviceData[z][1])
                for (let i = 0; i < deviceData[z].length; i++) {
                    for (let j = 0; j < deviceData[z][i].length; j++) {
                        // Check if it is an object
                        if (typeof deviceData[z][i][j] === 'object') {
                            deviceData[z][i][j].orgName = deviceData[z][1]
                            // Try to change lastContact to GMT+8 from UNIX time
                            try{
                                let temp = new Date(deviceData[z][i][j].lastContact * 1000)
                                deviceData[z][i][j].lastContact = temp.toLocaleString()
                            }
                            catch (e) {
                                console.log(e)
                            }
                            try{
                                let temp = new Date(deviceData[z][i][j].lastUpdate * 1000)
                                deviceData[z][i][j].lastUpdate = temp.toLocaleString()
                            }
                            catch (e) {
                                console.log(e)
                            }
                            try {
                                let temp = new Date(deviceData[z][i][j].created * 1000)
                                deviceData[z][i][j].created = temp.toLocaleString()
                            }
                            catch (e) {
                                console.log(e)
                            }
                            try{
                                // Add roundedTime to each object
                                deviceData[z][i][j].SplunkroundedTime = formattedRoundedTime
                                deviceData[z][i][j].SplunkutcTime = utcTime
                            }
                            catch (e) {
                                console.log(e)
                            }
                            // console.log(deviceData[z][i][j])
                            deviceDataList.push(deviceData[z][i][j])

                        }
                    }
                }
            }
            return deviceDataList
        }
    )
    // Get software data
    await softwareData(deviceDataList, mainOrganization).then((softwareData) => {
            // Check if deviceDataList id matches softwareData id
            for (let i = 0; i < deviceDataList.length; i++) {
                if(softwareData.deviceId === deviceDataList[i].id){
                    deviceDataList[i].software = softwareData
                }
            }
        }
    )


    // use function to upload data to splunk

    return deviceDataList

}


main([6,17], "Internal").then((deviceDataList) => {
    //Check if index exists based on number of orgs
    // for (let i = 0; i < orgName.length; i++) {
    //     console.log(orgName[i])
    //     // checkIndexExists(orgName[i])
    // }
    uploadDataToSplunk(deviceDataList)
}
).catch((err) => {
    console.log(err);
}
)

// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.