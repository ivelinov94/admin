import { UpdateAdministratorRequest } from "../interface";
import { AdministratorType, AdministratorUpdateType } from "./Administrator";



class AdministratorDTO {
	public updateUser(user: AdministratorType, requestBody: UpdateAdministratorRequest): AdministratorUpdateType {
		const { phone, name } = requestBody;
		const update = {
			id: user.id,
			username: user.username,
			phone: phone && phone !== user.phone ? phone : user.phone,
			name: name && name !== user.name ? name : user.name,
		};
		return update;
	}
}


export default AdministratorDTO;
