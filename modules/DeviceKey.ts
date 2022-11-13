import { Sequelize, DataTypes } from "sequelize";

// Yep, I know its bad, but thats it. Supertokens doesnt allow/have good User administrating (at the point of writing this comment)
const sequelize = new Sequelize('postgresql://postgres:postgres@localhost:5431/postgres');

export const DeviceKey = sequelize.define('DeviceKey', {
	// Model attributes are defined here
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
	},
	userId: {
		type: DataTypes.STRING
		// allowNull defaults to true
	},
	deviceId: {
		type: DataTypes.STRING
		// allowNull defaults to true
	},
	keyId: {
		type: DataTypes.STRING
		// allowNull defaults to true
	},
	publicKey: {
		type: DataTypes.STRING
		// allowNull defaults to true
	},
}, {
	tableName: "DeviceKey",
});

