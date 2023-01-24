// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.

const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

let deviceDataList = []
let NMS_LIST = ["NMS_Switch", "NMS_Router", "NMS_OTHER", "NMS_NETWORK_MANAGEMENT_AGENT", "NMS_PRINTER", "NMS_FIREWALL", "NMS_SERVER", "NMS_STORAGE", "NMS_SWITCH", "NMS_ROUTER", "NMS_OTHER", "NMS_SWITCH", "NMS_VIRTUAL_MACHINE","CLOUD_MONITOR_TARGET"]

async function getSoftware(deviceDataList, mainOrganization){
    dotenv.config({path : path.resolve(__dirname, `../${mainOrganization}.env`)});
    // console.log(process.env.Internal_token)
    let ignoreList = []
    switch (mainOrganization) {
        case 'Internal':
            try {
                // Loop through each device in the deviceDataList and if device.nodeClass === "NMS_Switch" ignore it
                for (let i = 0; i < deviceDataList.length; i++) {
                    // Use NMS_LIST to check if device.nodeClass is in the list
                    if (NMS_LIST.includes(deviceDataList[i].nodeClass)) {
                        console.log("Device is in NMS Filter List, ignoring")
                    } else {
                        const options = {
                            method: 'GET',
                            url: `https://app.ninjarmm.com/v2/device/${deviceDataList[i].id}/software`,
                            headers: {
                                'Authorization': `Bearer ${process.env.Internal_token}`,
                                'Content-Type': 'application/json'
                            }
                        };
                        const response = await axios(options).catch((err) => {
                            console.log(err);
                        })
                        response.data.deviceId = deviceDataList[i].id
                        deviceDataList[i].software = response.data
                        // Check if device has Google Chrome installed
                    }
                }
                return deviceDataList
            } catch (err) {
                console.log(err)
            }
            break;
        case 'Seviora':
            try {
                // Loop through each device in the deviceDataList and if device.nodeClass === "NMS_Switch" ignore it
                for (let i = 0; i < deviceDataList.length; i++) {
                    console.log(deviceDataList[i])
                    // Use NMS_LIST to check if device.nodeClass is in the list
                    if (NMS_LIST.includes(deviceDataList[i].nodeClass)) {
                        console.log("Device is a switch, ignoring")

                    }else {
                        const options = {
                            method: 'GET',
                            url: `https://app.ninjarmm.com/v2/device/${deviceDataList[i].id}/software`,
                            headers: {
                                'Authorization': `Bearer ${process.env.Seviora_token}`,
                                'Content-Type': 'application/json'
                            }
                        };
                        const response = await axios(options).catch((err) => {
                            console.log(err);
                        })
                        //Add deviceDataList[i].id to the response.data as deviceId property
                        response.data.deviceId = deviceDataList[i].id
                        deviceDataList[i].software = response.data
                    }
                }
                return deviceDataList
            } catch (err) {
                console.log(err)
            }
            break;
    }
}

module.exports = getSoftware

// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.