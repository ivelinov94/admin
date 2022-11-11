import { NextApiRequest, NextApiResponse } from "next";
import { CreateAdministratorRequest } from "../../../interface";
import { withSessionRoute } from "../../../lib/withSession";
import Administrator from "../../../modules/Administrator";
import Hash from "../../../utils/Hash";

async function createRoute(req: NextApiRequest, res: NextApiResponse) {
	const { username, password, name, phone } = req.body as CreateAdministratorRequest;

	if(req.method !== "POST") {
		res.status(404).send({});
		return;
	}

	if(!username || !password || !name || !phone) {
		res.status(422).send({
			message: "Invalid information"
		});

		return;
	}

	const administratorRepo = new Administrator();
	const user = await administratorRepo.findUserByUsername(username);

	if(user) {
		res.status(401).send({
			message: "User already exists",
		});
		return;
	}

	try {
		const hashedPassword = await Hash.createPassword(password);
		const createdUser = await administratorRepo.create({
			...req.body,
			password: hashedPassword,
		});

		res.status(200).json({
			...createdUser,
		});

	} catch(e) {
		console.error(e);
		res.status(500).json({
			message: "Problem",
		})
	}
};

export default withSessionRoute(createRoute);
