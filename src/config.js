module.exports = {
	client: {
		id: process.env.CLIENT_ID,
		token: process.env.TOKEN,
		secret: process.env.CLIENT_SECRET,
	},
	database: {
		uri: process.env.MONGO_URI,
	},
	logs: {
		error: '1182420307861057537',
	},
};