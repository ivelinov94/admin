import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../../lib/withSession";
import { DeviceKey } from "../../../../modules/DeviceKey";
import { AllRecipesUsers, User, UserMetaData, UserSessionInfo } from "../../../../modules/User";

async function route(req: NextApiRequest, res: NextApiResponse) {
	const { id = null } = req.query as { id?: string };

	if(!id || req?.method !== "DELETE") {
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

	try {
		// TODO: Delete transactions
		await Promise.all([
			DeviceKey.destroy({
				where: {
					userId: id,
				}
			}),
			User.destroy({
				where: {
					user_id: id,
				}
			}),
			UserMetaData.destroy({
				where: {
					user_id: id,
				}
			}),
			UserSessionInfo.destroy({
				where: {
					user_id: id,
				}
			}),
			AllRecipesUsers.destroy({
				where: {
					user_id: id,
				}
			}),

		])

		res.status(200).send({});
	} catch(e) {
		console.error(e);
		res.status(500).send({});
	}
}

export default withSessionRoute(route);

