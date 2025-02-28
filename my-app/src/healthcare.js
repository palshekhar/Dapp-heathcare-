import {useState,useEffect} from 'react';
import {ethers} from "ethers";
import { fetchJson } from 'ethers/lib/utils';

const Healthcare=()=>{
  const [Provider,setProvider]=useState(null);
  const [Signer,setSigner]=useState(null);
    const [Contract,setcontract]=useState(null);
    const [account,setaccount]=useState(null);
    const [isowner,setowner]=useState(null);
    const [Provideraddress,setProvideraddress]=useState("");
    const [patientID,setpatientID]=useState("");
    const [patientrecord,setpatientrecord]=useState([]);
    const[treatment,settreamtment]=useState('');
    const[diagnosis,setdiagnosis]=useState('');
    



    const constractAddress="0x9f0634fcf6ef86f1fb27685a6507858339f060c5"

    const ABI=[
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "patientID",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "patientname",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "diagnosis",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "treatment",
            "type": "string"
          }
        ],
        "name": "addrecord",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "provide",
            "type": "address"
          }
        ],
        "name": "authenticateProvider",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getOwner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "patientID",
            "type": "uint256"
          }
        ],
        "name": "getrecord",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "recordID",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "patientname",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "diagnosis",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "treatment",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct healthcontract.Record[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]



   useEffect(()=>{
     const wallet=async()=>{
       try{
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", []);
        setProvider(provider)
       
        const signer = provider.getSigner()
        setSigner(signer);

        const accountaddress=await signer.getAddress();

        setaccount(accountaddress);

        const contract=new ethers.Contract(constractAddress,ABI,signer);
        setcontract(contract);

        const ownerAddress=await contract.getOwner();
        console.log("owner is ",ownerAddress);
        console.log("account address is ",accountaddress);
        
        
        setowner(ownerAddress.toLowerCase() === accountaddress.toLowerCase());
        
        
       }
       catch(error){
          console.error("wallet not working",error);
       }
         
     };

    wallet();
    console.log("hello");
    
   },[]);




   const addingData=async()=>{
     try{
        const tx=await Contract.addrecord(patientID,"shekhar",diagnosis,treatment);
        await tx.wait();
        console.log("before updating in smart contract");
        
        fetingpatientrecord();
        tx.wait();
        
        console.log("before updating in smart contract");
        alert(`Provider ${Provideraddress} authorized successfully`);

     }
     catch(error){
        console.log("error occur at addingdata",error);
        
     }
   }

   const fetingpatientrecord=async()=>{
    try{
       const record= await Contract.getrecord(patientID);
       console.log(record);
       
       setpatientrecord(record)
    }
    catch(error){
        console.error("error occur at fetching patient info")
    }
}
   const authorizeprovider=async()=>{
   if(isowner){
    try{
     const tx= await Contract.authenticateProvider(Provideraddress);
     tx.wait();
   }
   catch(error){
    console.error("Error occurred while authorizing provider", error);
    alert("Failed to authorize provider. Check console for details.");
   }
 }
 else{
    alert("only owner can authencticate the provider")
 }
}
   return(
     <div className='container'>
        <h1 className='title'>Healthcare application</h1>
        {account && <p className='account-info'>Connected account : {account}</p>}
        <p className='owner-info'>owner account: you are the owner</p>
     

       
        <div className='form-section'>
           <h2>fetching record</h2>
           <input className='input-field' type="text" placeholder='patiendID'  value={patientID}
           onChange={(e)=>setpatientID(e.target.value)}></input>
   
          <button className='action-button' onClick={fetingpatientrecord}>click here</button>
        </div>

        <div className='form-section'>
           <h2>Add patient record</h2>
           <input className='input-field' type="text" placeholder='diagnosis'  value={diagnosis}
           onChange={(e)=>setdiagnosis(e.target.value)}></input>

           <input className='input-field' type="text" placeholder='treatment'  value={treatment}
           onChange={(e)=>settreamtment(e.target.value)}></input>
   
           <button className='action-button' onClick={addingData}>click here</button>
        </div>

       <div className='form-section'>
           <h2>authorize healtcare provider</h2>
           <input className='input-field' type="text" placeholder='provider address'  value={Provideraddress}
           onChange={(e)=>setProvideraddress(e.target.value)}></input>
   
            <button className='action-button' onClick={authorizeprovider}>click here</button>
        </div>
        <div className='records-section'>
            <h2>patient record</h2>
            {patientrecord.map((record,index)=>(
              <div key = {index}>
                    <p>Record ID: {record.recordID.toNumber()}</p>
                    <p>Diagnosis: {record.diagnosis}</p>
                    <p>Treatment: {record.treatment}</p>
                    <p>Timestamp: {new Date(record.timestamp.toNumber() * 1000).toLocaleString()}</p>
            </div>
            ))}

        </div>
     </div>
   )


   

   
}


export default Healthcare;


