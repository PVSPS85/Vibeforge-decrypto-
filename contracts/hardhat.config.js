import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: "0.8.24", // <--- Change this from 0.8.20 to 0.8.24
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
};

export default config;