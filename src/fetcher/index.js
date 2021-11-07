const Queue = require('bull');
// Let's start the fetch
// Cache That we start fetching
// Create A fetching queue
// Create An Adding to DB Queue
// Create A trait adder to DB Queue
// Process the queues

const traitFetcher = require('./traitFetcher');

const addToken = require('./addToken');
const addTrait = require('./addTrait');
const findTokens = require('./findTokens');

const findNeededTokens = require('./utils/findNeededTokens');

const fetch = (redis) => async ({ collectionId, minId, maxId, offset, generalTokenUri }) => {
	const cacheKey = `fetching:${collectionId}`;
	const fetchingStatus = await redis.HGETALL(cacheKey);
	if (Object.keys({ ...fetchingStatus }).length === 0) {
		const currentTokens = await findTokens(collectionId);
		const neededTokens = findNeededTokens(maxId, minId, currentTokens.map((token) => token.tokenId));

		await redis.HSET(
			`fetching:${collectionId}`,
			'minId',
			String(minId),
			'maxId',
			String(maxId),
			'offset',
			String(offset),
			'generalTokenUri',
			generalTokenUri
		);

		const fetchQueue = new Queue(`fetchTokens${collectionId}`, {
			defaultJobOptions: {
				backoff: 1000,
				attempts: 10
			}
		});
		const tokenDBQueue = new Queue(`tokenDBQueue${collectionId}`);
		const traitDBQueue = new Queue(`traitDBQueue${collectionId}`);


		neededTokens.forEach((id) =>
			fetchQueue.add({
				collectionId,
				url: generalTokenUri,
				replace: 'REPLACE',
				id,
				offset: offset
			})
		);

		fetchQueue.process(10, async function(job, done) {
			const { collectionId, url, replace, id, offset, final } = job.data;

			console.log(` Fetching ${id}`);

			traitFetcher({ traitDBQueue, tokenDBQueue })({ collectionId, url, replace, id, offset })
				.then(async () => {
					done(null, job.data);
				})
				.catch((err) => {
					setTimeout(() => {
						fetchQueue.add({ collectionId, url, replace, id, offset });
					}, 5000);
					done(err);
				});
		});

		tokenDBQueue.process(10, async function(job, done) {
			const { collectionId, tokenId, tokenData } = job.data;

			const token = await addToken(collectionId, tokenId, tokenData);
			done(null, token);
		});

		traitDBQueue.process(10, async function(job, done) {
			const { collectionId, trait } = job.data;
			try {
				const tr = await addTrait(collectionId, trait);
				done(null, tr);
			} catch (err) {
				done(err);
			}

			done(null);
		});

		return 'Fetching Started.';
	}
	return 'Is Fetching';
};

// Create a stop function that empty all fetching queus and clean the DB queues

const stopFetcher = (redis) => async (collectionId) => {
	const fetchQueue = new Queue(`fetchTokens${collectionId}`);
	const cacheKey = `fetching:${collectionId}`;
	await redis.del(cacheKey);

	await fetchQueue.empty();
	return 'Fetching Stopped';
};

const fetchingStatus = (collectionId) => {};

module.exports = {
	fetch,
	stopFetcher,
	fetchingStatus
};
