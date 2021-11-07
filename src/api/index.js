const { ApolloServer, gql } = require('apollo-server');
const { PORT } = process.env;

const collectionAPI = require('./collection');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
	# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

	# This "Book" type defines the queryable fields for every book in our data source.

	type Collection {
		_id: ID!
		collectionName: String!
		address: String!
		logo: String!
		cover: String!
		description: String!
		chain: String!
		published: Boolean!
		markets: [String]
		createdAt: String
	}

	# The "Query" type is special: it lists all of the available queries that
	# clients can execute, along with the return type for each. In this
	# case, the "books" query returns an array of zero or more Books (defined above).
	type Query {
		collection(_id: ID!): Collection
		userCollections: [Collection!]!
		adminCollections: [Collection!]!
	}

	type Mutation {
		createCollection(
			collectionName: String!
			address: String!
			logo: String!
			cover: String!
			description: String!
		): Collection
		editCollection(
			_id: ID!
			collectionName: String!
			address: String!
			logo: String!
			cover: String!
			description: String!
		): String
		changePublicity(_id: ID!): String
	}
`;

const resolvers = {
	Query: {
		collection: (_, { _id }) => collectionAPI.get(_id),
		userCollections: () => collectionAPI.userCollections(),
		adminCollections: () => collectionAPI.adminCollections()
	},

	Mutation: {
		createCollection: (_, collectionParams) => collectionAPI.create(collectionParams),
		editCollection: (_, { _id, ...collectionParams }) => collectionAPI.edit(_id, collectionParams),
		changePublicity: (_, { _id }) => collectionAPI.changePublicity(_id)
	}
};

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.

const apiRunner = async (redis) => {
	server.listen(PORT).then(({ url }) => {
		console.log(`🚀  Server ready at ${url}`);
	});
};

module.exports = apiRunner;
