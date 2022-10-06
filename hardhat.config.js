require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17"
    }
    ],
    overrides: {
      "contracts/Hex/HEX.sol": {
        version: "0.5.13",
        settings: { }
      }
    }
  },

  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    
    }
  }
};
