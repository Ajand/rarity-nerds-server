const axios = require('axios');
const ipfsConvert = require('./utils/ipfsConvert');
const traitMiner = require('./utils/traitMiner');
const tokenMiner = require('./utils/tokenMiner');

const traitFetcher = ({ traitDBQueue, tokenDBQueue }) => async ({  url, replace, id, offset, collectionId }) => {
	const tokenAdder = (collectionId, tokenId, tokenData) => {
		tokenDBQueue.add({ collectionId: collectionId, tokenId, tokenData });
	};

	return axios
		.get(ipfsConvert(url).replace(replace, id + offset), { timemout: 2000 })
		.then(function(response) {
			return response.data;
		})
		.then((response) => {
			traitMiner(traitDBQueue)(response, collectionId, id);
			tokenAdder(collectionId, id, tokenMiner(response, id, collectionId));
			return id;
		})
		.catch((err) => {
			console.log(err);
		});
};

module.exports = traitFetcher;
