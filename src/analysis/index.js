const Queue = require('bull');
const rarityCalculator = require('./rarityCalculator');
const Token = require('../db/Token');

const calculateRarity = (redis) => (collectionId) => {
	const rarityDBQueue = new Queue(`rarityDBQueue${collectionId}`);

	rarityCalculator(rarityDBQueue)(collectionId).then(() => console.log("doing calculation")).catch(err => console.log("some error happened"))

	rarityDBQueue.process(10, function(job, done) {
		const { collectionId, tokenId, normalizeScore, scoreRank } = job.data;
		Token.findOne({ tokenId, collectionId }, (err, token) => {
			if (err) {
				return done(err);
			}
			if (token) {
				Token.updateOne(
					{ _id: token._id },
					{
						$set: {
							normalizeScore,
							scoreRank
						}
					},
					(err) => {
						if (err) {
							return done(err);
						} else {
							return done(null);
						}
					}
				);
			} else {
				done(null);
			}
		});
	});

	return 'Done';
};

module.exports = { calculateRarity };
