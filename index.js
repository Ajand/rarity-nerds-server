require('dotenv').config();
const setupDB = require('./src/db/setup');
const setupRedis = require('./src/cache')
const apiRunner = require('./src/api');

const main = async () => {
	setupDB();
    const redis = await setupRedis()
	await apiRunner(redis);
};

main();
