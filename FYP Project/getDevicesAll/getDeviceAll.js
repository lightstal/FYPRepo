const getOrg = require("../getOrganization/getOrganization");
const axios = require('axios');
const dotenv = require('dotenv');


// async function main(mainOrganization) {
//     let orgIdList = [];
//     await getOrg(mainOrganization).then((orgData) => {
//         orgIdList.push(orgData)
//     })
//     return orgIdList[0]
// }


async function retrieveOrgList(mainOrganization) {
    let orgIdList = [];
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
    dotenv.config({path : `../${mainOrganization}.env`})
        switch (mainOrganization) {
            case 'Internal':
            try {
                // Retrieve token from .env file
                return axios.all(org_list.map(async (org_id) => {
                        const options = {
                            method: 'GET',
                            url: `https://app.ninjarmm.com/v2/organization/${org_id}/devices`,
                            headers: {
                                'Authorization': `Bearer ${process.env.INTERNAL_TOKEN}`,
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
    console.log(devices_obj)
}

main('Seviora')