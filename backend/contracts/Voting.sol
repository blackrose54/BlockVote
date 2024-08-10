// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Voting {

    uint constant public maxNoOfElections = 1000;

    enum Status {
        Created,
        Registration,
        Election,
        Result,
        Over
    }

    struct Voter{
        uint id;
        uint electionId;
        string name;
        address addr;
        bool hasVoted;
    }

    struct Candidate{
        uint id;
        uint electionId;
        string name;
        string symbol;
        address addr;
        uint votes;
    }

    struct Election{
        uint id;
        string name;
        Status status;

        address chairman;

    }   

    mapping (bytes32=>uint)  voters;
    mapping (bytes32=>uint)  candidates;
    mapping (string => uint) elections; 

    Election[maxNoOfElections] public electionsArray ;
    Voter[][maxNoOfElections]  voterArray;
    Candidate[][maxNoOfElections] candidateArray;

    bool[maxNoOfElections] freeSlotsElection;
 
    address public  owner;

    constructor() {
        owner = msg.sender;
        for(uint i = 0; i < maxNoOfElections;i++){
            freeSlotsElection[i] = true;
        }        
    }

    modifier  onlyOwner(){
        require(msg.sender == owner,"Only owner can call this function");
        _;
    }

    modifier inRangeVoterArray(uint electionId,uint id){
        require(electionId < maxNoOfElections,"ElectionId out of range");
        require(id < voterArray[electionId].length,"VoterId out of range");
        _;
    }

    modifier inRangeCandidateArray(uint electionId,uint id){
        require(electionId < maxNoOfElections,"ElectionId out of range");
        require(candidateArray.length > id,"CandidateId out of range");
        _;
    }

    function getActiveElections() public view returns (Election[] memory) {
        uint count = 0;
        for (uint i = 0; i < electionsArray.length; i++) {
            if (electionsArray[i].chairman != address(0)) {
                count++;
            }
        }

        Election[] memory activeElections = new Election[](count);
        uint index = 0;
        for (uint i = 0; i < electionsArray.length; i++) {
            if (electionsArray[i].chairman != address(0)) {
                activeElections[index] = electionsArray[i];
                index++;
            }
        }

        return activeElections;
    }
    
    function createElection(string calldata _name) public returns(uint) {
        //find free slots;
        bool flag = false;
        for(uint i = 0; i < maxNoOfElections;i++){
            if(freeSlotsElection[i]){
                electionsArray[i] = Election(i,_name,Status.Created,msg.sender);
                elections[_name] = i;
                flag = true;
                freeSlotsElection[i] = false;
                return i;
            }
        }
        revert("Cannot create any more elections");
    }

    function deleteElection(uint _id) public {
        require(electionsArray[_id].chairman == msg.sender,"not the chairman of election");
        delete electionsArray[_id];   
        delete voterArray[_id];
        delete candidateArray[_id];
        freeSlotsElection[_id] = true;    
    }

    function startRegistration(uint electionId) public {
        require(electionsArray[electionId].status == Status.Created,"Cannot register");
        require(electionsArray[electionId].chairman == msg.sender,"Only chairman can start registration");

        electionsArray[electionId].status = Status.Registration;
    }

    function startResults(uint electionId) public {
        require(electionsArray[electionId].status == Status.Election,"Cannot show result");
        require(electionsArray[electionId].chairman == msg.sender,"Only chairman can start registration");

        electionsArray[electionId].status = Status.Result;
    }

    function startVoting(uint electionId) public {
        require(electionsArray[electionId].status == Status.Registration,"Cannot vote");
        require(electionsArray[electionId].chairman == msg.sender,"Only chairman can start voting");

        electionsArray[electionId].status = Status.Election;
    }

    function setElectionOver(uint electionId) public {
        require(electionsArray[electionId].status == Status.Result,"Cannot set Over");
        require(electionsArray[electionId].chairman == msg.sender,"Only chairman can start voting");

        electionsArray[electionId].status = Status.Over;
    }    

    function setVoter(uint electionId,string memory _name) public returns(uint) {
        require(electionsArray[electionId].status == Status.Registration,"Cannot set voter now");
        bytes32 key = keccak256(abi.encodePacked(electionId,msg.sender));
        uint index = voters[key];

        if(voterArray[electionId].length != 0 && (index > 0 || (index == 0 && voterArray[electionId][index].addr == msg.sender))){
            voterArray[electionId][index] = Voter(index,electionId,_name,msg.sender,false);
            return index;
        }else{
            voters[key] = voterArray[electionId].length;
            voterArray[electionId].push(Voter(voterArray[electionId].length,electionId,_name,msg.sender,false));
            return voterArray[electionId].length ;
        }
    }

    function setCandiate(uint electionId,string memory _name,string memory _symbol) public returns(uint){
        require(electionsArray[electionId].status == Status.Registration,"Cannot set candidate now");
        bytes32 key = keccak256(abi.encodePacked(electionId,msg.sender));
        uint index = candidates[key];

        if(candidateArray[electionId].length != 0 && (index > 0 || (index == 0 && candidateArray[electionId][index].addr == msg.sender))){
            candidateArray[electionId][index] = Candidate(index,electionId,_name,_symbol,msg.sender,0);
            return index;
        }else{
            candidates[key] = candidateArray[electionId].length;
            candidateArray[electionId].push(Candidate(candidateArray[electionId].length,electionId,_name,_symbol,msg.sender,0));
            return candidateArray[electionId].length;
        }

    }

    function getVotersbyElectionId(uint id) public  view returns(Voter[] memory){
        require(id < maxNoOfElections,"ElectionId out of range");
        return voterArray[id];
        
    }

    function getCandidatesbyElectionId(uint id) public view returns (Candidate[] memory){
        require(id < maxNoOfElections,"ElectionId out of range");
        return candidateArray[id];
    }

    function getVoterbyId(uint electionId,uint id) public inRangeVoterArray(electionId,id) view returns(Voter memory){
        return voterArray[electionId][id];
    }

    function getCandidatebyId(uint electionId,uint id) public inRangeCandidateArray(electionId, id) view returns(Candidate memory){
        return candidateArray[electionId][id];
    }

    function deleteVoterbyId(uint electionId,uint id) public inRangeVoterArray(electionId, id) {
        require(msg.sender == voterArray[electionId][id].addr,"Not the owner of voter");
        delete voterArray[electionId][id];
    }

    function deleteCandidatebyId(uint electionId,uint id) public inRangeCandidateArray(electionId, id) {
        require(msg.sender == candidateArray[electionId][id].addr,"Not the owner of candiate");
        delete candidateArray[electionId][id];
    }

    function vote(uint electionId,address candidateAddress) public {
        require(electionsArray[electionId].status == Status.Election,"Cannot vote now");
        bytes32 key = keccak256(abi.encodePacked(electionId,candidateAddress));
        uint index = candidates[key];

        bytes32 voterkey = keccak256(abi.encodePacked(electionId,msg.sender));
        uint vindex = voters[voterkey];

        require(candidateArray[electionId].length > index && candidateArray[electionId][index].addr != address(0x0),"Candidate not found");

        require(voterArray[electionId].length > vindex && voterArray[electionId][vindex].addr != address(0x0),"Voter not found");
        require(!voterArray[electionId][vindex].hasVoted,"Voter has already voted");

        voterArray[electionId][vindex].hasVoted = true;
        candidateArray[electionId][index].votes++;
        
    }

}