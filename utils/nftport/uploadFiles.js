const FormData = require("form-data");
const path = require("path");
const basePath = process.cwd();
const fs = require("fs");

const { RateLimit } = require('async-sema');
const { fetchWithRetry } = require(`${basePath}/functions/fetchWithRetry.js`);

const _limit = RateLimit(2);

const allMetadata = [];
const regex = new RegExp("^([0-9]+).png");

async function main() {
  console.log("Starting upload of images...");
  const files = fs.readdirSync(`../build/images`);
  files.sort(function(a, b){
    return a.split(".")[0] - b.split(".")[0];
  });
 
    try {
    
        let jsonFile = fs.readFileSync('../build/json/1.json');
        let metaData = JSON.parse(jsonFile);
        console.log(jsonFile);
        console.log(metaData);

        if(!metaData.file_url.includes('https://')) {
          await _limit()
          const url = "https://api.nftport.xyz/v0/files";
          const formData = new FormData();
          const fileStream = fs.createReadStream('../build/images/1.png');
          formData.append("file", fileStream);
          const options = {
            method: "POST",
            headers: {
              Authorization: "8f405c10-6286-4b71-a801-71361964bac0",
            },
            body: formData,
          };
          const response = await fetchWithRetry(url, options);
          metaData.file_url = response.ipfs_url;
          metaData.image = response.ipfs_url;

          fs.writeFileSync(
            `../build/json/${fileName}.json`,
            JSON.stringify(metaData, null, 2)
          );
          console.log(`${response.file_name} uploaded & ${fileName}.json updated!`);
        } else {
          console.log(`${fileName} already uploaded.`);
        }

        allMetadata.push(metaData);
      
    } catch (error) {
      console.log(`Catch: ${error}`);
    }
  

  fs.writeFileSync(
    `../build/json/_metadata.json`,
    JSON.stringify(allMetadata, null, 2)
  );
}

main();
