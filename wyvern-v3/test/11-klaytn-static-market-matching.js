/* global artifacts:false, it:false, contract:false, assert:false */

const WyvernAtomicizer = artifacts.require('WyvernAtomicizer')
const WyvernExchange = artifacts.require('WyvernExchange')
const StaticMarket = artifacts.require('StaticMarket')
const WyvernRegistry = artifacts.require('WyvernRegistry')
const TestKIP7 = artifacts.require('TestKIP7')
const TestKIP17 = artifacts.require('TestKIP17')
const TestKIP37 = artifacts.require('TestKIP37')

const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://localhost:8545')
const web3 = new Web3(provider)

const {wrap,ZERO_BYTES32,CHAIN_ID,assertIsRejected} = require('./util')

contract('WyvernExchange', (accounts) =>
	{
	let deploy_core_contracts = async () =>
		{
		let [registry,atomicizer] = await Promise.all([WyvernRegistry.new(), WyvernAtomicizer.new()])
		let [exchange,statici] = await Promise.all([WyvernExchange.new(CHAIN_ID,[registry.address],'0x'),StaticMarket.new()])
		await registry.grantInitialAuthentication(exchange.address)
		return {registry,exchange:wrap(exchange),atomicizer,statici}
		}

	let deploy = async contracts => Promise.all(contracts.map(contract => contract.new()))

	const any_kip37_for_kip7_test = async (options) =>
		{
		const {tokenId,
			buyTokenId,
			sellAmount,
			sellingPrice,
			sellingNumerator,
			buyingPrice,
			buyAmount,
			buyingDenominator,
			kip37MintAmount,
			kip7MintAmount,
			account_a,
			account_b,
			sender,
			transactions} = options

		const txCount = transactions || 1
		
		let {exchange, registry, statici} = await deploy_core_contracts()
		let [kip7,kip37] = await deploy([TestKIP7,TestKIP37])
		
		await registry.registerProxy({from: account_a})
		let proxy1 = await registry.proxies(account_a)
		assert.equal(true, proxy1.length > 0, 'no proxy address for account a')

		await registry.registerProxy({from: account_b})
		let proxy2 = await registry.proxies(account_b)
		assert.equal(true, proxy2.length > 0, 'no proxy address for account b')
		
		await Promise.all([kip37.setApprovalForAll(proxy1,true,{from: account_a}),kip7.approve(proxy2,kip7MintAmount,{from: account_b})])
		await Promise.all([kip37.mint(account_a,tokenId,kip37MintAmount),kip7.mint(account_b,kip7MintAmount)])

		if (buyTokenId)
			await kip37.mint(account_a,buyTokenId,kip37MintAmount)

		const kip37c = new web3.eth.Contract(kip37.abi, kip37.address)
		const kip7c = new web3.eth.Contract(kip7.abi, kip7.address)
		const selectorOne = web3.eth.abi.encodeFunctionSignature('anyKIP37ForKIP7(bytes,address[7],uint8[2],uint256[6],bytes,bytes)')
		const selectorTwo = web3.eth.abi.encodeFunctionSignature('anyKIP7ForKIP37(bytes,address[7],uint8[2],uint256[6],bytes,bytes)')
			
		const paramsOne = web3.eth.abi.encodeParameters(
			['address[2]', 'uint256[3]'],
			[[kip37.address, kip7.address], [tokenId, sellingNumerator || 1, sellingPrice]]
			) 
	
		const paramsTwo = web3.eth.abi.encodeParameters(
			['address[2]', 'uint256[3]'],
			[[kip7.address, kip37.address], [buyTokenId || tokenId, buyingPrice, buyingDenominator || 1]]
			)

		const one = {registry: registry.address, maker: account_a, staticTarget: statici.address, staticSelector: selectorOne, staticExtradata: paramsOne, maximumFill: (sellingNumerator || 1) * sellAmount, listingTime: '0', expirationTime: '10000000000', salt: '11'}
		const two = {registry: registry.address, maker: account_b, staticTarget: statici.address, staticSelector: selectorTwo, staticExtradata: paramsTwo, maximumFill: buyingPrice*buyAmount, listingTime: '0', expirationTime: '10000000000', salt: '12'}

		const firstData = kip37c.methods.safeTransferFrom(account_a, account_b, tokenId, sellingNumerator || buyAmount, "0x").encodeABI() + ZERO_BYTES32.substr(2)
		const secondData = kip7c.methods.transferFrom(account_b, account_a, buyAmount*buyingPrice).encodeABI()
		
		const firstCall = {target: kip37.address, howToCall: 0, data: firstData}
		const secondCall = {target: kip7.address, howToCall: 0, data: secondData}

		let sigOne = await exchange.sign(one, account_a)
		
		for (var i = 0 ; i < txCount ; ++i)
			{
			let sigTwo = await exchange.sign(two, account_b)
			await exchange.atomicMatchWith(one, sigOne, firstCall, two, sigTwo, secondCall, ZERO_BYTES32,{from:sender || account_a})
			two.salt++
			}
		
		let [account_a_kip7_balance,account_b_kip37_balance] = await Promise.all([kip7.balanceOf(account_a),kip37.balanceOf(account_b, tokenId)])
		assert.equal(account_a_kip7_balance.toNumber(), sellingPrice*buyAmount*txCount,'Incorrect KIP7 balance')
		assert.equal(account_b_kip37_balance.toNumber(), sellingNumerator || (buyAmount*txCount),'Incorrect KIP37 balance')
		}

	it('StaticMarket: matches kip37 <> kip7 order, 1 fill',async () =>
		{
		const price = 10000

		return any_kip37_for_kip7_test({
			tokenId: 5,
			sellAmount: 1,
			sellingPrice: price,
			buyingPrice: price,
			buyAmount: 1,
			kip37MintAmount: 1,
			kip7MintAmount: price,
			account_a: accounts[0],
			account_b: accounts[6],
			sender: accounts[1]
			})
		})

	it('StaticMarket: matches kip37 <> kip7 order, multiple fills in 1 transaction',async () =>
		{
		const amount = 3
		const price = 10000

		return any_kip37_for_kip7_test({
			tokenId: 5,
			sellAmount: amount,
			sellingPrice: price,
			buyingPrice: price,
			buyAmount: amount,
			kip37MintAmount: amount,
			kip7MintAmount: amount*price,
			account_a: accounts[0],
			account_b: accounts[6],
			sender: accounts[1]
			})
		})

	it('StaticMarket: matches kip37 <> kip7 order, multiple fills in multiple transactions',async () =>
		{
		const nftAmount = 3
		const buyAmount = 1
		const price = 10000
		const transactions = 3

		return any_kip37_for_kip7_test({
			tokenId: 5,
			sellAmount: nftAmount,
			sellingPrice: price,
			buyingPrice: price,
			buyAmount,
			kip37MintAmount: nftAmount,
			kip7MintAmount: buyAmount*price*transactions,
			account_a: accounts[0],
			account_b: accounts[6],
			sender: accounts[1],
			transactions
			})
		})

	it('StaticMarket: matches kip37 <> kip7 order, allows any partial fill',async () =>
		{
		const nftAmount = 30
		const buyAmount = 4
		const price = 10000

		return any_kip37_for_kip7_test({
			tokenId: 5,
			sellAmount: nftAmount,
			sellingPrice: price,
			buyingPrice: price,
			buyAmount,
			kip37MintAmount: nftAmount,
			kip7MintAmount: buyAmount*price,
			account_a: accounts[0],
			account_b: accounts[6],
			sender: accounts[1]
			})
		})

	it('StaticMarket: matches kip37 <> kip7 order with any matching ratio',async () =>
		{
		const lot = 83974
		const price = 972

		return any_kip37_for_kip7_test({
			tokenId: 5,
			sellAmount: 6,
			sellingNumerator: lot,
			sellingPrice: price,
			buyingPrice: price,
			buyingDenominator: lot,
			buyAmount: 1,
			kip37MintAmount: lot,
			kip7MintAmount: price,
			account_a: accounts[0],
			account_b: accounts[6],
			sender: accounts[1]
			})
		})

	it('StaticMarket: does not match kip37 <> kip7 order beyond maximum fill',async () =>
		{
		const price = 10000

		return assertIsRejected(
			any_kip37_for_kip7_test({
				tokenId: 5,
				sellAmount: 1,
				sellingPrice: price,
				buyingPrice: price,
				buyAmount: 1,
				kip37MintAmount: 2,
				kip7MintAmount: price*2,
				account_a: accounts[0],
				account_b: accounts[6],
				sender: accounts[1],
				transactions: 2
				}),
			/First order has invalid parameters/,
			'Order should not match the second time.'
			)
		})

	it('StaticMarket: does not fill kip37 <> kip7 order with different prices',async () =>
		{
		const price = 10000

		return assertIsRejected(
			any_kip37_for_kip7_test({
				tokenId: 5,
				sellAmount: 1,
				sellingPrice: price,
				buyingPrice: price-10,
				buyAmount: 1,
				kip37MintAmount: 1,
				kip7MintAmount: price,
				account_a: accounts[0],
				account_b: accounts[6],
				sender: accounts[1]
				}),
			/Static call failed/,
			'Order should not match.'
			)
		})

	it('StaticMarket: does not fill kip37 <> kip7 order with different ratios',async () =>
		{
		const price = 10000

		return assertIsRejected(
			any_kip37_for_kip7_test({
				tokenId: 5,
				sellAmount: 1,
				sellingPrice: price,
				buyingPrice: price,
				buyingDenominator: 2,
				buyAmount: 1,
				kip37MintAmount: 1,
				kip7MintAmount: price,
				account_a: accounts[0],
				account_b: accounts[6],
				sender: accounts[1]
				}),
			/Static call failed/,
			'Order should not match.'
			)
		})

	it('StaticMarket: does not fill kip37 <> kip7 order beyond maximum sell amount',async () =>
		{
		const nftAmount = 2
		const buyAmount = 3
		const price = 10000

		return assertIsRejected(
			any_kip37_for_kip7_test({
				tokenId: 5,
				sellAmount: nftAmount,
				sellingPrice: price,
				buyingPrice: price,
				buyAmount,
				kip37MintAmount: nftAmount,
				kip7MintAmount: buyAmount*price,
				account_a: accounts[0],
				account_b: accounts[6],
				sender: accounts[1]
				}),
			/First call failed/,
			'Order should not fill'
			)
		})

	it('StaticMarket: does not fill kip37 <> kip7 order if balance is insufficient',async () =>
		{
		const nftAmount = 1
		const buyAmount = 1
		const price = 10000

		return assertIsRejected(
			any_kip37_for_kip7_test({
				tokenId: 5,
				sellAmount: nftAmount,
				sellingPrice: price,
				buyingPrice: price,
				buyAmount,
				kip37MintAmount: nftAmount,
				kip7MintAmount: buyAmount*price-1,
				account_a: accounts[0],
				account_b: accounts[6],
				sender: accounts[1]
				}),
			/Second call failed/,
			'Order should not fill'
			)
		})

	it('StaticMarket: does not fill kip37 <> kip7 order if the token IDs are different',async () =>
		{
		const price = 10000

		return assertIsRejected(
			any_kip37_for_kip7_test({
				tokenId: 5,
				buyTokenId: 6,
				sellAmount: 1,
				sellingPrice: price,
				buyingPrice: price,
				buyAmount: 1,
				kip37MintAmount: 1,
				kip7MintAmount: price,
				account_a: accounts[0],
				account_b: accounts[6],
				sender: accounts[1],
				}),
			/Static call failed/,
			'Order should not match the second time.'
			)
		})

	const any_kip7_for_kip7_test = async (options) =>
		{
		const {sellAmount,
			sellingPrice,
			buyingPrice,
			buyPriceOffset,
			buyAmount,
			kip7MintAmountSeller,
			kip7MintAmountBuyer,
			account_a,
			account_b,
			sender,
			transactions} = options

		const txCount = transactions || 1
		const takerPriceOffset = buyPriceOffset || 0
		
		let {exchange, registry, statici} = await deploy_core_contracts()
		let [kip7Seller,kip7Buyer] = await deploy([TestKIP7,TestKIP7])
		
		await registry.registerProxy({from: account_a})
		let proxy1 = await registry.proxies(account_a)
		assert.equal(true, proxy1.length > 0, 'no proxy address for account a')

		await registry.registerProxy({from: account_b})
		let proxy2 = await registry.proxies(account_b)
		assert.equal(true, proxy2.length > 0, 'no proxy address for account b')
		
		await Promise.all([kip7Seller.approve(proxy1,kip7MintAmountSeller,{from: account_a}),kip7Buyer.approve(proxy2,kip7MintAmountBuyer,{from: account_b})])
		await Promise.all([kip7Seller.mint(account_a,kip7MintAmountSeller),kip7Buyer.mint(account_b,kip7MintAmountBuyer)])

		const kip7cSeller = new web3.eth.Contract(kip7Seller.abi, kip7Seller.address)
		const kip7cBuyer = new web3.eth.Contract(kip7Buyer.abi, kip7Buyer.address)
		const selector = web3.eth.abi.encodeFunctionSignature('anyKIP7ForKIP7(bytes,address[7],uint8[2],uint256[6],bytes,bytes)')
			
		const paramsOne = web3.eth.abi.encodeParameters(
			['address[2]', 'uint256[2]'],
			[[kip7Seller.address, kip7Buyer.address], [sellingPrice, buyingPrice]]
			) 
	
		const paramsTwo = web3.eth.abi.encodeParameters(
			['address[2]', 'uint256[2]'],
			[[kip7Buyer.address, kip7Seller.address], [buyingPrice + takerPriceOffset, sellingPrice]]
			)
		const one = {registry: registry.address, maker: account_a, staticTarget: statici.address, staticSelector: selector, staticExtradata: paramsOne, maximumFill: sellAmount, listingTime: '0', expirationTime: '10000000000', salt: '11'}
		const two = {registry: registry.address, maker: account_b, staticTarget: statici.address, staticSelector: selector, staticExtradata: paramsTwo, maximumFill: txCount*sellingPrice*buyAmount, listingTime: '0', expirationTime: '10000000000', salt: '12'}

		const firstData = kip7cSeller.methods.transferFrom(account_a, account_b, buyAmount).encodeABI()
		const secondData = kip7cBuyer.methods.transferFrom(account_b, account_a, buyAmount * sellingPrice).encodeABI()
		
		const firstCall = {target: kip7Seller.address, howToCall: 0, data: firstData}
		const secondCall = {target: kip7Buyer.address, howToCall: 0, data: secondData}

		let sigOne = await exchange.sign(one, account_a)
		
		for (var i = 0 ; i < txCount ; ++i)
			{
			let sigTwo = await exchange.sign(two, account_b)
			await exchange.atomicMatchWith(one, sigOne, firstCall, two, sigTwo, secondCall, ZERO_BYTES32,{from: sender || account_a})
			two.salt++
			}
		
		let [account_a_kip7_balance,account_b_kip7_balance] = await Promise.all([kip7Buyer.balanceOf(account_a),kip7Seller.balanceOf(account_b)])
		assert.equal(account_a_kip7_balance.toNumber(), sellingPrice*buyAmount*txCount,'Incorrect KIP7 balance')
		assert.equal(account_b_kip7_balance.toNumber(), buyAmount*txCount,'Incorrect KIP7 balance')
		}

	it('StaticMarket: matches kip7 <> kip7 order, 1 fill',async () =>
		{
		const price = 10000

		return any_kip7_for_kip7_test({
			sellAmount: 1,
			sellingPrice: price,
			buyingPrice: 1,
			buyAmount: 1,
			kip7MintAmountSeller: 1,
			kip7MintAmountBuyer: price,
			account_a: accounts[0],
			account_b: accounts[6],
			sender: accounts[1]
			})
		})

	it('StaticMarket: matches kip7 <> kip7 order, multiple fills in 1 transaction',async () =>
		{
		const amount = 3
		const price = 10000

		return any_kip7_for_kip7_test({
			sellAmount: amount,
			sellingPrice: price,
			buyingPrice: 1,
			buyAmount: amount,
			kip7MintAmountSeller: amount,
			kip7MintAmountBuyer: amount*price,
			account_a: accounts[0],
			account_b: accounts[6],
			sender: accounts[1]
			})
		})

	it('StaticMarket: matches kip7 <> kip7 order, multiple fills in multiple transactions',async () =>
		{
		const sellAmount = 3
		const buyAmount = 1
		const price = 10000
		const transactions = 3

		return any_kip7_for_kip7_test({
			sellAmount,
			sellingPrice: price,
			buyingPrice: 1,
			buyAmount,
			kip7MintAmountSeller: sellAmount,
			kip7MintAmountBuyer: buyAmount*price*transactions,
			account_a: accounts[0],
			account_b: accounts[6],
			sender: accounts[1],
			transactions
			})
		})

	it('StaticMarket: matches kip7 <> kip7 order, allows any partial fill',async () =>
		{
		const sellAmount = 30
		const buyAmount = 4
		const price = 10000

		return any_kip7_for_kip7_test({
			sellAmount,
			sellingPrice: price,
			buyingPrice: 1,
			buyAmount,
			kip7MintAmountSeller: sellAmount,
			kip7MintAmountBuyer: buyAmount*price,
			account_a: accounts[0],
			account_b: accounts[6],
			sender: accounts[1]
			})
		})

	it('StaticMarket: does not match kip7 <> kip7 order beyond maximum fill',async () =>
		{
		const price = 10000

		return assertIsRejected(
			any_kip7_for_kip7_test({
				sellAmount: 1,
				sellingPrice: price,
				buyingPrice: 1,
				buyAmount: 1,
				kip7MintAmountSeller: 2,
				kip7MintAmountBuyer: price*2,
				account_a: accounts[0],
				account_b: accounts[6],
				sender: accounts[1],
				transactions: 2
				}),
			/First order has invalid parameters/,
			'Order should not match the second time.'
			)
		})

	it('StaticMarket: does not fill kip7 <> kip7 order with different taker price',async () =>
		{
		const price = 10000

		return assertIsRejected(
			any_kip7_for_kip7_test({
				sellAmount: 1,
				sellingPrice: price,
				buyingPrice: 1,
				buyPriceOffset: 1,
				buyAmount: 1,
				kip7MintAmountSeller: 2,
				kip7MintAmountBuyer: price,
				account_a: accounts[0],
				account_b: accounts[6],
				sender: accounts[1]
				}),
			/Static call failed/,
			'Order should not match.'
			)
		})

	it('StaticMarket: does not fill kip7 <> kip7 order beyond maximum sell amount',async () =>
		{
		const sellAmount = 2
		const buyAmount = 3
		const price = 10000

		return assertIsRejected(
			any_kip7_for_kip7_test({
				sellAmount,
				sellingPrice: price,
				buyingPrice: 1,
				buyAmount,
				kip7MintAmountSeller: sellAmount,
				kip7MintAmountBuyer: buyAmount*price,
				account_a: accounts[0],
				account_b: accounts[6],
				sender: accounts[1]
				}),
			/First call failed/,
			'Order should not fill'
			)
		})

	it('StaticMarket: does not fill kip7 <> kip7 order if balance is insufficient',async () =>
		{
		const sellAmount = 1
		const buyAmount = 1
		const price = 10000

		return assertIsRejected(
			any_kip7_for_kip7_test({
				sellAmount,
				sellingPrice: price,
				buyingPrice: 1,
				buyAmount,
				kip7MintAmountSeller: sellAmount,
				kip7MintAmountBuyer: buyAmount*price-1,
				account_a: accounts[0],
				account_b: accounts[6],
				sender: accounts[1]
				}),
			/Second call failed/,
			'Order should not fill'
			)
		})

	const kip17_for_kip7_test = async (options) =>
		{
		const {
			tokenId,
			buyTokenId,
			sellingPrice,
			buyingPrice,
			kip7MintAmount,
			account_a,
			account_b,
			sender} = options

		let {exchange, registry, statici} = await deploy_core_contracts()
		let [kip17,kip7] = await deploy([TestKIP17,TestKIP7])
		
		await registry.registerProxy({from: account_a})
		let proxy1 = await registry.proxies(account_a)
		assert.equal(true, proxy1.length > 0, 'no proxy address for account a')

		await registry.registerProxy({from: account_b})
		let proxy2 = await registry.proxies(account_b)
		assert.equal(true, proxy2.length > 0, 'no proxy address for account b')
		
		await Promise.all([kip17.setApprovalForAll(proxy1,true,{from: account_a}),kip7.approve(proxy2,kip7MintAmount,{from: account_b})])
		await Promise.all([kip17.mint(account_a,tokenId),kip7.mint(account_b,kip7MintAmount)])

		if (buyTokenId)
			await kip17.mint(account_a,buyTokenId)

		const kip17c = new web3.eth.Contract(kip17.abi, kip17.address)
		const kip7c = new web3.eth.Contract(kip7.abi, kip7.address)
		const selectorOne = web3.eth.abi.encodeFunctionSignature('KIP17ForKIP7(bytes,address[7],uint8[2],uint256[6],bytes,bytes)')
		const selectorTwo = web3.eth.abi.encodeFunctionSignature('KIP7ForKIP17(bytes,address[7],uint8[2],uint256[6],bytes,bytes)')
			
		const paramsOne = web3.eth.abi.encodeParameters(
			['address[2]', 'uint256[2]'],
			[[kip17.address, kip7.address], [tokenId, sellingPrice]]
			) 
	
		const paramsTwo = web3.eth.abi.encodeParameters(
			['address[2]', 'uint256[2]'],
			[[kip7.address, kip17.address], [buyTokenId || tokenId, buyingPrice]]
			)
		const one = {registry: registry.address, maker: account_a, staticTarget: statici.address, staticSelector: selectorOne, staticExtradata: paramsOne, maximumFill: 1, listingTime: '0', expirationTime: '10000000000', salt: '11'}
		const two = {registry: registry.address, maker: account_b, staticTarget: statici.address, staticSelector: selectorTwo, staticExtradata: paramsTwo, maximumFill: 1, listingTime: '0', expirationTime: '10000000000', salt: '12'}

		const firstData = kip17c.methods.transferFrom(account_a, account_b, tokenId).encodeABI()
		const secondData = kip7c.methods.transferFrom(account_b, account_a, buyingPrice).encodeABI()
		
		const firstCall = {target: kip17.address, howToCall: 0, data: firstData}
		const secondCall = {target: kip7.address, howToCall: 0, data: secondData}

		let sigOne = await exchange.sign(one, account_a)
		let sigTwo = await exchange.sign(two, account_b)
		await exchange.atomicMatchWith(one, sigOne, firstCall, two, sigTwo, secondCall, ZERO_BYTES32,{from: sender || account_a})
		
		let [account_a_kip7_balance,token_owner] = await Promise.all([kip7.balanceOf(account_a),kip17.ownerOf(tokenId)])
		assert.equal(account_a_kip7_balance.toNumber(), sellingPrice,'Incorrect KIP7 balance')
		assert.equal(token_owner, account_b,'Incorrect token owner')
		}

	it('StaticMarket: matches kip17 <> kip7 order',async () =>
		{
		const price = 15000

		return kip17_for_kip7_test({
			tokenId: 10,
			sellingPrice: price,
			buyingPrice: price,
			kip7MintAmount: price,
			account_a: accounts[0],
			account_b: accounts[6],
			sender: accounts[1]
			})
		})

	it('StaticMarket: does not fill kip17 <> kip7 order with different prices',async () =>
		{
		const price = 15000

		return assertIsRejected(
			kip17_for_kip7_test({
				tokenId: 10,
				sellingPrice: price,
				buyingPrice: price-1,
				kip7MintAmount: price,
				account_a: accounts[0],
				account_b: accounts[6],
				sender: accounts[1]
				}),
			/Static call failed/,
			'Order should not have matched'
			)
		})

	it('StaticMarket: does not fill kip17 <> kip7 order if the balance is insufficient',async () =>
		{
		const price = 15000

		return assertIsRejected(
			kip17_for_kip7_test({
				tokenId: 10,
				sellingPrice: price,
				buyingPrice: price,
				kip7MintAmount: price-1,
				account_a: accounts[0],
				account_b: accounts[6],
				sender: accounts[1]
				}),
			/Second call failed/,
			'Order should not have matched'
			)
		})

	it('StaticMarket: does not fill kip17 <> kip7 order if the token IDs are different',async () =>
		{
		const price = 15000

		return assertIsRejected(
			kip17_for_kip7_test({
				tokenId: 10,
				buyTokenId: 11,
				sellingPrice: price,
				buyingPrice: price,
				kip7MintAmount: price,
				account_a: accounts[0],
				account_b: accounts[6],
				sender: accounts[1]
				}),
			/Static call failed/,
			'Order should not have matched'
			)
		})
	})
