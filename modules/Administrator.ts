import { PrismaClient, User } from "@prisma/client";
import { CreateAdministratorRequest } from "../interface";
import prisma from "../lib/Prisma";

export const selectablePropertiesAdministrator = {
	id: true,
	createdAt: true,
	name: true,
	phone: true,
	username: true,
	updatedAt: true,
}

export type AdministratorType = Omit<User, "password"> & {
}

export type AdministratorUpdateType = Omit<AdministratorType, "createdAt" | "updatedAt" | "username">;

class Administrator {
	private prisma: PrismaClient;

	constructor(prismaClient: PrismaClient = prisma) {
		this.prisma = prismaClient;
	}

	public findUserByUsername(username: string): Promise<AdministratorType | null> {
		return this.prisma.user.findUnique({
			where: {
				username,
			},
			select: selectablePropertiesAdministrator,
		});
	}

	public findByIdExtended(id: number): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: {
				id,
			},
		});
	}

	public findById(id: number): Promise<AdministratorType | null> {
		return this.prisma.user.findUnique({
			where: {
				id,
			},
			select: selectablePropertiesAdministrator,
		});
	}

	public create({ phone, name, password, username}: CreateAdministratorRequest): Promise<AdministratorType> {
		return this.prisma.user.create({
			data: {
				phone,
				name,
				password,
				username,
			},
			select: selectablePropertiesAdministrator,
		})
	}

	public update(user: AdministratorUpdateType): Promise<AdministratorType> {
		return this.prisma.user.update({
			data: {
				...user,
			},
			select: selectablePropertiesAdministrator,
			where: {
				id: user.id,
			},
		})
	}

	public updatePassword(hashedPassword: string, user: User): Promise<AdministratorType> {
		return this.prisma.user.update({
			data: {
				password: hashedPassword,
			},
			select: selectablePropertiesAdministrator,
			where: {
				id: user.id,
			},
		})
	}

	public list(): Promise<AdministratorType[]> {
		return this.prisma.user.findMany({
			orderBy: {
				createdAt: "desc"
			},
			select: selectablePropertiesAdministrator,
		});
	}

	public delete(id: number) {
		return this.prisma.user.delete({
			where: {
				id,
			}
		})
	}
}

export default Administrator;
