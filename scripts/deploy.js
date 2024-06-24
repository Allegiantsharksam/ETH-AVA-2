const hre = require("hardhat");

async function main() {
  const initBalance = 1;
  const Assessment = await hre.ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy(initBalance);
  await assessment.deployed();

  console.log(`A contract with balance of ${initBalance} eth deployed to ${assessment.address}`);
}

// This pattern is able to use async/await everywhere and also handle error properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
