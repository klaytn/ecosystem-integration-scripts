![Klaytn x ChainSafe](https://user-images.githubusercontent.com/105277604/191377285-41108f9b-f90e-452d-9611-4407a434e5eb.png)
# Unity SDK Integration

## Overview
The ChainSafe Unity SDK provides toolkit for Game Developers to interact with blockchains. It will give you the proper tools to connect to the network, send and sign transactions, interact with smart contracts, fetch balances (coins, NFTs, tokens) and more.

You can get the official documentation of the ChainSafe SDK here: https://docs.gaming.chainsafe.io/ 

#### Key features

1. [Installation](#installation)
2. [Before you start](#before-you-start)
3. [Create a new Unity project](#create-a-new-unity-project)
4. [Custom Call on Ethereum (Ropsten)](#custom-call-on-ethereum-ropsten)
5. [Custom Call](#custom-call)
6. [Custom Interaction with Login](#custom-interaction-with-login)
7. [How to use the KIP7 token](#how-to-use-the-kip7-token)
8. [Deploy KIP17 token](#how-to-use-the-kip17-token)
9. [Deploy KIP37 token](#how-to-use-the-kip37-token)

## Installation

#### Developer Environment

[VS Code](https://code.visualstudio.com/Download) 
[Metamask](https://metamask.io/download/) 
[Unity Hub and Unity](https://www.educademy.co.uk/how-to-install-unityhub-unity-and-visual-studio-on-windows) 


#### ChainSafe SDK
- Go to the ChainSafe Gaming SDK from their GitHub repository called **web3.unity** at https://github.com/chainsafe 

![image](https://user-images.githubusercontent.com/105277604/191378458-51831d3b-44e3-4742-a050-88e002a392ab.png)

- Select the latest release 
- Click on **web3.unitypackage** to download the package

![image](https://user-images.githubusercontent.com/105277604/191378522-b1064824-481b-4549-a76b-9939ed6fd519.png)


#### Unity Hub
- Go to https://unity3d.com/fr/get-unity/download
- Choose the version : **2020.3.x**

### Activate your license
- create a new Unity account
- click on **Activate New License**
- select **Unity Personal**
- select **I don't use Unity in a professional capacity**

![image](https://user-images.githubusercontent.com/105277604/191378571-828c5204-c828-4488-8128-2cc529eddcf9.png)
![image](https://user-images.githubusercontent.com/105277604/191378583-4b87b233-7674-408e-b6cf-e2e6ca495d02.png)


## Before you start
To get started, here are some details you should consider while reading the documentation. 

#### Klaytn Gas Fee
Klaytn has a fixed gas fee, so make sure to do the following steps to setting up your Metamask:

- Click on **Turn on Enhanced Gas Fee UI** in Settings to set gas fee
- Set the **Enable Enhanced Gas Fee UI** toggle to **ON** and exit Settings.

Click [here](https://docs.klaytn.foundation/dapp/tutorials/connecting-metamask#send-klay) for more details.

#### Klaytn RPC URL and Chain ID
*Klaytn mainnet*:
RPC URL = https://public-node-api.klaytnapi.com/v1/cypress
Chain ID = **8217**

*Klaytn testnet*:
RPC URL = https://api.baobab.klaytn.net:8651/
Chain ID = **1001**

ABI formatting
The ABI has a special formatting. Replace the ```"``` with ```\"``` , otherwise it will not be recognise by the SDK.

Example:
>string abi = "[ { \"inputs\": [ { \"internalType\": \"uint8\", \"name\": \"_myArg\", \"type\": \"uint8\" } ], \"name\": \"addTotal\", \"outputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"function\" }, { \"inputs\": [], \"name\": \"myTotal\", \"outputs\": [ { \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" } ], \"stateMutability\": \"view\", \"type\": \"function\" } ]";

#### Solving *System.ComponentModel.Win32Exception Error*
You may encounter this error: *System.ComponentModel.Win32Exception (2): No such file or directory while building the project if you are using macOS.*
If it's the case, follow these steps:

- install ```python 2.7```
- activate it in your project environment by running ```pyenv global 2.7.18``` (to make it the default version everywhere) or ```pyenv local 2.7.18``` (to make only the current directory use this version)
- create a folder called Editor under Assets under Project window. Inside **Editor**, create a C# file called **PreBuildProcessing** and use the code bellow
- restart and build your project

Please refer to this link for more details: https://forum.unity.com/threads/case-1412113-builderror-osx-12-3-and-unity-2020-3-constant-build-errors.1255419/

```C#
 using UnityEditor;
 using UnityEditor.Build;
 using UnityEditor.Build.Reporting;
 using UnityEngine;
 
 public class PreBuildProcessing : IPreprocessBuildWithReport
 {
     public int callbackOrder => 1;
     public void OnPreprocessBuild(BuildReport report)
     {
         System.Environment.SetEnvironmentVariable("EMSDK_PYTHON", "/Library/Frameworks/Python.framework/Versions/2.7/bin/python");
     }
 }
```

#### Solving the Newtonsoft Error
Install [JSON.NET](https://assetstore.unity.com/packages/tools/input-management/json-net-for-unity-11347)  to fix: *The type or namespace name 'Newtonsoft' could not be found* error.

After downloading the package you will need to import it into your project.

The steps for importing this package are as follows: 

<p>Window -> Package Manager -> My Assets -> JSON.NET For Unity -> Import <p>
 ![image](https://user-images.githubusercontent.com/105277604/191378677-ae9bff07-833d-42b4-bd63-9379c9517b02.png)


---

## Create a new Unity Project
The SDK / Unity plugin supports all Unity project types. In this example, we will create an empty 3D project.

To create a new project, open **Unity Hub**, select **All templates**, we will use a 3D template, then click on **Create project**.
 
![image](https://user-images.githubusercontent.com/105277604/191378718-091865ae-3e01-4d83-afca-9a59d0ce995f.png)


- Now, you have created a new project. Then we need to import the SDK into our project

- Drag the downloaded web3.unitypackage file in the Installation section into the Unity project
 
![image](https://user-images.githubusercontent.com/105277604/191378742-fbe55f53-6200-45a9-8e9a-72f64dc510b3.png)


- Depending on the version of Unity you are using, you might see the error in the screen below. If it’s the case, please refer to the [Solving the Newtonsoft Error](#solving-the-newtonsoft-error) section to solve it.
 
![image](https://user-images.githubusercontent.com/105277604/191378761-1242d767-1a82-432c-a180-83cf5ea3a483.png)


---

## Custom Call on Ethereum (Ropsten)

In Unity we can use a Prefab, a pre-configured reusable GameObjects. A Prefab is like a template where we can use all its components, and property values. In this section you will see how to use a Prefab to execute a custom call on Ropsten.

Start by creating a new project by following the steps at the section [Create a new Unity project](#create-a-new-unity-project).

Make sure to install all dependencies to fix all bugs.

#### Create your contract

- Open [Remix IDE](https://remix.ethereum.org/#optimize=false&runs=200&evmVersion=null), then paste the code below:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AddTotal {
    uint256 public myTotal = 0;

    function addTotal(uint8 _myArg) public {
        myTotal = myTotal + _myArg;
    }
}
```

- Compile your contract
- Deploy it on Ropsten using Remix
- Run the addTotal function and add a number in the parameter (e.g 10).

#### Create your C# script on Unity
- Click on **Web3Unity** package → **Prefabs** → **EVM** → **Custom Call**
- Drag the **CustomCall** prefab into the scene
 
![image](https://user-images.githubusercontent.com/105277604/191378851-68c19fd9-39b0-45a1-895b-f16ff1dd8363.png)

- Double-click on the **CustomCallExample** script to open it on VSCode

![image](https://user-images.githubusercontent.com/105277604/191379048-b06dd23e-08fc-4b4d-9197-bfa8865b99c1.png)

- Complete the script below with the ABI of your contract

```C#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CustomCallExample : MonoBehaviour
{
    async void Start()
    {
        /*
        // SPDX-License-Identifier: MIT
        pragma solidity ^0.8.0;

        contract AddTotal {
            uint256 public myTotal = 0;

            function addTotal(uint8 _myArg) public {
                myTotal = myTotal + _myArg;
            }
        }
        */
        // set chain: ethereum, moonbeam, polygon etc
        string chain = "ethereum";
        // set network mainnet, testnet
        string network = "ropsten";
        // smart contract method to call
        string method = "myTotal";
        // abi in json format
        string abi = "[ { \"inputs\": [ { \"internalType\": \"uint8\", \"name\": \"_myArg\", \"type\": \"uint8\" } ], \"name\": \"addTotal\", \"outputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"function\" }, { \"inputs\": [], \"name\": \"myTotal\", \"outputs\": [ { \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" } ], \"stateMutability\": \"view\", \"type\": \"function\" } ]";
        // address of contract
        string contract = "0xBd71D128642D28126b04D17ca08657041C7EEB72";
        // array of arguments for contract
        string args = "[]";
        // connects to user's browser wallet to call a transaction
        string response = await EVM.Call(chain, network, contract, abi, method, args);
        // display response in game
        print(response);
    }
}

```

- Run the script by clicking on the :arrow_forward: button above the scene

- Open the console to see the result. The console will display the number you retrieve from the contract.

![image](https://user-images.githubusercontent.com/105277604/191379100-3a03440a-82b5-4f5c-b2aa-5971827bbf95.png)


---

## Custom Call

In this section you will see how to get the balance of a given address on Klaytn mainnet, using a RPC provider.

Start by creating a new project by following the steps at the section [Create a new Unity project](#create-a-new-unity-project).

Make sure to install all dependencies to fix all bugs.


#### Create your C# script on Unity

- Click on **Web3Unity** package → **Prefabs** → **EVM** → **Custom Call**

- Drag the **CustomCall** prefab into the scene.
 
![image](https://user-images.githubusercontent.com/105277604/191379157-feb77136-358f-4180-8386-7b61225c214f.png)


- Double-click on the **CustomCallExample** script to open it on VSCode
 
![image](https://user-images.githubusercontent.com/105277604/191379172-bbc65d69-fbe1-40b3-9219-7f89f2732fdd.png)


- Use the script below or modify it

```C#
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
```
- Edit the network chainID under **Assets** → **WebGLTemplates** → **Web3GL-2020x** → **network.js**.
Set the window.web3ChainId to **8217** (Klaytn mainnet)

- Run the script by clicking on the :arrow_forward: button above the scene

- Open the console to see the result

- The console shows the balance of the given contract on Klaytn mainnet.
 
![image](https://user-images.githubusercontent.com/105277604/191379194-9bb9a2a4-5c95-4443-9350-7f24b6e1b95a.png)


---

## Custom Interaction with Login

In this section you will see how to build a Unity project with a login button to connect a web3 wallet and two other buttons to write and read the contract.

Start by creating a new project by following the steps at the section [Create a new Unity project](#create-a-new-unity-project).

Make sure to install all dependencies to fix all bugs.

#### Use the WebLogin prefab to enable web3 wallet connection

Under **Assets** → **Web3Unity** → **Scenes**, double-click on **WebLogin**. This is the prefab used to connect a wallet in a WebGL project.
 
![image](https://user-images.githubusercontent.com/105277604/191379289-d3ee8fb5-d871-43ef-8477-11ccb9e0c9ac.png)

- Go to **File** → **Build Settings** → **WebG**L → **Switch Platform**
 
![image](https://user-images.githubusercontent.com/105277604/191379314-314636b9-c730-45a2-80cf-6108235b8586.png)


- From the same window, click on **Add Open Scenes** (top right) to add the Login scene as the first scene to appear when we run the project.

- From the same window, click on **Player Settings** → **Player** → **Resolution and Presentation**, under **WebGL Template**, select the one with the same as our Unity version (WebGL 2020 for our case).
 
![image](https://user-images.githubusercontent.com/105277604/191379335-b8082420-fc3e-46ac-aa97-29096e25cb60.png)

- Go back to the Unity project. Under **Assets**, select **Scenes** and double-click on **SampleScene** to use it as our second scene (FYI the first one is the login scene)

- Go to **File** → **Build Settings** → **Add Open Scenes**. The SampleScene will appear under the WebLogin scene. It means the SampleScene, where we will create the buttons to read and write to the contract, will be the next scene after the WebLogin.
:warning: Make sure the WebLogin scene is at the top because the order matters.
 
![image](https://user-images.githubusercontent.com/105277604/191379361-9ae0d72d-8888-49e9-85f3-477a6adad202.png)


#### Create your contract
- Open Remix IDE, install the Klaytn Remix plugin then paste the code below:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage { 

    uint256 number;

    function store(uint256 num) public {
        number = num;
    }

    function retrieve() public view returns (uint256) {
        return number;
    }
}
```
- Compile your contract and deploy it to baobab testnet (get your faucet [here](https://baobab.wallet.klaytn.foundation/faucet)).

#### Create your C# script on Unity
- Under **Project** window, right-click on **Scenes**, click on **Create** → **C# Script**
 
![image](https://user-images.githubusercontent.com/105277604/191379397-733eecd1-c329-44ea-8b9f-23fc3a37e715.png)

- Rename it (here we’ll use the name “CallABI”)
 
![image](https://user-images.githubusercontent.com/105277604/191379430-b8c49086-2c6d-4a25-8535-34924379582a.png)

- Double-click on the script to open it. Complete the script with the information below 

```C++
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class CustomCallABIExample : MonoBehaviour
{

    // set chain
    string chain = "klaytn";
    // set network
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

```

#### Create the buttons
- Right-click on the scene, click on UI → Button and rename it to AddValue and RetrieveValue
 
![image](https://user-images.githubusercontent.com/105277604/191379461-0bf06078-cf18-491f-ab6f-a64175f669c5.png)

To interact with the buttons:

1. Click on **AddValue** button from the Hierarchy window

2. Drag the CallABI script into the right window

3. Add an **On Click()** function by clicking on the :heavy_plus_sign: button
 
![image](https://user-images.githubusercontent.com/105277604/191379499-d45aba81-8acf-4025-a3b4-669ecd9caabf.png)

4. Drag the **AddValue** button from Hierarchy window into the On Click() function

5. Click on **No Function** → **CallABI** → **AddValue()**
 
![image](https://user-images.githubusercontent.com/105277604/191379515-10051c34-35f0-4468-be24-30a1b92a97bf.png)

- For the RetrieveValue button, redo the steps from step 1 to step 5 above, but instead of selecting AddValue, select **RetrieveValue**

Edit the network chainID under **Assets** → **WebGLTemplates** → **Web3GL-2020x** → **network.js**.
Set the ```window.web3ChainId``` to ```1001```.
 
![image](https://user-images.githubusercontent.com/105277604/191379560-97ad1a8c-e7c1-4740-aeb6-5caa5a5ba736.png)

To test the **Retrieve Value** function, click on play :arrow_forward: and click on Retrieve Value
 
![image](https://user-images.githubusercontent.com/105277604/191379579-1b46a094-521d-4246-9e06-fa7162d5f2fe.png)

- To test the Add Value function , click **File** → **Build and Run**. You will have a new window in the browser that will show you the login interface
 
![image](https://user-images.githubusercontent.com/105277604/191379595-34c8600e-1aa2-4589-9ae8-894a3c32d942.png)

- Click on **Login** to connect to Metamask

- Click on **Add Value** to add the value of 10 to the contract

- Confirm your transaction on Metamask and voilà ! Your transaction is sent to the network.
 
![image](https://user-images.githubusercontent.com/105277604/191379628-9a56762c-292a-44f6-9386-d423edb25a38.png)

---

## How to use the KIP7 token

In this section you will see how to build a Unity project using the KIP7 (ERC-20) token standard on Klaytn.

Start by creating a new project by following the steps at the section [Create a new Unity project](#create-a-new-unity-project). 

Make sure to install all dependencies to fix all bugs.

#### Use the WebLogin prefab to enable web3 wallet connection
- Under **Assets** → **Web3Unity** → **Scenes**, double-click on **WebLogin**. This is the prefab used to connect a wallet in a WebGL project
 
![image](https://user-images.githubusercontent.com/105277604/191379663-1dd13fff-2edd-4b69-a1d3-d6784df92418.png)

- Go to **File** → **Build Settings** → **WebGL** → **Switch Platform**
 
![image](https://user-images.githubusercontent.com/105277604/191379685-b33a8eed-a596-4284-a027-8eb0c628b97c.png)

- From the same window, click on **Add Open Scenes** (top right) to add the Login scene as the first scene to appear when we run the project.

- From the same window, click on **Player Settings** → **Player** → **Resolution and Presentation**, under **WebGL Template**, select the one with the same as our Unity version (WebGL 2020 for our case).
 
![image](https://user-images.githubusercontent.com/105277604/191379708-543ca706-e546-4ec5-b62c-de1f05622150.png)

- Go back to the Unity project. Under Assets, select Scenes and double-click on SampleScene to use it as our second scene (FYI the first one is the login scene)

- Go to **File** → **Build Settings** → **Add Open Scenes**. The SampleScene will appear under the WebLogin scene. It means the SampleScene, where we will create the buttons to read and write to the contract, will be the next scene after the WebLogin.
:warning: Make sure the WebLogin scene is at the top because the order matters.

#### Create your contract
- Open Remix IDE, install the Klaytn Remix plugin then paste the code below:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@klaytn/contracts/KIP/token/KIP7/KIP7.sol";
import "@klaytn/contracts/access/Ownable.sol";

contract MyToken is KIP7, Ownable {
    constructor() KIP7("Test Token", "TST") {     
        _mint(msg.sender, 100000 * 10 ** 18);        
    }

     function mintToken(address account, uint256 amount) public onlyOwner {
        _safeMint(account, amount);
    }
}
```
- Compile your contract and deploy it to baobab testnet. Get your faucet [here](https://baobab.wallet.klaytn.foundation/faucet).

#### Create your C# script on Unity
- Under **Project** window, right-click on **Scenes**, click on **Create** → **C# Script**. Use the script below.

```C++
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
    /*public Text balance;

    
     void Start() 
     {
         string account = PlayerPrefs.GetString("Account");
         balance.text = account;
    }
    */

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
```

- We will create 7 buttons ( *Name*, *Total Supply*, *BalanceOf*, *Transfer*, *SafeTransfer*, *Mint* and *Approve*) on the UI to interact with our KIP7 token. 
- To create the buttons, follow the steps in the section [Custom Interaction with Login](#custom-interaction-with-login).

- Your UI should look like this:
 
![image](https://user-images.githubusercontent.com/105277604/191379734-d3480fcf-62d0-4c5f-8bf1-1ffe873102be.png)

- Link each button the the corresponding function in the contract. E.g here, we linked the button “Name” to the function “Name()” in the script, which calls the function “name()” in the contract
 
 ![image](https://user-images.githubusercontent.com/105277604/191379749-7ea48fa4-a92b-4ad4-a062-6cc5566d12f1.png)

- Change the chainId of the network in the WebGL Templates folder to ```1001``` to connect to baobab testnet
 
![image](https://user-images.githubusercontent.com/105277604/191379771-b92c2cc9-1923-495d-8edb-84e1e2831a19.png)

- Click on :arrow_forward: to run the program and test the Name, Total Supply and BalanceOf buttons
 
![image](https://user-images.githubusercontent.com/105277604/191379785-4f323e77-af78-48fc-8887-e129cb3eb115.png)

#### Test the Transfer and the Mint function
- To test the **Transfer**, we need to build and run the project. So go to **File** → **Build and Run**

- Click on Login to connect Metamask
 
![image](https://user-images.githubusercontent.com/105277604/191379812-8b478955-2169-4fce-8d2b-48e395087784.png)

- Once connected, click on Transfer to execute the KIP7 token transfer
 
![image](https://user-images.githubusercontent.com/105277604/191379833-0a304c00-c6c2-42d9-bd37-777dc051d305.png)

Here are the details of the transaction on [Klaytnscope](https://baobab.scope.klaytn.com/tx/0x1b9c6c4a21fa2bfd5e304c647908e26e0f0c4d5fed8d727bce1d586cca2afab1?tabId=eventLog)

- To test the **Mint** and **SafeTransfer** function, click on the corresponding button and confirm your transaction. Here’s the detail of a confirmed transaction on Klaytnscope.

---

## How to use the KIP17 token

In this section you will see how to build a Unity project using the KIP17 (ERC-721) token standard on Klaytn.

Start by creating a new project by following the steps at the section [Create a new Unity project](#create-a-new-unity-project).

Make sure to install all dependencies to fix all bugs.

#### Use the WebLogin prefab to enable web3 wallet connection
- Under **Assets** → **Web3Unity** → **Scenes**, double-click on **WebLogin**. This is the prefab used to connect a wallet in a WebGL project
 
![image](https://user-images.githubusercontent.com/105277604/191379875-e7e18524-dab1-4946-bca8-74b4baa355b9.png)

- Go to **File** → **Build Settings** → **WebGL** → **Switch Platform**
 
![image](https://user-images.githubusercontent.com/105277604/191379892-41cfc013-a399-4d27-a968-92f518986c98.png)

- From the same window, click on **Add Open Scenes** (top right) to add the Login scene as the first scene to appear when we run the project.

- From the same window, click on **Player Settings** → **Player** → **Resolution and Presentation**, under **WebGL Template**, select the one with the same as our Unity version (WebGL 2020 for our case).
 
![image](https://user-images.githubusercontent.com/105277604/191379914-5df677fc-dc1a-4246-9242-bb31d8664c18.png)

- Go back to the Unity project. Under Assets, select Scenes and double-click on SampleScene to use it as our second scene (FYI the first one is the login scene)

- Go to **File** → **Build Settings** → **Add Open Scenes**. The SampleScene will appear under the WebLogin scene. It means the SampleScene, where we will create the buttons to read and write to the contract, will be the next scene after the WebLogin.
:warning: Make sure the WebLogin scene is at the top because the order matters.

#### Create your contract
Open [Remix IDE](https://remix.ethereum.org/#optimize=false&runs=200&evmVersion=null), install the [Klaytn Remix plugin](https://klaytn.foundation/using-klaytn-plugin-on-remix/) then paste the code below:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@klaytn/contracts/KIP/token/KIP17/KIP17.sol";
import "@klaytn/contracts/KIP/token/KIP17/extensions/KIP17Enumerable.sol";
//import "@klaytn/contracts/access/Ownable.sol;
import "@klaytn/contracts/utils/Counters.sol";

contract HappyMonkey is KIP17, KIP17Enumerable {

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint256 public MINT_PRICE = 0.05 ether;
    uint public MAX_SUPPLY = 100;

    constructor() KIP17("HappyMonkey", "HM") {
        // Start token ID at 1. By default is starts at 0.
        _tokenIdCounter.increment();
    }

    function withdraw() public {
        require(address(this).balance > 0, "Balance is zero");
        payable(msg.sender).transfer(address(this).balance);
    }

    function safeMint(address to) public payable {
        require(totalSupply() < MAX_SUPPLY, "Can't mint anymore tokens.");

        require(msg.value >= MINT_PRICE, "Not enough ether sent.");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://happyMonkeyBaseURI/";
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(KIP17, KIP17Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(KIP17, KIP17Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```
> Find the ERC721 source code [here](https://github.com/davidrazmadzeExtra/ERC721_NFT/blob/main/HappyMonkey.sol).

Compile your contract and deploy it to baobab testnet faucet [here](https://baobab.wallet.klaytn.foundation/faucet).

#### Create your C# script on Unity
Under **Project** window, right-click on **Scenes**, click on **Create** → **C# Script**

```C++
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Numerics;
using UnityEngine.UI;
using Newtonsoft.Json;

public class KIP17Example : MonoBehaviour
{
    // set chain: ethereum, polygon, klaytn, etc
    string chain = "klaytn";
    // set network mainnet, testnet
    string network = "testnet";
    // set contract address
    private string contract = "0x1625026Eb24A40728dC3c574d10Cf08ee38cBC9A";
    // set contract ABI
    private readonly string abi = "[{\"inputs\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"symbol\",\"type\":\"string\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\",\"signature\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"approved\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\",\"signature\":\"0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"ApprovalForAll\",\"type\":\"event\",\"signature\":\"0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\",\"signature\":\"0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\",\"signature\":\"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\",\"signature\":\"0x095ea7b3\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0x70a08231\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"getApproved\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0x081812fc\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"isApprovedForAll\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0xe985e9c5\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0x06fdde03\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0x8da5cb5b\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"ownerOf\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0x6352211e\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\",\"signature\":\"0x715018a6\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\",\"signature\":\"0x42842e0e\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"_data\",\"type\":\"bytes\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\",\"signature\":\"0xb88d4fde\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"setApprovalForAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\",\"signature\":\"0xa22cb465\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0x01ffc9a7\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0x95d89b41\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"tokenURI\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0xc87b56dd\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\",\"signature\":\"0x23b872dd\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\",\"signature\":\"0xf2fde38b\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"baseURI_\",\"type\":\"string\"}],\"name\":\"setBaseURI\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\",\"signature\":\"0x55f804b3\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"tokenURI\",\"type\":\"string\"}],\"name\":\"mintNFT\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\",\"signature\":\"0xeacabe14\"}]";
    // set rpc url endpoint
    //string rpc = "https://public-node-api.klaytnapi.com/v1/baobab";

    // Call the "owner" function with "10" as argument
    async public void GetOwner()
    {
        // function name
        string method = "owner";
        // arguments
        string args = "[]";
        try
        {
            string response = await EVM.Call(chain, network, contract, abi, method, args);
            Debug.Log(response);
        } catch(Exception e) 
        {
            Debug.LogException(e, this);
        }
    }
    
    // Call the "safeMint" function 
    async public void SafeMint()
    {
        // function name
        string method = "safeMint";
        // arguments
        string args = "[\"0x646268287Aa8A20947d781E845Cb9631A644D1E1\"]";
        // value in ston to add in the transaction 
        string value = "50000000000000000";
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
    
     // Call the "approve" function 
    async public void Approve()
    {
        // spender
        string to = "0x57468012dF29B5f1C4b5baCD1CD2F0e2eC323316";
        // token ID
        string tokenId = "1";
        // function name
        string method = "approve";
        string[] obj = {to, tokenId};
        // arguments
        string args = JsonConvert.SerializeObject(obj);
        // value in ston to add in the transaction 
        string value = "50000000000000000";
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
}
```
#### Create the buttons
We will create 2 buttons (*Owner*, *Approve* and *Mint*) on the UI to interact with our KIP17 token. 

To create the buttons, follow the steps in the section [Custom Interaction with Login](#custom-interaction-with-login).

#### Build and Run the project
- Go to **File** → **Build and Run**

- Click on **Login** to connect Metamask

- Click on **Mint** and confirm your transaction
 
 ![image](https://user-images.githubusercontent.com/105277604/191380058-277a3686-cbbf-49d1-8ff4-e3846ed74bf6.png)

- Here are the details of the transaction on [Klaytnscope](https://baobab.scope.klaytn.com/tx/0xa7adfe56dd7892679adb385e42ee22f969d8672668c3cc5d4c1baf8ee63cb98c?tabId=eventLog).
 
 ![image](https://user-images.githubusercontent.com/105277604/191380090-ec373d63-dea3-4123-b3e7-2a3bd5cd6273.png)

---

## How to use the KIP37 token

In this section you will see how to build a Unity project using the KIP37 (ERC-1155) token standard on Klaytn.

Start by creating a new project by following the steps at the section [Create a new Unity project](#create-a-new-unity-project).

Make sure to install all dependencies to fix all bugs.

#### Use the WebLogin prefab to enable web3 wallet connection
- Under **Assets** → **Web3Unity** → **Scenes**, double-click on **WebLogin**. This is the prefab used to connect a wallet in a WebGL project
 
![image](https://user-images.githubusercontent.com/105277604/191380183-89acdf17-7a8b-4ee0-a29e-87ce4c50814e.png)

- Go to **File** → **Build Settings** → **WebGL** → **Switch Platform**
 
![image](https://user-images.githubusercontent.com/105277604/191380207-9c38c68e-d477-4359-8666-124f331fc2ac.png)

- From the same window, click on **Add Open Scenes** (top right) to add the Login scene as the first scene to appear when we run the project.

- From the same window, click on **Player Settings** → **Player** → **Resolution and Presentation**, under **WebGL Template**, select the one with the same as our Unity version (WebGL 2020 for our case).
 
![image](https://user-images.githubusercontent.com/105277604/191380223-34d6b73c-3da3-4f6d-8364-42de13dd1b4c.png)

- Go back to the Unity project. Under Assets, select Scenes and double-click on SampleScene to use it as our second scene (FYI the first one is the login scene)

- Go to **File** → **Build Settings** → **Add Open Scenes**. The SampleScene will appear under the WebLogin scene. It means the SampleScene, where we will create the buttons to read and write to the contract, will be the next scene after the WebLogin.
:warning: Make sure the WebLogin scene is at the top because the order matters.

#### Create your contract
Open [Remix IDE](https://remix.ethereum.org/#optimize=false&runs=200&evmVersion=null), install the [Klaytn Remix plugin](https://klaytn.foundation/using-klaytn-plugin-on-remix/) then paste the code below:

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@klaytn/contracts/KIP/token/KIP37/KIP37.sol";
import "@klaytn/contracts/utils/Counters.sol";

contract KIP37Token is KIP37 {

    mapping (uint256 => string) private _tokenURIs;
    using Counters for Counters.Counter; 
    Counters.Counter private _tokenIds; 

    constructor() KIP37("MultiTokenNFT") {} 

    function mintToken(string memory tokenURI, uint256 amount)
    public returns(uint256) { 
        uint256 newItemId = _tokenIds.current(); 
        _mint(msg.sender, newItemId, amount, "");
        _setTokenUri(newItemId, tokenURI); 
        _tokenIds.increment(); 
        return newItemId; 
    } 

    function uri(uint256 tokenId) override public view 
    returns (string memory) { 
        return(_tokenURIs[tokenId]); 
    } 
    
    function _setTokenUri(uint256 tokenId, string memory tokenURI)
    private {
         _tokenURIs[tokenId] = tokenURI; 
    } 
}
```
Compile your contract and deploy it to baobab testnet faucet [here](https://baobab.wallet.klaytn.foundation/faucet).

#### Create your C# script on Unity
Under **Project** window, right-click on **Scenes**, click on **Create** → **C# Script**

```C++
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Numerics;
using UnityEngine.UI;
using Newtonsoft.Json;
public class MintKIP37 : MonoBehaviour
{
    string chain = "klaytn";
    string network = "testnet";
    private string contract = "0x02476ac12EAED5d237dd03100aF430A7a378a3DE";
    private readonly string abi = "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\",\"signature\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"ApprovalForAll\",\"type\":\"event\",\"signature\":\"0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256[]\",\"name\":\"ids\",\"type\":\"uint256[]\"},{\"indexed\":false,\"internalType\":\"uint256[]\",\"name\":\"amounts\",\"type\":\"uint256[]\"}],\"name\":\"TransferBatch\",\"type\":\"event\",\"signature\":\"0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"TransferSingle\",\"type\":\"event\",\"signature\":\"0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"value\",\"type\":\"string\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"URI\",\"type\":\"event\",\"signature\":\"0x6bb7ff708619ba0610cba295a58592e0451dee2622938c8755667688daf3529b\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0x00fdd58e\"},{\"inputs\":[{\"internalType\":\"address[]\",\"name\":\"owners\",\"type\":\"address[]\"},{\"internalType\":\"uint256[]\",\"name\":\"ids\",\"type\":\"uint256[]\"}],\"name\":\"balanceOfBatch\",\"outputs\":[{\"internalType\":\"uint256[]\",\"name\":\"\",\"type\":\"uint256[]\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0x4e1273f4\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"isApprovedForAll\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0xe985e9c5\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256[]\",\"name\":\"ids\",\"type\":\"uint256[]\"},{\"internalType\":\"uint256[]\",\"name\":\"amounts\",\"type\":\"uint256[]\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"safeBatchTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\",\"signature\":\"0x2eb2c2d6\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\",\"signature\":\"0xf242432a\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"setApprovalForAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\",\"signature\":\"0xa22cb465\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0x01ffc9a7\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"tokenURI\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"mintToken\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\",\"signature\":\"0xc046372c\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"uri\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0x0e89341c\"}]";
    string rpc = "https://public-node-api.klaytnapi.com/v1/baobab";
    private string tokenURI = "https://ipfs.infura.io/ipfs/QmbmNhqKt7mnmFeKE17QwR5s2cTnfskQKDpx8UHwfbHx3v";
    private string amount = "10";

    // AddValue is called before the first frame update
    async public void MintToken()
    {
        string method = "mintToken";
        string[] obj = {tokenURI, amount};
        string args = JsonConvert.SerializeObject(obj);
        string value = "";
        string gasLimit = "1000000";
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

    async public void BalanceOf()
    {
        string method = "balanceOf";
        string owner = "0x7b9b65d4ee2fd57fc0dcfb3534938d31f63cba65";
        string id = "0";
        string[] obj = {owner, id};
        string args = JsonConvert.SerializeObject(obj);
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
```
#### Create the buttons
We will create 2 buttons (*Balance*, *Mint*) on the UI to interact with our KIP37 token. To create the buttons, follow the steps in the section [Custom Interaction with Login](#custom-interaction-with-login).

#### Test the balanceOf method
Click on :arrow_forward: to run the program and test the Balance button

You should get a result from the Owner and the Id of the token that we put in the script
 
![image](https://user-images.githubusercontent.com/105277604/191380242-e5c72903-4787-43d5-a145-8b1ab5e4c1b2.png)

### Build and Run the project to test the mint method
Go to **File** → **Build and Run**

Click on **Login** to connect **Metamask**

Click on the **mint** button

Confirm your transaction

Here are the details of the transaction on [Klaytnscope](https://baobab.scope.klaytn.com/tx/0x9965be98dc1f2591da3514138840bf034a415822fc71fb2f6b91c1d21ea2f63f?tabId=eventLog)

