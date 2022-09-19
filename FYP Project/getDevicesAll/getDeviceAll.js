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

async function main(mainOrganization) {
    await getOrgDevicesAll(mainOrganization).then((orgDeviceIdList) => {
        return orgDeviceIdList
    }
    )
}




async function getOrgDevicesAll(mainOrganization) {
    let orgIdList = [];
    let orgDeviceIdList = [];
    await getOrg(mainOrganization).then(orgData => {
        for (let i = 0; i < orgData.length; i++) {
            orgIdList.push(orgData[i].id)
        }
        dotenv.config({path : `../${mainOrganization}.env`
        })
        switch (mainOrganization) {

            case 'Internal':
                try {
                    axios.all(orgIdList.map(orgId => {
                        return axios.get(`https://app.ninjarmm.com/v2/organization/${orgId}/devices`, {
                            headers: {
                                'Authorization': `Bearer ${process.env.Internal_token}`,
                                'Content-Type': 'application/json'
                            }
                        })
                    })).then(axios.spread((...responses) => {
                        let data = responses.map(response => response.data)
                        for (let i = 0; i < data.length; i++) {
                            for (let j = 0; j < data[i].length; j++) {
                                 orgDeviceIdList.push({
                                    ID: data[i][j].id
                                 }
                                )

                            }
                        }
                        }
                    ))
                    return orgDeviceIdList
                }
                catch (err) {
                    console.log(err)
                }
                break;
            case 'Seviora':
                try {
                    axios.all(orgIdList.map(orgId => {
                        return axios.get(`https://oc.ninjarmm.com/v2/organization/${orgId}/devices`, {
                            headers: {
                                'Authorization': `Bearer ${process.env.Seviora_token}`,
                                'Content-Type': 'application/json'
                            }
                        })
                    })).then(axios.spread((...responses) => {
                        let data = responses.map(response => response.data)
                        console.log(data)
                    }
                    ))
                }
                catch (err) {
                    console.log(err)
                }
                break;
        }
    })

}
// function errorChecker(variable) {
//     if
// }

main('Internal').then((data) => {
    console.log(data)
})