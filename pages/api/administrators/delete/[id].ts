import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../../lib/withSession";
import Administrator from "../../../../modules/Administrator";

async function deleteRoute(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	if(!id || req.method !== "DELETE") {
		res.status(404).send({});
		return;
	}

	const administratorRepo = new Administrator();
	const user = await administratorRepo.findById(+id);

	if(!user || user.id === 1) {
		res.status(401).send({
			message: "User doesnt exists",
		});
		return;
	}

	try {
		await administratorRepo.delete(+id);
		res.status(200).json({});
	} catch(e) {
		console.error(e);
		res.status(500).json({
			message: "Problem",
		})
	}
};

export default withSessionRoute(deleteRoute);
