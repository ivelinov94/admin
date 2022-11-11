import { NextApiRequest, NextApiResponse } from "next";
import { UpdateAdministratorRequest } from "../../../../interface";
import { withSessionRoute } from "../../../../lib/withSession";
import Administrator from "../../../../modules/Administrator";
import AdministratorDTO from "../../../../modules/AdministratorDTO";

async function updateRoute(req: NextApiRequest, res: NextApiResponse) {
	const { name, phone } = req.body as UpdateAdministratorRequest;
	const { id } = req.query;

	if(!id || req.method !== "PUT") {
		res.status(404).send({});
		return;
	}

	if(!name || !phone) {
		res.status(422).send({
			message: "Invalid information"
		});

		return;
	}

	const administratorRepo = new Administrator();
	const user = await administratorRepo.findById(+id);

	if(!user) {
		res.status(401).send({
			message: "User doesnt exists",
		});
		return;
	}

	const dto = new AdministratorDTO();

	const updateUser = dto.updateUser(user, req.body);

	try {
		const updatedUser = await administratorRepo.update({
			...updateUser,
		});

		res.status(200).json({
			...updatedUser,
		});

	} catch(e) {
		console.error(e);
		res.status(500).json({
			message: "Problem",
		})
	}
};

export default withSessionRoute(updateRoute);
