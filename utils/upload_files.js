const fs = require('fs');
const basePath = process.cwd();
const fetch = require('node-fetch');
const FormData = require('form-data');
const {AUTH} = require(`${basePath}/src/config.js`);

//Prepare form data for image upload
const form = new FormData();
const fileStream = fs.createReadStream(`${basePath}/build/images/1.png`);
form.append('file', fileStream);

//Get metadata from Json file
const jsonFile = fs.readFileSync(`${basePath}/build/json/1.json`);
const metaData = JSON.parse(jsonFile);


//Upload image to IPFS and update IPFS url to metadata
const url = "https://api.nftport.xyz/v0/files";
const options = {
  method: 'POST',
  body: form,
  headers: {
    "Authorization": AUTH,
  },
};

console.log(AUTH);

fetch(url , options)
    .then(response => {
        return response.json();
    })
    .then(responseJson => {
        console.log(responseJson);
        console.log(responseJson.ipfs_url);
        metaData.file_url = responseJson.ipfs_url;
        fs.writeFileSync(
          `${basePath}/build/json/1.json`,
            JSON.stringify(metaData, null, 2));
        
})

