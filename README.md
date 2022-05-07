## Rocket Elevators Blockchain

* The endpoints are deployed at https://rocketplanetarium.herokuapp.com/.
* The NFT smart contract is deployed at "0x5b53c2F0b1EC018DD05A7432Ca5F6F383F261A9C".


This is the backend implementation of the Rocket Rocket NFT collection. The project provides several API endpoints (listed below) to allow the front end application to display a user's NFT collection, purchase a new NFT, redeem a free NFT, etc. The project includes several components: 
1. the NFT smart contract
2. the express app with the various endpoints
3. the functionality of randomly generating a NFT image and uploading the image to IPFS, and including this IPFS url in the metadata which is also uploaded to IPFS (to arrive at the metadata uri). The IPFS uploads are processed through the free API provided by NFTPort.
4. unit tests to test the NFT smart contract


### API endpoints
1. GET "/NFT/eligible/<wallet-address>"
  Check if a wallet account is eligible for a free NFT. Please an account will not be eligible if this user has already redeemed his/her NFT.
2. GET "/NFT/free/<wallet-address>"
  Gift a free NFT to a whitelisted wallet address.
3. GET "/NFT/balance/<wallet-address>"
  Returns the number of NFT a wallet address owns.
4. GET "/NFT/collectionURIs/<wallet-address>"
  Returns the list of NFTs a wallet address owns.
5. GET "/NFT/pay/rocket/<wallet-address>"
  Buys an NFT with a ROCKET token. Please note this will only be allowed if the user has enough ROCKET tokens and has approved the transaction (ie. there is enough allowance for the NFT wallet address to process the purchase).


### SET UP
* npm install
* npm start

* To generate a new NFT image: 
- npm run generate
* To upload the image to IPFS:
- npm run upload_file
* To upload the metadata to IPFS:
- npm run upload_metadata
