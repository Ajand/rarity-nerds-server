const mongoose = require('mongoose');
const { DB_NAME } = process.env;

const setupDB = () => {
	mongoose
		.connect(`mongodb://localhost:27017/${DB_NAME}`)
		.then((result) => console.log(`Connected to DB: ${DB_NAME}`))
		.catch((err) => console.log(err));
};

module.exports = setupDB;
