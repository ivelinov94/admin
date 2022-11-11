import { User } from "@prisma/client";
import { User as UserResponse } from "../../../../lib/useUser";



export function transformUserForResponse(user: User): UserResponse {
	return {
		username: user.username,
		id: user.id,
		isLoggedIn: true,
		phone: user.phone,
	}
}
