// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract StudentVerify {

    uint256[] public studentIdData;
    mapping(uint256 => uint256) public studentMarks;
    mapping(uint256 => uint256) public scrutinizerMarks;
    address public owner;

    constructor(){
        owner = msg.sender;
    }

    event ErrorInStudentData(uint256 studentId, uint256 originalMarks, uint256 scrutinizerMarks);
    event StudentDataVerified();

    function addMarks(uint256[] calldata _studentIds, uint256[] calldata _marksData) external {
        require(msg.sender == owner, "Only owner can add marks");
        for(uint256 i = 0; i < _studentIds.length; i++){
            studentIdData.push(_studentIds[i]);
            studentMarks[_studentIds[i]] = _marksData[i];
        }
    }

    function addScrutinyMarks(uint256[] calldata studentIds, uint256[] calldata marksData) external {
        require(msg.sender == owner, "Only owner can add marks");
        for(uint256 i = 0; i < studentIds.length; i++){
            scrutinizerMarks[studentIds[i]] = marksData[i];
        }
    }

    function checkIntegrity() external {
        bool check = false;
        for(uint256 i=0; i<studentIdData.length; i++){
            if(studentMarks[studentIdData[i]] != scrutinizerMarks[studentIdData[i]]){
                check = true;
                emit ErrorInStudentData(studentIdData[i], studentMarks[studentIdData[i]], scrutinizerMarks[studentIdData[i]]);
            }
        }
        if(!check){
            emit StudentDataVerified();
        }
    }


}

