// pages/api/user.ts

import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../lib/useUser";
import { withSessionRoute } from "../../../lib/withSession";
import Administrator from "../../../modules/Administrator";

//
// This is where we specify the typings of req.session.*
declare module "iron-session" {
    interface IronSessionData {
        user?: User;
    }
}

async function userRoute(req: NextApiRequest, res: NextApiResponse) {
	const { user } = req.session;

	if(!user) {
		return res.status(401).send({});
	}

	const repo = new Administrator();
	const userDB = await repo.findById(user?.id);

	if(!userDB) {
		return res.status(401).send({});
	}

	res.send({ user: req.session.user });
};

export default withSessionRoute(userRoute);
