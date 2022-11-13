import { Sequelize, DataTypes } from "sequelize";

// Yep, I know its bad, but thats it. Supertokens doesnt allow/have good User administrating (at the point of writing this comment)
const sequelize = new Sequelize('postgresql://postgres:postgres@localhost:5430/postgres');

export const User = sequelize.define('User', {
	// Model attributes are defined here
	user_id: {
		type: DataTypes.UUID,
		allowNull: false,
		primaryKey: true,
	},
	phone_number: {
		type: DataTypes.STRING
		// allowNull defaults to true
	},
	time_joined: {
		type: DataTypes.NUMBER
		// allowNull defaults to true
	}
}, {
	tableName: "passwordless_users",
	timestamps: false,
});

export const UserMetaData = sequelize.define('UserMetaData', {
	// Model attributes are defined here
	user_id: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true,
	},
	user_metadata: {
		type: DataTypes.STRING
		// allowNull defaults to true
	},
}, {
	tableName: "user_metadata",
	timestamps: false,
});

User.hasOne(UserMetaData, { foreignKey: "user_id"});


