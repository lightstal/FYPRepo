const deviceData = require("../../getDevicesByOrg/getSomeDevices");
const splunkjs = require('splunk-sdk');
const softwareData = require("../../getSoftware/getSoftware");

let service = new splunkjs.Service({
        username: "administrator",
        password: "admin123456",
    }
)
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

    let indexes = service.indexes()
    indexes.fetch(function(err,myindexes){
        console.log("There are "+myindexes.list().length+" indexes");
        let myindex = myindexes.item("main");
        for (let i = 0; i < data.length; i++) {
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
    }
    )
}

async function main(selectedOrgs, mainOrganization) {
    let deviceDataList = []
    await deviceData(selectedOrgs, mainOrganization).then(async (deviceData) => {
            // console.log(deviceData)
            for (let i = 0; i < deviceData.length; i++) {
                for (let j = 0; j < deviceData[i].length; j++) {
                    try {
                        // change lastContact to GMT+8 format from UNIX timestamp
                        let lastContact = new Date(deviceData[i][j].lastContact * 1000)
                        lastContact.setHours(lastContact.getHours() + 8)
                        deviceData[i][j].lastContact = lastContact.toISOString()
                    } catch (err) {
                        console.log(err)
                    }
                    try {
                        let createdTIme = new Date(deviceData[i][j].created * 1000)
                        createdTIme.setHours(createdTIme.getHours() + 8)
                        deviceData[i][j].created = createdTIme.toISOString()
                    } catch (err) {
                        console.log(err)
                    }
                    // console.log(deviceData[i][j])
                    deviceDataList.push(deviceData[i][j])

                }
            }
        }
    )
    await softwareData(deviceDataList, mainOrganization).then((softwareData) => {
            // Check if deviceDataList id matches softwareData id
            for (let i = 0; i < deviceDataList.length; i++) {
                if(softwareData.deviceId === deviceDataList[i].id){
                    deviceDataList[i].software = softwareData
                }
            }
        }
    )
    return deviceDataList
}


main([1,2,12,13], "Internal").then((deviceDataList) => {
    uploadDataToSplunk(deviceDataList)
}
).catch((err) => {
    console.log(err);
}
)