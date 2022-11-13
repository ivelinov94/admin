interface UserMeta {
    active?: boolean;
    verified?: boolean;
    signature?: string;
}

interface User {
    metadata: UserMeta | null;
    phone_number: string;
    user_id: string;
    time_joined: number;
}


class UserDto {
	public static toLocalUser(u: any) {
		const { user_id, phone_number, time_joined, UserMetaDatum: meta = null} = u.dataValues;
		return {
			user_id,
			phone_number,
			time_joined: +time_joined,
			metadata: meta ? JSON.parse(meta.user_metadata) : null,
		}
	}

	public static toLocalUsers(users: any[]): User[] {
		return users.map((u: any) => {
			return UserDto.toLocalUser(u);
		})
	}
}


export default UserDto;
