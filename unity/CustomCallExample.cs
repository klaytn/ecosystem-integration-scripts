using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CustomCallExample : MonoBehaviour
{
    async void Start()
    {
        // set chain: ethereum, polygon, klaytn, etc
        string chain = "klaytn";
        // set network mainnet, testnet
        string network = "mainnet"; 
        // set smart contract address
        string account = "0x94404aEc273e50f741c0e166CC55a372D5c6Df7C";
        // set rpc endpoint url
        string rpc = "https://public-node-api.klaytnapi.com/v1/cypress";
        
        // call a transaction
        string balance = await EVM.BalanceOf(chain, network, account, rpc);
        // display response in game
        print(balance);      
       
    }
}