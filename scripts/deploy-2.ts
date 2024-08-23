import { ethers } from "hardhat";
import { sendShieldedTransaction } from "../utils/swisstronik";
import fs from "fs";
import path from "path";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Deployer:", owner.address);

  // Deploy the contract
  const contract = await ethers.deployContract("TestToken");
  await contract.waitForDeployment();
  const contractAddress = contract.target;
  console.log(
    `Deployed to: ${contractAddress} <- copy that for "the deployed contract address"`
  );

  // Write the contract address to contracterc20.txt
  const contractFilePath = path.join(__dirname, 'contracterc20.txt');
  fs.writeFileSync(contractFilePath, contractAddress);
  console.log(`Contract address written to ${contractFilePath}`);

  // Mint tokens
  const mint100TokensTx = await sendShieldedTransaction(
    owner,
    contractAddress,
    contract.interface.encodeFunctionData("mint100tokens"),
    0
  );
  await mint100TokensTx.wait();
  console.log("Mint Response:", mint100TokensTx.hash);

  // Transfer tokens
  const transfer = await sendShieldedTransaction(
    owner,
    contractAddress,
    contract.interface.encodeFunctionData("transfer", [
      "0x16af037878a6cAce2Ea29d39A3757aC2F6F7aac1",
      ethers.parseEther("1").toString(),
    ]),
    0
  );
  await transfer.wait();
  console.log(
    `Transfer Response: https://explorer-evm.testnet.swisstronik.com/tx/${transfer.hash} <- copy that for "the token transaction link"`
  );

  // Write the transaction hash to txerc20.txt
  const txFilePath = path.join(__dirname, 'txerc20.txt');
  fs.writeFileSync(txFilePath, transfer.hash);
  console.log(`Transaction hash written to ${txFilePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
