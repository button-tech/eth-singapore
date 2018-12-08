const tbn = (x) => new BigNumber(x);
const tw = (x) => BigNumber.isBigNumber(x) ? x.times(1e18).integerValue() : tbn(x).times(1e18).integerValue();
const fw = (x) => BigNumber.isBigNumber(x) ? x.times(1e-18).toNumber() : tbn(x).times(1e-18).toNumber();
const ABI = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"digits","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];


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

async function approve(tokenAddress, privateKey, to, amount) {
    const instance = getInstance(ABI, tokenAddress);
    const data = getCallData(instance, "approve", [to, amount]);
    const response = await set(privateKey, instance, tokenAddress, data);
    return response.transactionHash;
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
        this.getInstance = getInstance;
        this.getCallData = getCallData;
        this.set = set;
        this.get = get;
    }
}