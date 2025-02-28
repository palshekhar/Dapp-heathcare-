import {useState,useEffect} from 'react';
import {ethers} from "ethers";

const Healthcare=()=>{
    const [Contract,setcontract]=useState(null);
    const [account,setaccount]=useState(null);
    const [isowner,setowner]=useState(null);

    const constractAddress="0x0d773751be33f11775c25d690b5cb957d022e152"

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
        
       
        const signer = provider.getSigner()
        const accountaddress=await signer.getAddress();

        setaccount(accountaddress);

        const contract=new ethers.Contract(constractAddress,ABI);
        setcontract(contract);

        const ownerAddress=await contract.getOwner();
        setowner(ownerAddress.toLowerCase() === accountaddress.toLowerCase());
        
        
       }
       catch{
          console.error("wallet not working");
       }
         
     };

    wallet();
    console.log("hello");
    
   },[]);


   

   
}


export default Healthcare;


