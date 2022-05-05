const basePath = process.cwd();
const { MODE } = require(`${basePath}/constants/blend_mode.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// General metadata for Ethereum
const namePrefix = "RocketNFT";
const description = "This is where your Rocket NFT will take you - the outerworld of Rocket Planetary System!";
const baseUri = "ipfs://NewUriToReplace";
const external_link_name = "http://thisisrocketelevators.tk.s3-website-us-east-1.amazonaws.com/";
const collectionName = "BestRocketNFTCollection";

const solanaMetadata = {
  symbol: "YC",
  seller_fee_basis_points: 1000, // Define how much % you want from secondary market sales 1000 = 10%
  external_url: 'http://thisisrocketelevators.tk.s3-website-us-east-1.amazonaws.com/',
  creators: [
    {
      address: "7fXNuer5sbZtaTEPhtJ5g5gNtuyRoKkvxdjEjEnPN4mC",
      share: 100,
    },
  ],
};

// If you have selected Solana then the collection starts from 0 automatically
const layerConfigurations = [
  {
    growEditionSizeTo: 1,
    layersOrder: [
      { name: "Background" },
      { name: "Frame" },
      { name: "HorizontalRings" },
      { name: "VerticalRings" }
    ],
  },
];

const shuffleLayerConfigurations = false;

const debugLogs = true;

const format = {
  width: 500,
  height: 500,
  smoothing: false,
};

const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

const text = {
  only: false,
  color: "#ffffff",
  size: 20,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Courier",
  spacer: " => ",
};

const pixelFormat = {
  ratio: 2 / 128,
};

const background = {
  generate: false,
  brightness: "80%",
  static: false,
  default: "#000000",
};

const extraMetadata = {};

const rarityDelimiter = "#";

const uniqueDnaTorrance = 10000;

const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

const preview_gif = {
  numberOfImages: 5,
  order: "ASC", // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};

// NFTPort Info
// ** REQUIRED **
const AUTH = "8f405c10-6286-4b71-a801-71361964bac0";
const LIMIT = 2; // Your API key rate limit
const CONTRACT_NAME = 'RocketNFT';
const CONTRACT_SYMBOL = 'RE';
const CONTRACT_TYPE = 'erc721';
const MINT_TO_ADDRESS = '';
const CHAIN = 'rinkeby';
const METADATA_UPDATABLE = true; // set to false if you don't want to allow metadata updates after minting
// const ROYALTY_SHARE = 1000; // Percentage of the token price that goes to the royalty address. 100 bps = 1%
// const ROYALTY_ADDRESS = "0xd8B808A887326F45B2D0cd999709Aa6264CeF919"; // Address that will receive the royalty
// ** OPTIONAL **
// let CONTRACT_ADDRESS = "YOUR CONTRACT ADDRESS"; // If you want to manually include it
// Generic Metadata is optional if you want to reveal your NFTs
const GENERIC = false; // Set to true if you want to upload generic metas and reveal the real NFTs in the future
// const GENERIC_TITLE = "Unknown"; // Replace with what you want the generic titles to say.
// const GENERIC_DESCRIPTION = "Unknown"; // Replace with what you want the generic descriptions to say.
// const GENERIC_IMAGE = [
//   "https://ipfs.io/ipfs/QmUf9tDbkqnfHkQaMdFWSGAeXwVXWA61pFED7ypx4hcsfh",
// ]; // Replace with your generic image(s). If multiple, separate with a comma.
// const REVEAL_PROMPT = true; // Set to false if you want to disable the prompt to confirm each reveal.
// const INTERVAL = 900000; // Milliseconds. This is the interval for it to check for sales and reveal the NFT. 900000 = 15 minutes.



module.exports = {
  format,
  baseUri,
  description,
  collectionName,
  external_link_name,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  pixelFormat,
  text,
  namePrefix,
  network,
  solanaMetadata,
  gif,
  preview_gif,
  AUTH,
  LIMIT,
  MINT_TO_ADDRESS,
  CHAIN,
  GENERIC,
  CONTRACT_NAME,
  CONTRACT_SYMBOL,
  CONTRACT_TYPE,

};
