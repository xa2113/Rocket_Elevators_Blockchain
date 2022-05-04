const fs = require("fs");
const contract = JSON.parse(
    fs.readFileSync("../build/contracts/RocketNFT.json", "utf8")
);
console.log(JSON.stringify(contract.abi));

export const abi_string = JSON.stringify(contract.abi);
