import hre, { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Deployer:", owner.address);

  const contract = await hre.ethers.deployContract("Swisstronik", [
    // "Hello Swisstronik!!",
  ]);

  await contract.waitForDeployment();

  const contractAddress = contract.target;
  console.log(
    `Swisstronik contract deployed to: "${contractAddress}" <- copy that for "the deployed contract address"`
  );

  // Define the path for contracthardhat.txt
  const filePath = path.join(__dirname, 'contracthardhat.txt');

  // Write the contract address to the file
  fs.writeFileSync(filePath, contractAddress);

  console.log(`Contract address written to ${filePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
