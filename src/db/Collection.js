const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema(
	{
		collectionName: {
			type: String,
			required: true
		},
        address: {
            type: String,
            required: true
        },
		logo: {
            type: String,
            required: true
        },
        cover: {
            type: String,
            required: true
        },
		
        description:{ 
            type: String,
            required: true
        },
        chain: {
            type: String,
            enum: ['bsc', 'ethereum'],
            default: 'bsc'
        },
        published: {
            type: Boolean,
            default: false,
        },
        markets: {
            type: [String],
            default: ['pancake']
        }
	},
	{
		timestamps: true
	}
);

const Collection = mongoose.model('collection', CollectionSchema);

module.exports = Collection;
