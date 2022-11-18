
import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../lib/withSession";
import Administrator from "../../../modules/Administrator";

async function indexRoute(_req: NextApiRequest, res: NextApiResponse) {
	if (_req.method !== "GET") {
		return res.status(404).json({});
	}

	const administratorRepo = new Administrator();
	const data = await administratorRepo.list();
	res.status(200).json({
		data
	});
};

export default withSessionRoute(indexRoute);
