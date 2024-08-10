import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";
import { expect } from "chai";
import { Voting } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Testing Voting Contract", function () {
  async function deployContract() {
    const Voting = await hre.ethers.getContractFactory("Voting");

    const voting = await Voting.deploy();

    const [owner] = await hre.ethers.getSigners();

    console.log("Onwer address:", owner.address);

    return { voting, owner };
  }

  async function testcreateElection(
    num: number,
    voting: Voting,
    owner: HardhatEthersSigner
  ) {
    // const { voting, owner } = await loadFixture(deployContract);
    await voting.createElection("test");
    expect((await voting.electionsArray(num)).name).to.equal("test");
    expect((await voting.electionsArray(num)).chairman).to.equal(owner.address);
  }

  async function testCreateCandidates(
    electionId: number,
    voting: Voting,
    owner: HardhatEthersSigner
  ): Promise<string[]> {
    // const { voting } = await loadFixture(deployContract);
    const [_owner, act1, act2, act3] = await hre.ethers.getSigners();

    await voting.setCandiate(0, "first", "I");
    await voting.connect(act1).setCandiate(electionId, "second", "II");
    await voting.connect(act2).setCandiate(electionId, "Third", "III");
    await voting.connect(act3).setCandiate(electionId, "fourth", "IV");

    const res = (await voting.getCandidatesbyElectionId(electionId)).map(
      (cand) => cand[2].toString()
    );
    expect(res).to.have.members(["first", "second", "Third", "fourth"]);
    return (await voting.getCandidatesbyElectionId(electionId)).map((cand) =>
      cand[4].toString()
    );
  }

  async function testCreateVoters(
    electionId: number,
    voting: Voting,
    owner: HardhatEthersSigner
  ) {
    // const { voting } = await loadFixture(deployContract);
    const [_owner, act1, act2, act3] = await hre.ethers.getSigners();

    await voting.setVoter(electionId, "voter1");
    await voting.connect(act1).setVoter(electionId, "voter2");
    await voting.connect(act2).setVoter(electionId, "voter3");
    await voting.connect(act3).setVoter(electionId, "voter4");

    const res = (await voting.getVotersbyElectionId(electionId)).map((voter) =>
      voter[2].toString()
    );
    expect(res).to.have.members(["voter1", "voter2", "voter3", "voter4"]);

    return (await voting.getVotersbyElectionId(electionId)).map((voter) =>
      voter.addr.toString()
    );
  }

  it("Should depoly contract and initialize variables", async function () {
    const { voting, owner } = await loadFixture(deployContract);
    expect(await voting.owner()).to.equal(owner.address);
  });

  it("Should Create an Election", async () => {
    const { voting, owner } = await loadFixture(deployContract);
    await testcreateElection(0, voting, owner);
  });

  it("Should be able to start Registration", async function () {
    const { voting, owner } = await loadFixture(deployContract);
    await testcreateElection(0, voting, owner);
    await voting.startRegistration(0);
    const res = (await voting.electionsArray(0)).status;
    expect(res).to.equal(1);
  });

  it("Should be able to create Multiple Candidates", async () => {
    const { voting, owner } = await loadFixture(deployContract);
    await testcreateElection(0, voting, owner);
    await voting.startRegistration(0);
    await testCreateCandidates(0, voting, owner);
  });

  it("Should be able to create Voters", async () => {
    const { voting, owner } = await loadFixture(deployContract);
    await testcreateElection(0, voting, owner);
    await voting.startRegistration(0);
    await testCreateVoters(0, voting, owner);
  });

  it("Should be able to start Election", async function () {
    const { voting, owner } = await loadFixture(deployContract);

    await testcreateElection(0, voting, owner);
    await voting.startRegistration(0);

    await voting.startVoting(0);

    const res = (await voting.electionsArray(0)).status;
    expect(res).to.equal(2);
  });

  it("Should be able to vote in Election", async function () {
    const { voting, owner } = await loadFixture(deployContract);

    const accounts = await hre.ethers.getSigners();
    await testcreateElection(0, voting, owner);
    await voting.startRegistration(0);

    const cand = await testCreateCandidates(0, voting, owner);
    const voters = await testCreateVoters(0, voting, owner);

    await voting.startVoting(0);

    for (let i = 0; i < 4; i++) {
      const act = accounts.find((val) => val.address == voters[i]);
      if (act) {
        await voting.connect(act).vote(0, cand[0]);
      }
    }

    const cand0 = await voting.getCandidatebyId(0, 0);
    expect(Number(cand0.votes)).to.equal(4);
  });
});
