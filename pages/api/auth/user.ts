// pages/api/user.ts

import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../lib/useUser";
import { withSessionRoute } from "../../../lib/withSession";

//
// This is where we specify the typings of req.session.*
declare module "iron-session" {
    interface IronSessionData {
        user?: User;
    }
}

function userRoute(req: NextApiRequest, res: NextApiResponse) {
	res.send({ user: req.session.user });
};

export default withSessionRoute(userRoute);
