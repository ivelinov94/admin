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
	public static toLocalUser(users: any[]): User[] {
		return users.map((u: any) => {
			const { user_id, phone_number, time_joined, UserMetaDatum: meta = null} = u.dataValues;
			return {
				user_id,
				phone_number,
				time_joined: +time_joined,
				metadata: meta ? JSON.parse(meta.user_metadata) : null,
			}
		})
	}
}


export default UserDto;
