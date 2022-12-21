// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.


// Import InternalToken from tokenRetrieval Folder
const getToken = require('../tokenRetrieval/internalToken');
const axios = require('axios');
const dotenv = require('dotenv');


//read token from .env file


// await InternalToken('Organization')
const getOrganizationData = async (mainOrganization, token) => {
    // console.log(mainOrganization)
    // calling tokenRetrieval function
    switch (mainOrganization) {
        case 'Internal':
            // Retrieve token from .env file
            try {
                const options = {
                    method: 'GET',
                    url: 'https://app.ninjarmm.com/v2/organizations',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                };
                const response = await axios(options)
                return response.data
            }
            catch (err) {
                console.log(err)
    }
    break;
        case 'Seviora':
            try {
                const options = {
                    method: 'GET',
                    url: 'https://oc.ninjarmm.com/v2/organizations',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                };
                const response = await axios(options)
                return response.data
            }
            catch (err) {
                console.log(err)
            }
            break;
    }
}

async function main(mainOrganization) {
    let list = [];
    await getToken(mainOrganization).then(async (token) => {
        let orgData = await getOrganizationData(mainOrganization, token)
        // Append orgaization name and id to list
        for (let i = 0; i < orgData.length; i++) {
            list.push({
                name: orgData[i].name,
                id: orgData[i].id
            })
        }
    })
    return list
    // Return orgData to front end
}



// main('Internal').then(r => console.log(r))
module.exports = main

// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.