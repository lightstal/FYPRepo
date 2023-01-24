// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.

const deviceData = require("../../getDevicesByOrg/getSomeDevices");
const softwareData = require("../../getSoftware/getSoftware");


let orgName = []


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

// const timestamp = Date.parse(roundedTime);
// const utcTime = new Date(timestamp);

const utcTime = new Date(`${month} ${day}, ${year} ${roundedHours}:00`).toUTCString();




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
                                // console.log(utcTime)
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
    return deviceDataList

}

// main([1,2,3,6,10,11,13,14,15,16,17,20,21,23,25,26,28,29,31,32,33,35], "Internal").then((deviceDataList) => {
//     uploadDataToSplunk(deviceDataList)
//     console.log("All organizations processed")
// }).catch((err) => {
//     console.log(err);
// })

//export main function for testing
module.exports = main

// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.