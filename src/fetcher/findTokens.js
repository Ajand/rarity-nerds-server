const Token = require('../db/Token');

const findTokens = (collectionId) => {
	return new Promise((resolve, reject) => {
		Token.find({ collectionId }, {tokenId: true} ,(err, tokens) => {
			if (err) return reject(err);
			return resolve(tokens);
		})
	});
};

module.exports = findTokens;
