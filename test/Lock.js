const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

let contract;
let accounts;


beforeEach( async () => {
    accounts = await ethers.getSigners();
    const StudentVerify = await ethers.getContractFactory("StudentVerify");
    contract = await StudentVerify.deploy();
    await contract.deployed();

} );

describe("StudentVerify Contract Deploy Check", () => {
    it("Deployment Test and About Us", async () => {
        expect(await contract.owner()).to.equal(accounts[0].address);
    });

    it("Owner Check", async () => {
        expect(await contract.owner()).to.equal(accounts[0].address);
    });

    it("Adding StudentMarks Data", async () => {
        await contract.addMarks([1, 2, 3, 4, 5, 6],[100, 80, 30, 70, 90, 60]);
        expect(await contract.studentMarks(1)).to.equal(100);
        expect(await contract.studentMarks(2)).to.equal(80);
        expect(await contract.studentMarks(3)).to.equal(30);
        expect(await contract.studentMarks(4)).to.equal(70);
        expect(await contract.studentMarks(5)).to.equal(90);
        expect(await contract.studentMarks(6)).to.equal(60);    
    });


    it("Adding Scrutinizing Data", async () => {
      await contract.addScrutinyMarks([1, 2, 3, 4, 5, 6],[100, 80, 30, 70, 90, 60]);
      expect(await contract.scrutinizerMarks(1)).to.equal(100);
      expect(await contract.scrutinizerMarks(2)).to.equal(80);
      expect(await contract.scrutinizerMarks(3)).to.equal(30);
      expect(await contract.scrutinizerMarks(4)).to.equal(70);
      expect(await contract.scrutinizerMarks(5)).to.equal(90);
      expect(await contract.scrutinizerMarks(6)).to.equal(60);
    });

    it("Should return 1 discrepency in data", async () => {
      await contract.addMarks([1, 2, 3, 4, 5, 6],[100, 80, 35, 75, 90, 60]);
      await contract.addScrutinyMarks([1, 2, 3, 4, 5, 6],[100, 80, 30, 70, 90, 60]);
      const tx = await contract.checkIntegrity();
      let receipt = await tx.wait();
      let data = (receipt.events?.filter((x) => {return x.event == "ErrorInStudentData"}));
      let errorData = [3, 4];
      for(let i=0; i<data.length; i++){
        console.log("Error in studentId : ", (data[i].args.studentId.toNumber()));
        expect(data[i].args.studentId).to.deep.equal(errorData[i]);
      }
    });
});