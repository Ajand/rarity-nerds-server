const Token = require('../db/Token');

const getTokens = async (collectionId, { offset = 0, filters = [], filterIds = [], sortBy = 'normalized' }) => {
	const limit = 20;

	const queryDB = async (collectionId, { sortBy, offset, filterIds, filters }) => {

		const createSortBy = () => {
			switch (sortBy) {
				case 'normalized':
					return { normalizeScore: -1 };
				case 'normalized-r':
					return { normalizeScore: 1 };
				case 'id':
					return { tokenId: -1 };
				case 'id-r':
					return { tokenId: 1 };
				case 'price':
					return { price: -1 };
				case 'price-r':
					return { price: 1 };
				case 'ratio':
					return { ratio: 1 };
			}
		};

		const createQueryParams = () => {
			let query = { collectionId };
            console.log(filterIds)
			if (filterIds.length) query = { ...query, tokenId: { $in: filterIds } };
			filters.map(fil => JSON.parse(fil)).forEach((fil) => {
				switch (fil.variant) {
					case 'only_sales':
						return (query = { ...query, isForSale: true });
					case 'trait_exist':
						var nq = { ...query };
						nq[`traits.${fil.payload[0]}`] = { $exists: true };
						return (query = nq);
					case 'specific_trait':
						var nq = { ...query };
						nq[`traits.${fil.payload[0]}`] = fil.payload[1];
						return (query = nq);
					default:
						return true;
				}
			});
			return query;
		};

		return await new Promise((resolve, reject) => {
			Token.find(createQueryParams())
				.sort(createSortBy())
				.limit(limit)
				.skip(Number(offset))
				.exec((err, tokens) => {
					if (err) return reject(err);
					Token.find(createQueryParams(), (err, tks) => {

						if (err) return reject(err);
						return resolve({ items: tokens.map(tk => JSON.stringify(tk)), total: tks.length });
					});
				});
		});
	};

	return await queryDB(collectionId, {
		sortBy,
		offset,
		filterIds,
		filters
	});
};

module.exports = { getTokens };
