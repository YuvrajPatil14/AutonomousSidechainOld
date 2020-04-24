//Add script 
//"api-test-side": "node ./base/api-test-mainchain.js",
//in package.json
//while running manually provide argument in command line
//Just run Test.bat from its local directory


const request = require("request");

const { OPCODE_MAP } = require("./interpreter");
const { STOP, ADD, PUSH, STORE, LOAD } = OPCODE_MAP;
let  BASE_URL = "http://localhost:";
 

const postTransact = ({ code, to, value, gasLimit },port) => {
  port? BASE_URL= "http://localhost:".concat(port):BASE_URL= "http://localhost:".concat('3000');
 
  return new Promise((resolve, reject) => {
    request(
      `${BASE_URL}/mainchain/transfer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, to, value, gasLimit }),
      },
      (error, response, body) => {
        return resolve(JSON.parse(body));
      }
    );
  });
};

const getMine = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      request(`${BASE_URL}/mainchain/mine`, (error, response, body) => {
        return resolve(JSON.parse(body));
      });
    }, 3000);
  });
};

//not in use
const getAccountBalance = ({ address } = {}) => {
  return new Promise((resolve, reject) => {
    request(
      `${BASE_URL}/account/balance` + (address ? `?address=${address}` : ""),
      (error, response, body) => {
        return resolve(JSON.parse(body));
      }
    );
  });
};


let toAccountData;
let smartContractAccountData;

const number_of_nodes = process.argv[2]
//run only if you have created same number of nodes
//loop will perform transaction on all nodes
!number_of_nodes ? number_of_nodes=1:null;
const start = 3000;
const limit =  start + parseInt(number_of_nodes)

async function run(tempPort){
  const post1 = await postTransact({},tempPort);
  const mine1 = await getMine();
  const post2 = await postTransact({to:post1.transaction.data.accountData.address,value:20},tempPort);
  const post3 = await postTransact({to:post1.transaction.data.accountData.address,value:30},tempPort);
  const post4 = await postTransact({to:post1.transaction.data.accountData.address,value:40},tempPort);
  const post5 = await postTransact({to:post1.transaction.data.accountData.address,value:50},tempPort);
  const post6 = await postTransact({to:post1.transaction.data.accountData.address,value:60},tempPort);
  const post7 = await postTransact({to:post1.transaction.data.accountData.address,value:70},tempPort);
  const post8 = await postTransact({to:post1.transaction.data.accountData.address,value:80},tempPort);
  const mine2 = await getMine();

}

for(let tempPort = start; tempPort < limit;tempPort++){
  run(tempPort)
}



// for(let tempPort = start; tempPort < limit;tempPort++)
// {

//     postTransact({},tempPort)
//   .then(postTransactResponse => {
//     console.log(
//       'postTransactResponse (Create Account Transaction)',
//       postTransactResponse
//     );

//     toAccountData = postTransactResponse.transaction.data.accountData;

//     return getMine();
//   }).then(getMineResponse => {
//     console.log('getMineResponse', getMineResponse);

//     return postTransact({ to: toAccountData.address, value: 20 },tempPort);
//   }).then(postTransactResponse1 => {
//     console.log('postTransactResponse1', postTransactResponse1);

//     return postTransact({ to: toAccountData.address, value: 30 },tempPort);
//   }).then(postTransactResponse2 => {
//     console.log('postTransactResponse2', postTransactResponse2);

//     return postTransact({ to: toAccountData.address, value: 40 },tempPort);
//   }).then(postTransactResponse3 => {
//     console.log('postTransactResponse3', postTransactResponse3);

//     return postTransact({ to: toAccountData.address, value: 50 },tempPort);
//   }).then(postTransactResponse4 => {
//     console.log('postTransactResponse4', postTransactResponse4);

//     return postTransact({ to: toAccountData.address,gasLimit:10, value: 400  },tempPort);
//   }).then(postTransactResponse => {
//     console.log(
//       'Mine block final',
//       postTransactResponse
//     );

//     return getMine();
//   });

// }
