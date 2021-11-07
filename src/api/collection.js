const Collection = require('../db/Collection');

// create
// edit
// changePublicity

// get
// query

const create = ({ collectionName, address, cover, logo, description }) => {
	const collection = new Collection({ collectionName, address, cover, logo, description });

	return collection.save();
};

const edit = (_id, { collectionName, address, cover, logo, description }) => {
	return new Promise((resolve, reject) => {
		Collection.updateOne(
			{ _id },
			{
				$set: {
					collectionName,
					address,
					cover,
					logo,
					description
				}
			},
			(err) => {
				if (err) return reject(err);
				return resolve('Done');
			}
		);
	});
};

const changePublicity = (_id) => {
	return new Promise((resolve, reject) => {
		get(_id)
			.then((collection) => {
				Collection.findOneAndUpdate(
					{ _id },
					{
						$set: {
							published: !collection.published
						}
					},
					(err) => {
						if (err) return reject(err);
						return resolve('DONE');
					}
				);
			})
			.catch((err) => reject(err));
	});
};

const get = (_id) => {
	return new Promise((resolve, reject) => {
		Collection.findOne({ _id }, (err, collection) => {
			if (err) return reject(err);
			if (!collection) return reject(new Error('There is no collection with this ID'));
			return resolve(collection);
		});
	});
};

const adminCollections = (published) => {
	return new Promise((resolve, reject) => {
		Collection.find({}, (err, collections) => {
			if (err) return reject(err);
			return resolve(collections);
		});
	});
};

const userCollections = () => {
	return new Promise((resolve, reject) => {
		Collection.find({ published: true }, (err, collections) => {
			if (err) return reject(err);
			return resolve(collections);
		});
	});
};

module.exports = {
	create,
	edit,
	changePublicity,
	get,
	adminCollections,
	userCollections
};
