const Trait = require('../db/Trait');

const addTrait = (collectionId, trait) => {
	// Find Trait
	return new Promise((resolve, reject) => {
		Trait.findOne({ collectionId, trait_type: trait.trait_type, value: trait.value }, (err, ttt) => {
			if (err) return reject(err);
			if (ttt) {
				// If exist inc
				Trait.updateOne(
					{
						_id: ttt._id
					},
					{
						$inc: {
							amount: 1
						}
					},
					(err) => {
						if (err) return reject(err);
						return resolve('DONE.');
					}
				);
			} else {
				// If not exist add
				const tr = new Trait({ collectionId, ...trait, amount: 1 });
				return tr.save().then((r) => resolve(r)).catch((err) => {
					console.log(err);
					return reject(err);
				});
			}
		});
	});
};

module.exports = addTrait;
