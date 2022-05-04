const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

//Prepare form data for image upload
const form = new FormData();
const fileStream = fs.createReadStream('../build/images/1.png');
form.append('file', fileStream);

//Get metadata from Json file
const jsonFile = fs.readFileSync('../build/json/1.json');
const metaData = JSON.parse(jsonFile);


//Upload image to IPFS and update IPFS url to metadata
const url = "https://api.nftport.xyz/v0/files";
const options = {
  method: 'POST',
  body: form,
  headers: {
    "Authorization": "8f405c10-6286-4b71-a801-71361964bac0",
  },
};

fetch(url , options)
    .then(response => {
        return response.json();
    })
    .then(responseJson => {
        console.log(responseJson);
        console.log(responseJson.ipfs_url);
        metaData.file_path = responseJson.ipfs_url;
        fs.writeFileSync(
            '../build/json/1.json',
            JSON.stringify(metaData, null, 2));
        
})

