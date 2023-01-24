const fs = require('fs');
const organizationList = require('../getOrganization/getOrganization');

// Call the function to retrieve the organization list
organizationList('Internal').then((orgData) => {
    for (let i = 0; i < orgData.length; i++) {
        // Create a .env file for each organization
        // Strip special characters from the organization name
        let orgName = orgData[i].name.replace(/[^a-zA-Z0-9]/g, '');
        fs.writeFileSync(`../IngestOrganizations/${orgName}.js`, `const dataIngester = require('../SplunkScripts/DataIngestion/IngestingData');
const SplunkUpload = require('../SplunkScripts/DataIngestion/SplunkUploader');


const dataIngestion = async () => {
    try {
        return await dataIngester([${orgData[i].id}], "Internal")
    } catch (error) {
        console.error(\`An error occurred during dataIngester: \${error}\`);
    }
}

try {
    dataIngestion().then((data) => {
        try {
            SplunkUpload(data)
        } catch (error) {
            console.error(\`An error occurred during SplunkUpload: \${error}\`);
        }
    })
} catch (error) {
    console.error(\`An error occurred during dataIngestion: \${error}\`);
    process.exit(1);
}
`
        )
    }
})

