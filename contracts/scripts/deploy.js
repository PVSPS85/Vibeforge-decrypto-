import hre from "hardhat";

async function main() {
  const SmartSplit = await hre.ethers.getContractFactory("SmartSplit");
  const smartSplit = await SmartSplit.deploy();

  await smartSplit.waitForDeployment();

  console.log("SmartSplit deployed to:", await smartSplit.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});