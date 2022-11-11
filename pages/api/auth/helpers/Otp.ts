import { User } from "@prisma/client";
import otp from "otp-generator";
import prisma from "../../../../lib/Prisma";

interface Input {
	user: User;
}

export default async function generateOtp(input: Input): Promise<void> {
	const { user } = input;
	const code = otp.generate(6, {  lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
	console.log(`OTP CODE: ${code}`);
	await prisma.confirmation.create({
		data: {
			code,
			userId: user.id,
		}
	});
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

