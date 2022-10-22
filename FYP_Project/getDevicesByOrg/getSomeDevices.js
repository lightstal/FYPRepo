//

const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const getOrg = require("../getOrganization/getOrganization");


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


async function getSomeDevices(selectedOrgList, mainOrganization) {
    let org_list = await retrieveOrgList(mainOrganization)

    console.log("Your selected organization list is: ", selectedOrgList)
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