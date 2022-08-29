using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Numerics;
using UnityEngine.UI;
using Newtonsoft.Json;

public class ERC20CUSTOM : MonoBehaviour
{


    // set chain: ethereum, polygon, klaytn, etc
    string chain = "klaytn";
    // set network mainnet, testnet
    string network = "testnet"; 
    // wallet address that deployed the contract
    private string account = "0x7b9B65d4ee2FD57fC0DcFB3534938D31f63cba65";
    // set ABI
    private readonly string abi = "[ { \"inputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"constructor\" }, { \"anonymous\": false, \"inputs\": [ { \"indexed\": true, \"internalType\": \"address\", \"name\": \"owner\", \"type\": \"address\" }, { \"indexed\": true, \"internalType\": \"address\", \"name\": \"spender\", \"type\": \"address\" }, { \"indexed\": false, \"internalType\": \"uint256\", \"name\": \"value\", \"type\": \"uint256\" } ], \"name\": \"Approval\", \"type\": \"event\" }, { \"anonymous\": false, \"inputs\": [ { \"indexed\": true, \"internalType\": \"address\", \"name\": \"previousOwner\", \"type\": \"address\" }, { \"indexed\": true, \"internalType\": \"address\", \"name\": \"newOwner\", \"type\": \"address\" } ], \"name\": \"OwnershipTransferred\", \"type\": \"event\" }, { \"anonymous\": false, \"inputs\": [ { \"indexed\": true, \"internalType\": \"address\", \"name\": \"from\", \"type\": \"address\" }, { \"indexed\": true, \"internalType\": \"address\", \"name\": \"to\", \"type\": \"address\" }, { \"indexed\": false, \"internalType\": \"uint256\", \"name\": \"value\", \"type\": \"uint256\" } ], \"name\": \"Transfer\", \"type\": \"event\" }, { \"inputs\": [ { \"internalType\": \"address\", \"name\": \"owner\", \"type\": \"address\" }, { \"internalType\": \"address\", \"name\": \"spender\", \"type\": \"address\" } ], \"name\": \"allowance\", \"outputs\": [ { \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" } ], \"stateMutability\": \"view\", \"type\": \"function\" }, { \"inputs\": [ { \"internalType\": \"address\", \"name\": \"spender\", \"type\": \"address\" }, { \"internalType\": \"uint256\", \"name\": \"amount\", \"type\": \"uint256\" } ], \"name\": \"approve\", \"outputs\": [ { \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" } ], \"stateMutability\": \"nonpayable\", \"type\": \"function\" }, { \"inputs\": [ { \"internalType\": \"address\", \"name\": \"account\", \"type\": \"address\" } ], \"name\": \"balanceOf\", \"outputs\": [ { \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" } ], \"stateMutability\": \"view\", \"type\": \"function\" }, { \"inputs\": [], \"name\": \"decimals\", \"outputs\": [ { \"internalType\": \"uint8\", \"name\": \"\", \"type\": \"uint8\" } ], \"stateMutability\": \"view\", \"type\": \"function\" }, { \"inputs\": [ { \"internalType\": \"address\", \"name\": \"spender\", \"type\": \"address\" }, { \"internalType\": \"uint256\", \"name\": \"subtractedValue\", \"type\": \"uint256\" } ], \"name\": \"decreaseAllowance\", \"outputs\": [ { \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" } ], \"stateMutability\": \"nonpayable\", \"type\": \"function\" }, { \"inputs\": [ { \"internalType\": \"address\", \"name\": \"spender\", \"type\": \"address\" }, { \"internalType\": \"uint256\", \"name\": \"addedValue\", \"type\": \"uint256\" } ], \"name\": \"increaseAllowance\", \"outputs\": [ { \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" } ], \"stateMutability\": \"nonpayable\", \"type\": \"function\" }, { \"inputs\": [ { \"internalType\": \"address\", \"name\": \"account\", \"type\": \"address\" }, { \"internalType\": \"uint256\", \"name\": \"amount\", \"type\": \"uint256\" } ], \"name\": \"mintToken\", \"outputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"function\" }, { \"inputs\": [], \"name\": \"name\", \"outputs\": [ { \"internalType\": \"string\", \"name\": \"\", \"type\": \"string\" } ], \"stateMutability\": \"view\", \"type\": \"function\" }, { \"inputs\": [], \"name\": \"owner\", \"outputs\": [ { \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" } ], \"stateMutability\": \"view\", \"type\": \"function\" }, { \"inputs\": [], \"name\": \"renounceOwnership\", \"outputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"function\" }, { \"inputs\": [ { \"internalType\": \"address\", \"name\": \"recipient\", \"type\": \"address\" }, { \"internalType\": \"uint256\", \"name\": \"amount\", \"type\": \"uint256\" } ], \"name\": \"safeTransfer\", \"outputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"function\" }, { \"inputs\": [ { \"internalType\": \"address\", \"name\": \"recipient\", \"type\": \"address\" }, { \"internalType\": \"uint256\", \"name\": \"amount\", \"type\": \"uint256\" }, { \"internalType\": \"bytes\", \"name\": \"_data\", \"type\": \"bytes\" } ], \"name\": \"safeTransfer\", \"outputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"function\" }, { \"inputs\": [ { \"internalType\": \"address\", \"name\": \"sender\", \"type\": \"address\" }, { \"internalType\": \"address\", \"name\": \"recipient\", \"type\": \"address\" }, { \"internalType\": \"uint256\", \"name\": \"amount\", \"type\": \"uint256\" } ], \"name\": \"safeTransferFrom\", \"outputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"function\" }, { \"inputs\": [ { \"internalType\": \"address\", \"name\": \"sender\", \"type\": \"address\" }, { \"internalType\": \"address\", \"name\": \"recipient\", \"type\": \"address\" }, { \"internalType\": \"uint256\", \"name\": \"amount\", \"type\": \"uint256\" }, { \"internalType\": \"bytes\", \"name\": \"_data\", \"type\": \"bytes\" } ], \"name\": \"safeTransferFrom\", \"outputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"function\" }, { \"inputs\": [ { \"internalType\": \"bytes4\", \"name\": \"interfaceId\", \"type\": \"bytes4\" } ], \"name\": \"supportsInterface\", \"outputs\": [ { \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" } ], \"stateMutability\": \"view\", \"type\": \"function\" }, { \"inputs\": [], \"name\": \"symbol\", \"outputs\": [ { \"internalType\": \"string\", \"name\": \"\", \"type\": \"string\" } ], \"stateMutability\": \"view\", \"type\": \"function\" }, { \"inputs\": [], \"name\": \"totalSupply\", \"outputs\": [ { \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" } ], \"stateMutability\": \"view\", \"type\": \"function\" }, { \"inputs\": [ { \"internalType\": \"address\", \"name\": \"to\", \"type\": \"address\" }, { \"internalType\": \"uint256\", \"name\": \"amount\", \"type\": \"uint256\" } ], \"name\": \"transfer\", \"outputs\": [ { \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" } ], \"stateMutability\": \"nonpayable\", \"type\": \"function\" }, { \"inputs\": [ { \"internalType\": \"address\", \"name\": \"from\", \"type\": \"address\" }, { \"internalType\": \"address\", \"name\": \"to\", \"type\": \"address\" }, { \"internalType\": \"uint256\", \"name\": \"amount\", \"type\": \"uint256\" } ], \"name\": \"transferFrom\", \"outputs\": [ { \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" } ], \"stateMutability\": \"nonpayable\", \"type\": \"function\" }, { \"inputs\": [ { \"internalType\": \"address\", \"name\": \"newOwner\", \"type\": \"address\" } ], \"name\": \"transferOwnership\", \"outputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"function\" } ]";
    // set rpc endpoint url
    string rpc = "https://public-node-api.klaytnapi.com/v1/baobab";

    // set contract address
    private string contract = "0xAc88Ee877D1dCf6da3672099FE4618c9d30F0d0B";
    // set recipient address
    private string toAccount = "0x7AB1b3C8396aDE55F959fB9B2dA43deFDdA23c52";
    // set amount to transfer
    private string amount = "10000";

    // Use this if you want to display the balance of an account
    // call the "name" function
    async public void Name()
    {
        // function name
        string method = "name";
        // arguments
        string args = "[]";
        try
        {
            string response = await EVM.Call(chain, network, contract, abi, method, args,rpc);            
            Debug.Log("Token name: " + response);
        } catch(Exception e) 
        {
            Debug.LogException(e, this);
        }
    }

    // call the "totalSupply" function
    async public void TotalSupply()
    {
        // function name
        string method = "totalSupply";
        // arguments
        string args = "[]";
        try
        {
            string response = await EVM.Call(chain, network, contract, abi, method, args,rpc);            
            Debug.Log("Total Supply: " + response);
        } catch(Exception e) 
        {
            Debug.LogException(e, this);
        }
    }

    // call the "balanceOf" function
    async public void BalanceOf()
    {
        // function name
        string method = "balanceOf";
        // arguments
        string args = "[\"0x7b9B65d4ee2FD57fC0DcFB3534938D31f63cba65\"]";
        try
        {
            string response = await EVM.Call(chain, network, contract, abi, method, args,rpc);            
            Debug.Log("Balance of 0x7b9B65d4ee2FD57fC0DcFB3534938D31f63cba65: " + response);
        } catch(Exception e) 
        {
            Debug.LogException(e, this);
        }
    }

    // call the "transfer" function
    async public void Transfer()
    {
        // function name
        string method = "transfer";
        // put arguments in an array of string
        string[] obj = {toAccount, amount};
        // serialize arguments
        string args = JsonConvert.SerializeObject(obj);
        // value in ston (wei) in a transaction
        string value = "0";
        // gas limit: REQUIRED
        string gasLimit = "1000000";
        // gas price: REQUIRED
        string gasPrice = "250000000000";
        try
        {          
            string response = await Web3GL.SendContract(method, abi, contract, args, value, gasLimit, gasPrice);            
            Debug.Log(response);
        } catch(Exception e) 
        {
            Debug.LogException(e, this);
        }
    }

      // call the "safeTransfer" function
      async public void SafeTransfer()
    {
        string method = "safeTransfer";
        string[] obj = {toAccount, amount};
        string args = JsonConvert.SerializeObject(obj);
        string value = "0";
        // gas limit OPTIONAL
        string gasLimit = "1000000";
        // gas price OPTIONAL
        string gasPrice = "250000000000";
        try
        {
        //string response = await Web3GL.SendContract(chain, network, contract, abi, method, args,rpc);            
            string response = await Web3GL.SendContract(method, abi, contract, args, value, gasLimit, gasPrice);            
            Debug.Log(response);
        } catch(Exception e) 
        {
            Debug.LogException(e, this);
        }
    }

    // call the "mintToken" function
    async public void Mint()
    {
        // recipient
        string toAccount = "0x57468012dF29B5f1C4b5baCD1CD2F0e2eC323316";
        // amount to send
        string amount = "100";
        // function name
        string method = "mintToken";
        // put arguments in an array of string
        string[] obj = {toAccount, amount};
        // serialize arguments
        string args = JsonConvert.SerializeObject(obj);
        // value in ston (wei) in a transaction
        string value = "0";
        // gas limit: REQUIRED
        string gasLimit = "1000000";
        // gas price: REQUIRED
        string gasPrice = "250000000000";
        try
        {            
            string response = await Web3GL.SendContract(method, abi, contract, args, value, gasLimit, gasPrice);           
            Debug.Log(response);
        } catch(Exception e) 
        {
            Debug.LogException(e, this);
        }
    }

    // call the "approve" function
    async public void Approve()
    {
        // spender
        string spender = "0x57468012dF29B5f1C4b5baCD1CD2F0e2eC323316";
       // amount
        string amount = "100";
       // function name
        string method = "approve";
       // put arguments in an array of string
        string[] obj = {spender, amount};
       // serialize arguments
        string args = JsonConvert.SerializeObject(obj);
        string value = "0";
       // gas limit OPTIONAL
        string gasLimit = "1000000";
       // gas price OPTIONAL
        string gasPrice = "250000000000";
        try
        {            
            string response = await Web3GL.SendContract(method, abi, contract, args, value, gasLimit, gasPrice);           
            Debug.Log(response);
        } catch(Exception e) 
        {
            Debug.LogException(e, this);
        }
    }
}