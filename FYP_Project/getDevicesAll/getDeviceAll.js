// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.

const getOrg = require("../getOrganization/getOrganization");
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');


// async function main(mainOrganization) {
//     let orgIdList = [];
//     await getOrg(mainOrganization).then((orgData) => {
//         orgIdList.push(orgData)
//     })
//     return orgIdList[0]
// }

let orgIdList = []

async function retrieveOrgList(mainOrganization) {
    await getOrg(mainOrganization).then(async (orgData) => {
        for (let i = 0; i < orgData.length; i++) {
            orgIdList.push(orgData[i].id)
        }
    }
    )
    return orgIdList
}

async function getDeviceAll(mainOrganization){
    let org_list = await retrieveOrgList(mainOrganization)
    console.log(org_list)
    console.log({path : `../${mainOrganization}.env`})

    dotenv.config({path : path.resolve(__dirname, `../${mainOrganization}.env`)});
    console.log(process.env.Internal_token)
        switch (mainOrganization) {
            case 'Internal':
            try {
                // Retrieve token from .env file
                return axios.all(org_list.map(async (org_id) => {
                        const options = {
                            method: 'GET',
                            url: `https://app.ninjarmm.com/v2/organization/${org_id}/devices`,
                            headers: {
                                'Authorization': `Bearer ${process.env.Internal_token}`,
                                'Content-Type': 'application/json'
                            }
                        };
                        const response = await axios(options).catch((err) => {
                            console.log(err);
                        }
                        )
                        return response.data
                    }
                ))


            }
            catch (err) {
                console.log(err)
            }
            break;
            case 'Seviora':
            try {
                return axios.all(org_list.map(async (org_id) => {
                        const options = {
                            method: 'GET',
                            url: `https://oc.ninjarmm.com/v2/organization/${org_id}/devices`,
                            headers: {
                                'Authorization': `Bearer ${process.env.SEVIORA_TOKEN}`,
                                'Content-Type': 'application/json'
                            }
                        };
                        const response = await axios(options)
                        return response.data
                    }
                ))
            }
            catch (err) {
                console.log(err)
            }
            break;
        }
    }
async function main(mainOrganization) {
    let devices_obj = await getDeviceAll(mainOrganization)
    // Store in a map
    let devices_map = new Map()
    for (let i = 0; i < orgIdList.length; i++) {
        let temp_list = []
        for (let j = 0; j < devices_obj[i].length; j++) {
            temp_list.push(devices_obj[i][j])
        }
        devices_map.set(orgIdList[i], temp_list)
    }
    return devices_map
}

// main('Internal').then((devices) => {
//     console.log(devices.keys())
//     console.log(devices.get(3))
// }
// )

module.exports = main

// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.