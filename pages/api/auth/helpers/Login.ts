import { User } from "@prisma/client";
import prisma from "../../../../lib/Prisma";

interface LoginInput {
	username: string;
	password: string;
	comparator: { comparePassword: (password: string, user: User) => Promise<boolean>}
}

export default async function login(input: LoginInput): Promise<User> {
	const { username, password, comparator } = input;
	const user = await prisma.user.findUnique({
		where: {
			username,
		}
	});


	if(!user){
		throw new Error("Undefined user");
	}


	const isValidPwd = await comparator.comparePassword(password, user);

	if(!isValidPwd) {
		throw new Error("Wrong password");
	}


	return user;
}
