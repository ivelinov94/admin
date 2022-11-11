import { User } from "@prisma/client";
import bcrypt from "bcrypt";

const SALT_ROUND = 10;
class Hash {
	static async comparePassword(password: string, user: User): Promise<boolean> {
		try {
			return bcrypt.compare(password, user.password);
		} catch(e) {
			console.error(e);
			return false;
		}
	}

    static async createPassword(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUND);
    }
}


export default Hash;
