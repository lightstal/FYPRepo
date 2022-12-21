// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.

const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const getOrg = require("../getOrganization/getOrganization");


let orgIdList = []
let orgNameList = []

async function retrieveOrgList(mainOrganization) {
    await getOrg(mainOrganization).then(async (orgData) => {
            for (let i = 0; i < orgData.length; i++) {
                let temp_list = []
                temp_list.push(orgData[i].id)
                temp_list.push(orgData[i].name)
                orgIdList.push(temp_list)
            }
        }
    )
    return orgIdList
}


async function getSomeDevices(selectedOrgList, mainOrganization) {
    let org_list = await retrieveOrgList(mainOrganization)

    console.log("Your selected organization list is: ", selectedOrgList)
    // print org name based on org id
    for (let i = 0; i < org_list.length; i++) {
        for (let j = 0; j < selectedOrgList.length; j++) {
            if (org_list[i][0] === selectedOrgList[j]) {
                console.log("Organization name: ", org_list[i][1])
                orgNameList.push(org_list[i][1])
            }
        }
    }
    dotenv.config({path : path.resolve(__dirname, `../${mainOrganization}.env`)});
    console.log(path.resolve(__dirname, `../${mainOrganization}.env`))
    console.log(process.env.Internal_token)
    switch (mainOrganization) {
        case 'Internal':
            try {
                // Retrieve token from .env file

                return axios.all(selectedOrgList.map(async (org_id) => {
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
                        })
                        // Return the response as well as org name
                        return [response.data, orgNameList[selectedOrgList.indexOf(org_id)]]
                    }
                ))
            }
            catch (err) {
                console.log(err)
            }
            break;
        case 'Seviora':
            try {
                return axios.all(selectedOrgList.map(async (org_id) => {
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

module.exports = getSomeDevices;

// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.