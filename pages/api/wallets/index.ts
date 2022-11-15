import { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";
import { withSessionRoute } from "../../../lib/withSession";
// import { User, UserMetaData } from "../../../modules/User";
// import UserDto from "../../../modules/UserDto";
import { users } from "./mock"

async function listRoute(req: NextApiRequest, res: NextApiResponse) {
	if(req?.method !== "GET") {
		res.status(404).send({});
		return;
	}

	const { phone = null } = req.query as { phone?: string };

	const searchWhere = !phone ? undefined : {
		phone_number: {
			[Op.like]: `%${phone.trim().replace("+", "")}%`,
		}
	};

	// const users = await User.findAll({ include: UserMetaData, where: searchWhere });

	res.status(200).send({
		// data: UserDto.toLocalUsers(users),
		users
	});
}

export default withSessionRoute(listRoute);

