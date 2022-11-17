import { User } from "@prisma/client";
import otp from "otp-generator";
import prisma from "../../../../lib/Prisma";
import Twilio from "twilio";

interface Input {
	user: User;
}

export default async function generateOtp(input: Input): Promise<{ code: string }> {
	const { user } = input;
	const code = otp.generate(6, {  lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
	console.log(`OTP CODE: ${code}`);
	await prisma.confirmation.create({
		data: {
			code,
			userId: user.id,
		}
	});

	return { code };
}

interface SendOtpInput {
    user: User;
    code: string;
}

export async function sendOtp(input: SendOtpInput) {
	const { env } = process;
	const accountSid = env["TWILIO_ACCOUNT_SID"];
	const authToken = env["TWILIO_AUTH_TOKEN"];

	if (!(accountSid && authToken)) {
		throw new Error("Missing Twilio credentials");
	}
	const twilio = Twilio(accountSid, authToken);

	twilio.messages
		.create({
			body: `Your OTP is ${input.code}`,
			from: env["TWILIO_SENDER_NUMBER"],
			to: `+${input.user.phone}`,
		})
		.then(console.log)
		.catch(console.error);
}


interface FindInput extends Input {
	code: string;
}

export async function findOtp(input: FindInput): Promise<boolean> {
	const { user, code }	= input;

	const otp = await prisma.confirmation.findFirst({
		where: {
			code,
			userId: user.id,
		},
		orderBy: {
			createdAt: "desc",
		}
	});


	if(!otp) {
		return false;
	}


	cleanOtps({user}).then();

	return true;
}

async function cleanOtps(input: { user: User }): Promise<void> {
	const { user } = input;

	prisma.confirmation.deleteMany({
		where: {
			userId: user.id,
		}
	}).then(() => {
		console.log(`User otps deleted`);
	}).catch((e) => {
		console.error(e);
	})

}

