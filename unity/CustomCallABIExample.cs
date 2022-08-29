using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class CustomCallABIExample : MonoBehaviour
{

    // set chain: ethereum, polygon, klaytn, etc
    string chain = "klaytn";
    // set network mainnet, testnet
    string network = "testnet"; 
    // set contract address
    private string contract = "0xDf5A1aAa8C1E6a7b4e42dA606Ed8e43BeF764D13";
    // set contract ABI
    private readonly string abi = "[{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"num\",\"type\":\"uint256\"}],\"name\":\"store\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\",\"signature\":\"0x6057361d\"},{\"inputs\":[],\"name\":\"retrieve\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0x2e64cec1\"}]";
    // set RPC endpoint url
    string rpc = "https://public-node-api.klaytnapi.com/v1/baobab";

    // Call the "store" function with "10" as argument
    async public void AddValue()
    {
        // contract function 
        string method = "store";
        // argument
        string args = "[\"10\"]";
        // value in ston (wei) in a transaction
        string value = "0";
        // gas limit (OPTIONAL)
        string gasLimit = "";
        // gas price (OPTIONAL)
        string gasPrice = "";

        try 
        {
            string response = await Web3GL.SendContract(method, abi, contract, args, value, gasLimit, gasPrice);
            Debug.Log(response);
        } catch(Exception e) 
        {
            Debug.LogException(e, this);
        }
    }

    // Call the retrieve function
    async public void GetValue()
    {
        // contract function
        string method = "retrieve";
        // arguments
        string args = "[]";
        try
        {
            string response = await EVM.Call(chain, network, contract, abi, method, args, rpc);
            Debug.Log(response);
        } catch(Exception e) 
        {
            Debug.LogException(e, this);
        }
    }
}
