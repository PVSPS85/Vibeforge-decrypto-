import hre from "hardhat";

async function main() {
  const SmartSplit = await hre.ethers.getContractFactory("SmartSplit");
  
  console.log("Deploying SmartSplit...");
  const smartSplit = await SmartSplit.deploy();

  await smartSplit.waitForDeployment();

  console.log(`SmartSplit successfully deployed to: ${smartSplit.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});