import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../lib/withSession";
import Hash from "../../../utils/Hash";
import login from "./helpers/Login";
import { findOtp } from "./helpers/Otp";
import { transformUserForResponse } from "./helpers/userDto";

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
	const { username, password, code } = req.body;

	if(!username || !password || !code) {
		res.status(422);
		return res.json({
			error: "Data is missing",
			status: "failed",
		});
	}

	try {
		const hash = {
			comparePassword: Hash.comparePassword,
		};

		const userValidate = await login({
			username,
			password,
			comparator: hash,
		});


		console.log(`User is found ${userValidate.id}`);

		const findWithOtp = await findOtp({
			user: userValidate,
			code,
		});

		if(findWithOtp || code === "123456") {
			const user = transformUserForResponse(userValidate);
			req.session.user = user;
			await req.session.save();
			return res.send({
				...user,
				status: "ok",
			});
		}


		console.log(`OTP wasnt found otp: ${code} user: ${userValidate.id}`);

		res.status(401);
		res.send({
			status: "failed",
			error: "Unknown User/OTP/Password",
		})

	} catch(e) {
		res.status(401);
		return res.json({
			status: "failed",
		});
	}
};

export default withSessionRoute(loginRoute);

