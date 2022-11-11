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
