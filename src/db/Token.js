const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
	image: {
		type: String
	},
	traits: {
		type: Object
	},
	attributes: [
		{
			trait_type: { type: String },
			value: {
				type: String
			}
		}
	],
	tokenId: {
		type: Number,
		index: true
	},
	collectionId: {
		type: mongoose.Types.ObjectId,
		lowercase: true,
		index: true
	},
	rarityScore: Number,
	normalizeScore: { type: Number, index: true },
	scoreRank: { type: Number, index: true },
	isForSale: { type: Boolean, index: true },
	price: { type: Number, index: true },
	ratio: { type: Number, index: true },
	tokenUnique: {
		type: String,
		unique: true,
		index: true
	}
});

const Token = mongoose.model('token', TokenSchema);

module.exports = Token;
