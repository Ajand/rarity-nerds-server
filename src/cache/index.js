const { createClient } = require('redis')

const setupCache = async () => {
	const client = createClient();

	client.on('error', (err) => console.log('Redis Client Error', err));

	await client.connect();

    return client
};

module.exports = setupCache;
