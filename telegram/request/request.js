const rp = require('request-promise');

async function getTokenBalance(tokenAddress, userAddress) {
    return  JSON.parse(await rp.get(`https://api-ropsten.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${userAddress}`)).result
}

module.exports = {
    getTokenBalance: getTokenBalance
};