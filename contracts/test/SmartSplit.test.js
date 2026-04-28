import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("SmartSplit", function () {
  let smartSplit;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const SmartSplit = await ethers.getContractFactory("SmartSplit");
    smartSplit = await SmartSplit.deploy();
  });

  it("Should correctly track net balances and settle", async function () {
    const members = [owner.address, addr1.address, addr2.address];
    await smartSplit.createGroup("Trip", members);

    // Owner pays 3000 for everyone (1000 each share)
    // Owner should have +2000, Addr1 -1000, Addr2 -1000
    await smartSplit.addExpense(1, "Dinner", 3000, owner.address, members);

    const ownerBalance = await smartSplit.getBalance(1, owner.address);
    const addr1Balance = await smartSplit.getBalance(1, addr1.address);

    expect(ownerBalance).to.equal(2000n);
    expect(addr1Balance).to.equal(-1000n);

    // Addr1 settles their debt
    await smartSplit.connect(addr1).settle(1, { value: 1000n });
    expect(await smartSplit.getBalance(1, addr1.address)).to.equal(0n);
  });
});