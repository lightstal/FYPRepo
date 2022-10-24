const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

let deviceDataList = []
let NMS_LIST = ["NMS_Switch", "NMS_Router", "NMS_OTHER", "NMS_NETWORK_MANAGEMENT_AGENT", "NMS_PRINTER", "NMS_FIREWALL", "NMS_SERVER", "NMS_STORAGE", "NMS_SWITCH", "NMS_ROUTER", "NMS_OTHER", "NMS_SWITCH"]

async function getSoftware(deviceDataList, mainOrganization){
    dotenv.config({path : path.resolve(__dirname, `../${mainOrganization}.env`)});
    // console.log(process.env.Internal_token)
    let ignoreList = []
    switch (mainOrganization) {
        case 'Internal':
            try {
                // Loop through each device in the deviceDataList and if device.nodeClass === "NMS_Switch" ignore it
                for (let i = 0; i < deviceDataList.length; i++) {
                    if (deviceDataList[i].nodeClass === "NMS_Switch" || deviceDataList[i].nodeClass === "NMS_Router"|| deviceDataList[i].nodeClass === "NMS_OTHER" || deviceDataList[i].nodeClass === "NMS_NETWORK_MANAGEMENT_AGENT" || deviceDataList[i].nodeClass === "NMS_PRINTER" || deviceDataList[i].nodeClass === "NMS_FIREWALL" || deviceDataList[i].nodeClass === "NMS_SERVER" || deviceDataList[i].nodeClass === "NMS_STORAGE" || deviceDataList[i].nodeClass === "NMS_SWITCH" || deviceDataList[i].nodeClass === "NMS_ROUTER" || deviceDataList[i].nodeClass === "NMS_OTHER" || deviceDataList[i].nodeClass === "NMS_SWITCH") {
                        console.log("Device is a switch, ignoring")
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
                    if (deviceDataList[i].nodeClass === "NMS_Switch" || deviceDataList[i].nodeClass === "NMS_Router"|| deviceDataList[i].nodeClass === "NMS_OTHER" || deviceDataList[i].nodeClass === "NMS_NETWORK_MANAGEMENT_AGENT" || deviceDataList[i].nodeClass === "NMS_PRINTER" || deviceDataList[i].nodeClass === "NMS_SWITCH") {
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