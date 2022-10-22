const deviceData = require("../..//getDevicesByOrg/getSomeDevices");
const Splunk = require('splunk-sdk');


async function main() {
    let devices = await deviceData(["1", "2"], "Internal")
    console.log(devices);
}

main().then(() => {
    console.log("Done");
}
).catch((err) => {
    console.log(err);
}
)