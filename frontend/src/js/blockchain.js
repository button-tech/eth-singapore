const tbn = (x) => new BigNumber(x);
const tw = (x) => BigNumber.isBigNumber(x) ? x.times(1e18).integerValue() : tbn(x).times(1e18).integerValue();
const fw = (x) => BigNumber.isBigNumber(x) ? x.times(1e-18).toNumber() : tbn(x).times(1e-18).toNumber();
const ABI = {"name":"WETH","address":"0xc778417E063141139Fce010982780140Aa0cD5Ab","abi":[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]};
const WETHAddress = "0xc778417E063141139Fce010982780140Aa0cD5Ab";

const web3 =  new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/1u84gV2YFYHHTTnh8uVl'));

async function get(instance, method, parameters) {
    return await instance.methods[method](...parameters).call();
}

async function sendToken(tokenAddress, privateKey, receiver, amount) {
    const instance = getInstance(ABI, tokenAddress);
    const data = getCallData(instance, "transfer", [receiver, amount]);
    const response = await set(privateKey, instance, tokenAddress, data);
    return response.transactionHash;
}

async function setAllowance(privateKey, to, amount) {
    return approve(WETHAddress, privateKey, to, amount);
}

async function approve(tokenAddress, privateKey, to, amount) {
    const instance = getInstance(ABI, tokenAddress);
    const data = getCallData(instance, "approve", [to, amount]);
    const response = await set(privateKey, instance, tokenAddress, data);
    return response.transactionHash;
}

async function depositToken(privateKey, amount) {
    const instance = getInstance(ABI, WETHAddress);
    const data = getCallData(instance, "deposit");
    return set(privateKey, WETHAddress, amount, data);

}

async function set(privateKey, receiver, amount, transactionData) {
    const userAddress = getAddress(privateKey);
    const txParam = {
        nonce: Number(await web3.eth.getTransactionCount(userAddress)),
        to: receiver,
        value: Number(amount),
        from: userAddress,
        data: transactionData !== undefined ? transactionData : '',
        gasPrice: 0x3b9bca00,
        gas: 210000
    };
    console.log(txParam)
    const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(privateKey.substring(2), 'hex');

    const tx = new ethereumjs.Tx(txParam);
    tx.sign(privateKeyBuffer);
    const serializedTx = tx.serialize();

    return await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
}

function getCallData(instance, method, parameters) {
    return instance.methods[method](...parameters).encodeABI();
}

function getInstance(ABI, address) {
    return new web3.eth.Contract(ABI, address);
}

function getAddress(privateKey) {
    let _privateKey = privateKey.substring(2, privateKey.length);
    return keythereum.privateKeyToAddress(_privateKey);
}

function getPrivateKey() {
    let params = {
        keyBytes: 32,
        ivBytes: 16
    };
    let dk = keythereum.create(params);
    return "0x" + dk.privateKey.reduce((memo, i) => {
        return memo + ('0' + i.toString(16)).slice(-2);
    }, '');
}

class Blockchain {
    constructor() {
        this.getPrivateKey = getPrivateKey;
        this.getAddress = getAddress;
        this.set = set;
        this.get = get;
        this.setAllowance = setAllowance;
        this.sendToken = sendToken;
        this.depositToken = depositToken;

    }
}