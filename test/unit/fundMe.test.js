const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", async function () {
    let fundMe
    beforeEach(async function () {
        // deployments.fixture allows us to run our entire deploy folder with as many tags as we want ("all")
        const { deployer } = await getNamedAccounts()
        await deployments.fixture(["all"])
        // getContract will give us the most recent deployment of the defined contract
        fundMe = await ethers.getContract("FundMe", deployer)
    })

    describe("contsturctor", async function () {})
})
