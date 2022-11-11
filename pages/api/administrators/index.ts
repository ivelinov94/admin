
import { NextApiRequest, NextApiResponse } from "next";
import Administrator from "../../../modules/Administrator";

async function listRoute(_req: NextApiRequest, res: NextApiResponse) {

    const administratorRepo = new Administrator();

	const data = await administratorRepo.list();
	res.status(200).json({
		data
	});
};

export default listRoute;
