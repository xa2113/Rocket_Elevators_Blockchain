const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const basePath = process.cwd();
const {AUTH} = require(`${basePath}/src/config.js`);

//Get metadata from Json file
fs.writeFileSync(`${basePath}/build/json/_ipfsMetas.json`, "");
const writer = fs.createWriteStream(`${basePath}/build/json/_ipfsMetas.json`, {
    flags: "a",
})
writer.write("[");
const jsonFile = fs.readFileSync(`${basePath}/build/json/1.json`);
const metaData = JSON.stringify(JSON.parse(jsonFile));

//Upload image to IPFS and update IPFS url to metadata
const url = "https://api.nftport.xyz/v0/metadata";
const options = {
  method: 'POST',
  body: metaData,
  headers: {
    "Content-Type": "application/json",
    "Authorization": AUTH,
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


// fetch(url , options)
//     .then(response => {
//         return response.json();
//     })
//     .then(responseJson => {
//         console.log(responseJson);
        
//         writer.write(JSON.stringify(responseJson, null, 2));
//         writer.write("]");
//         writer.end();
// })

