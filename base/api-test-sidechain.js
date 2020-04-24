//Add script 
//"api-test-side": "node ./base/api-test-sidechain.js",
//in package.json
//create side chain sends data hence static 
//credentials in the r-sidechain.js will not be used
// while running manually provide argument in command line
//Just run Test.bat from its local directory

const request = require("request");

const { OPCODE_MAP } = require("./interpreter");
const { STOP, ADD, PUSH, STORE, LOAD } = OPCODE_MAP;
console.log("-------------apitest side chain--------------");
let  BASE_URL ;

const credential2 = {
  publishKey: "pub-c-b4ef5ca9-5b50-44f5-a57e-0894ab85c8b1",
  subscribeKey: "sub-c-1a6ad124-7d8f-11ea-8ca3-9e2d2a3ca26d",
  secretKey: "sec-c-NzdhNDFlOTgtNmZlMy00YWJkLTk3YzUtMWM1ZTMzM2ZiYWY4"
  }
const credential1 ={
    publishKey: 'pub-c-eab17385-8f85-497d-8cb8-9e06967b1456',
    subscribeKey: 'sub-c-6180566e-43f7-11ea-aea8-722f8d3d4603',
    secretKey: 'sec-c-YTVkNDkwMzAtMjIwNy00MjUyLWI3ZDctMzU0ODg0MjM1YjJj',
  
}

const createSideChain = ({name,credential},port)=>{
    return new Promise((resolve,reject)=>{
   !port? port=3000:null;
    request(
     `http://localhost:${port}/sidechain/new/success`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({name,credential}),
        },
        (error, response, body) => {
         // console.log('*-*-*-*-*-*-',body);
          
         // return resolve(JSON.parse(body));
          return resolve();
        }
      );
    })
}
const joinChain = ({rootnode_address, id},node) => {
  //console.log('join',node,rootnode_address,id);

  return new Promise((resolve,reject)=>{
    request(
      `http://localhost:${node}/sidechain/sync`,
      {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ rootnode_address , id})
      },
      (error, response, body) => {
        //return resolve(JSON.parse(body));
        return resolve();
      }
    )
  })
}

const getMine = (port,id) => {

  BASE_URL = `http://localhost:${port}/sidechain/active/mine?id=${id}` 
 // BASE_URL = `http://localhost:${port}/sidechain/active/mine` 
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      request(BASE_URL, (error, response, body) => {
        //return resolve(JSON.parse(body));
        return resolve();
      });
    }, 3000);
  });
};

// const postTransact = ({ code, to, value, gasLimit }) => {
//   return new Promise((resolve, reject) => {
//     request(
//       `${BASE_URL}/sidechain/transfer`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code, to, value, gasLimit }),
//       },
//       (error, response, body) => {
//         return resolve(JSON.parse(body));
//       }
//     );
//   });
// };



//Doubt in the root 

//http://localhost:3000/sidechain/active/mine?id=1


//Create two side chains, one on 3000 and 3001

// createSideChain({name:"sideChain1",credential:credential1},3000)
// .then(newSideChain =>{
//   console.log('new Side chain',newSideChain);
//   return getMine(3000,0)
// }).then(newSideChain1 => {
//   console.log('new Side chain',newSideChain1);
//   return createSideChain({name:"sideChain2",credential:credential2},3001)
// }).then(
//       mineResponse =>{
//         console.log("mineResponse",mineResponse);
//         return getMine(3001,0)
//       }).then(
//         mineResponse2 =>{
//           console.log("mineResponse2",mineResponse2);
// } )

// //code for nodes to join side chains probided nodes are live
// // 
// if(process.argv[2])
// {
//   let numberOfNodes;
//   const min=3002;
//   numberOfNodes = parseInt(process.argv[2])-1;
//   for(let node=min; node<( min+numberOfNodes); node++){
//     joinChain({rootnode_address:'http://localhost:3000',id:0},node)
//     .then(joinChain1=>{
//       console.log('JOint chain 1',joinChain1);
     
//       return getMine(node,0)
//     }).then( mineJoin1=>
//       {
//         node++;
//         console.log('mine Join 1',mineJoin1)
//         return joinChain({rootnode_address:'http://localhost:3001',id:0},node)

//     }).then(joinChain2=>{
//       console.log('JOint chain 2',joinChain2);
//      return getMine(node,0)
//     }).then( mineJoin2=>
//       {
//         console.log('mine Join 2',mineJoin2)
       
//     })
//   }
  
// }


async function create(){
  console.log("called create")

  const sideChain1 = await createSideChain({name:"sideChain1",credential:credential1},3000)
  console.log("create 1",sideChain1);
   //const mine1 = await  getMine(3000,0);
  // console.log("create mine 1",mine1);
  
  const sideChain2 = await createSideChain({name:"sideChain2",credential:credential2},3001)
  console.log("create 2",sideChain2);

   //const mine2 = await  getMine(3001,0);
  // console.log("create mine 2",mine2);
}

async function join(){
  console.log("called join")
  let numberOfNodes;
  const min=3002;
  numberOfNodes = parseInt(process.argv[2]);
  for(let node=min; node<( min+numberOfNodes); node++){
    const join1 = await joinChain({rootnode_address:'http://localhost:3000',id:0},node);
    //console.log("join 1",join1,node);
    
  const mine1 = await  getMine(3000,0);
    node++;
    const join2 = await joinChain({rootnode_address:'http://localhost:3001',id:0},node);
   // console.log("join 2",join2,node);
    
    const mine2 = await  getMine(3001,0);
  }
};

async function runfirst(){

 const created = await create();
  if(process.argv[2])
  {
    const joint =  await join();
  }
  console.log('final join',join);
  
}


runfirst();

