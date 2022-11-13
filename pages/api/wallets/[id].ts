import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../lib/withSession";
import { DeviceKey } from "../../../modules/DeviceKey";
import { User, UserMetaData } from "../../../modules/User";
import UserDto from "../../../modules/UserDto";

async function route(req: NextApiRequest, res: NextApiResponse) {
	const { id = null } = req.query as { id?: string };

	if(!id || req?.method !== "GET") {
		res.status(404).send({});
		return;
	}

	const user = await User.findByPk(id, {
		include: UserMetaData,
	});

	if(!user) {
		res.status(404).send({});
		return;
	}

	const devices = await DeviceKey.findAll({
		where: {
			userId: id,
		}
	});

	const localUser = UserDto.toLocalUser(user);

	res.status(200).send({
		user: localUser,
		devices: devices,
	});
}

export default withSessionRoute(route);

