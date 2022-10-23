const deviceData = require('../getDevicesByOrg/getSomeDevices');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');


let deviceIDList = []
let deviceIDWithSoftware = []

async function getSoftwareSome(selectedOrgs, mainOrganization){
    await deviceData(selectedOrgs,mainOrganization).then(async (deviceData) => {
        console.log(deviceData)
        for (let i = 0; i < deviceData.length; i++) {
            for (let j = 0; j < deviceData[i].length; j++) {
                deviceIDList.push(deviceData[i][j].id)
            }
        }
        console.log(deviceIDList)
    }
    )
}

async function main(selectedOrgs, mainOrganization) {
    await getSoftwareSome(selectedOrgs, mainOrganization).then(async () => {
        dotenv.config({path : path.resolve(__dirname, `../${mainOrganization}.env`)});
        console.log(process.env.Internal_token)
            switch (mainOrganization) {
                case 'Internal':
                try {
                    // Retrieve token from .env file
                    return axios.all(deviceIDList.map(async (device_id) => {
                            const options = {
                                method: 'GET',
                                url: `https://app.ninjarmm.com/v2/device/${device_id}/software`,
                                headers: {
                                    'Authorization': `Bearer ${process.env.Internal_token}`,
                                    'Content-Type': 'application/json'
                                }
                            };
                            const response = await axios(options).catch((err) => {
                                console.log(err);
                            }
                            )
                        // Push Device ID and response data to deviceIDWithSoftware
                        deviceIDWithSoftware.push({device_id, software: response.data})
                        }
                    ))

                }
                catch (err) {
                    console.log(err)
                }
                break;

                case 'Seviora':
                try {
                    return axios.all(deviceIDList.map(async (device_id) => {
                            const options = {
                                method: 'GET',
                                url: `https://oc.ninjarmm.com/v2/device/${device_id}/software`,
                                headers: {
                                    'Authorization': `Bearer ${process.env.Seviora_token}`,
                                    'Content-Type': 'application/json'
                                }
                            };
                            const response = await axios(options).catch((err) => {
                                console.log(err);
                            }
                            )
                        // Push Device ID and response data to deviceIDWithSoftware
                        deviceIDWithSoftware.push({device_id, software: response.data})
                        }

                    ))
                }
                catch (err) {
                    console.log(err)
                }
                break;
            }
    })
    return deviceIDWithSoftware
}


module.exports = main