// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.

const request = require('request');
const path = require('path');
const fs = require('fs');
const os = require('os');
require("dotenv").config({path: path.join(__dirname, '../.env')})


// Generate token taking in organization choice from front end

const getToken = async (mainOrganization) => {

    let options = {
        method: 'POST',
        url: '',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        form: {
            grant_type: 'client_credentials',
            client_id: '',
            client_secret: '',
            scope: 'monitoring'
        }
    };

    if (mainOrganization === 'Internal') {
        try {
            options.url = `https://app.ninjarmm.com/ws/oauth/token`
            options.form.client_id = `${process.env.Internal_client_id}`
            options.form.client_secret = `${process.env.Internal_client_secret}`

            const token = await new Promise((resolve, reject) => {
                request(options, (error, response, body) => {
                        if (error) throw new Error(error);
                        let data = JSON.parse(body)
                        return resolve(data.access_token)

                    }
                )
            })
            return await token
            // console.log(JSON.parse(token).access_token)
        } catch (err) {
            console.log(err)
        }
    } else if (mainOrganization === 'Seviora') {
        try {
            options.url = `https://oc.ninjarmm.com/oauth/token`
            options.form.client_id = `${process.env.Seviora_client_id}`
            options.form.client_secret = `${process.env.Seviora_client_secret}`

            const token = await new Promise((resolve, reject) => {
                request(options, (error, response, body) => {
                    if (error) throw new Error(error);
                    let data = JSON.parse(body)
                    return resolve(data.access_token)

                    }
                )
            })
            // Store token in .env file
            return await token
            // console.log(JSON.parse(token).access_token)
            // Store token in .env file
        } catch (err) {
            console.log(err)
        }
    }
}

const saveToken = async (mainOrganization) => {
    const token = await getToken(mainOrganization)
    // Store token in .env file
    await fs.open(path.join(__dirname, `../${mainOrganization}.env`), 'w', 666, function( e, id ) {
        fs.write( id, `${mainOrganization}_token=${token}` + os.EOL, null, 'utf8', function(){
            fs.close(id, function(){
                // console.log(`Token for ${mainOrganization} saved in ${mainOrganization}.env file`);
            });
        });
    });
    return token
}
module.exports = saveToken

// Written entirely by: Bryan Kor
// Admin Number : P2043579
// Copyright 2022, Bryan Kor, All rights reserved.