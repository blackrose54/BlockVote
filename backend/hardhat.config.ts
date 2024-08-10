import { HardhatUserConfig, task, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@nomiclabs/hardhat-web3";

const ALCHEMY_API_KEY = vars.get('ALCHEMY_API_KEY')

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks:{
    hardhat:{
      forking:{
        url:`https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
        blockNumber:9063391
      }
    }
  }
};

task('account-details','get accounts and their balance',async (_,{ethers})=>{
  const accounts = await ethers.getSigners();
    const provider = ethers.provider;

    for (const account of accounts) {
        console.log(
            "%s (%i ETH)",
            account.address,
            ethers.formatEther(
                // getBalance returns wei amount, format to ETH amount
                await provider.getBalance(account.address)
            )
        );
    }
})

export default config;
