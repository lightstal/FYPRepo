const dataIngester = require('../SplunkScripts/DataIngestion/IngestingData');
const SplunkUpload = require('../SplunkScripts/DataIngestion/SplunkUploader');


const dataIngestion = async () => {
    try {
        return await dataIngester([17], "Internal")
    } catch (error) {
        console.error(`An error occurred during dataIngester: ${error}`);
    }
}

try {
    dataIngestion().then((data) => {
        try {
            SplunkUpload(data)
        } catch (error) {
            console.error(`An error occurred during SplunkUpload: ${error}`);
        }
    })
} catch (error) {
    console.error(`An error occurred during dataIngestion: ${error}`);
    process.exit(1);
}
