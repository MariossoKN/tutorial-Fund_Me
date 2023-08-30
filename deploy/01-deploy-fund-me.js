// async function deployFunc(hre) {
//     hre.getnNamedAccounts()
//     hre.deployments
// }
// module.exports.default = deployFunc

// this is the same as this but without a function name (deployFunc):

// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre
// }

// this is again the same as the above:

// module.exports = async ({ getNamedAccounts, deployments }) => {}
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    // we are grabbing functions deploy and log from deployments object
    const { deploy, log } = deployments
    // we are grabbing this deployer account from getNamedAccounts function
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress // make it let instead const so we can change it
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // when going for localhost or hardhat network we want to use a mock
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        // it has to be "FundMe" not "fundMe" even tho contract name isnt with capital "f"
        from: deployer,
        args: args, // put price feed address (constructor parameter)
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    log("----------------------------------------------------")
}
module.exports.tags = ["all", "fundme"]
