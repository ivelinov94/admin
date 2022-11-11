import { NextApiRequest, NextApiResponse } from "next";
import { UpdateAdministratorPasswordRequest } from "../../../../interface";
import { withSessionRoute } from "../../../../lib/withSession";
import Administrator from "../../../../modules/Administrator";
import Hash from "../../../../utils/Hash";

async function updatePasswordRoute(req: NextApiRequest, res: NextApiResponse) {
	const { old_password, new_password, confirm_new} = req.body as UpdateAdministratorPasswordRequest;
	const { id } = req.query;

	if(!id || req.method !== "PUT") {
		res.status(404).send({});
		return;
	}

	if(!old_password || !new_password || !confirm_new) {
		res.status(422).send({
			message: "Invalid information"
		});

		return;
	}

	const isSame = new_password === confirm_new;

	if(!isSame){
		res.status(422).send({
			message: "Invalid information"
		});

		return;
	}

	const administratorRepo = new Administrator();
	const user = await administratorRepo.findByIdExtended(+id);

	if(!user) {
		res.status(401).send({
			message: "User doesnt exists",
		});
		return;
	}

	const oldPasswordMatch = await Hash.comparePassword(old_password, user);

	if(!oldPasswordMatch) {
		res.status(422).send({
			message: "Invalid information"
		});

		return;
	}

	try {
		const hashPassword = await Hash.createPassword(new_password);
		const updatedUser = await administratorRepo.updatePassword(hashPassword, user);
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

export default withSessionRoute(updatePasswordRoute);
