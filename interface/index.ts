export interface CreateAdministratorRequest {
    username: string;
    password: string;
    name: string;
    phone: string;
}

export interface UpdateAdministratorRequest {
    name: string;
    phone: string;
}


export interface UpdateAdministratorPasswordRequest {
    old_password: string;
    new_password: string;
    confirm_new: string;
}
