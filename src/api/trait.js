const Trait = require('../db/Trait');

const getTraits = async (collectionId) => {
	const queryDB = (collectionId) => {
		return new Promise((resolve, reject) => {
			Trait.find({ collectionId }, (err, traits) => {
				if (err) return reject(err);
				return resolve(traits);
			});
		});
	};

	try {
		return await queryDB(collectionId);
	} catch (err) {
		return [];
	}
};

module.exports = { getTraits };
