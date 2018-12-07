require('./db.connector');
const User = require('./schema/user');
// const Transaction = require('./schema/transaction');

const user = {
    create: async (userID, nickname, ethereumAddress) => User.create({
        userID: userID,
        nickname: nickname,
        ethereumAddress: ethereumAddress,
    }, (err, doc) => {}),
    find: {
        all: () => {
            return new Promise((resolve, reject) => {
                User.find({}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            });
        },
        oneByID: (userID) => {
            return new Promise((resolve, reject) => {
                User.find({userID: userID}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            });
        },
        oneByNickname: (nickname) => {
            console.log(nickname)
            return new Promise((resolve, reject) => {
                User.find({nickname: new RegExp(nickname)}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            })
        }
    },
    update: {
        addresses: (userID, ethereumAddress) => {
            return new Promise((resolve, reject) => {
                User.update({userID: userID}, {ethereumAddress: ethereumAddress}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc);
                });
            });
        },
    }
};

const transaction = {
    create: async (currency, fromUserID, toUserID, toAddress, amount, amountInUSD, txHash) => Transaction.create({
        currency: currency,
        fromUserID: fromUserID,
        toUserID: toUserID,
        toAddress: toAddress,
        amount: amount,
        amountInUSD: amountInUSD,
        txHash: txHash
    }, (err, doc) => {}),
    find: {
        toUserID: (userID) => {
            return new Promise((resolve, reject) => {
                Transaction.find({toUserID: userID}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            });
        },
        fromUserID: (userID) => {
            return new Promise((resolve, reject) => {
                Transaction.find({fromUserID: userID}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            });
        }
    }
};


module.exports = {
    user: user,
    transaction: transaction
}
