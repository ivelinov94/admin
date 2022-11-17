
import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../lib/withSession";
import Hash from "../../../utils/Hash";
import login from "./helpers/Login";
import generateOtp, { sendOtp } from "./helpers/Otp";

async function generateRoute(req: NextApiRequest, res: NextApiResponse) {
	const { username, password } = req.body;

	if(!username || !password) {
		res.status(422);
		return res.json({
			error: "data missing",
			status: "failed",
		});
	}

	try {
		const hash = {
			comparePassword: Hash.comparePassword,
		};

		const user = await login({
			username,
			password,
			comparator: hash,
		});

		generateOtp({
			user
		}).then((res) => {
			const { code } = res;
			sendOtp({ code, user });
		});


		res.send({
			status: "ok",
		});
	} catch(e) {
		res.status(400);
		return res.json({ status :"failed"});
	}

};

export default withSessionRoute(generateRoute);

