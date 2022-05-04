const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');



//Get metadata from Json file



fs.writeFileSync('../build/json/_ipfsMetas.json', "");
const writer = fs.createWriteStream('../build/json/_ipfsMetas.json', {
    flags: "a",
})
writer.write("[");
const readDir = "../build/json";
const jsonFile = fs.readFileSync('../build/json/1.json');
const metaData = JSON.stringify(JSON.parse(jsonFile));

const uploadedMeta = "../build/ipfsMetas/1.json";


console.log(metaData);
//Upload image to IPFS and update IPFS url to metadata
const url = "https://api.nftport.xyz/v0/metadata";
const options = {
  method: 'POST',
  body: metaData,
  headers: {
    "Content-Type": "application/json",
    "Authorization": "8f405c10-6286-4b71-a801-71361964bac0",
  },
};

fetch(url , options)
    .then(response => {
        return response.json();
    })
    .then(responseJson => {
        console.log(responseJson);
        
        writer.write(JSON.stringify(responseJson, null, 2));
        writer.write("]");
        writer.end();
})

