import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import type { NextPage } from 'next'
import Router from "next/router";
import Layout from '../../components/Layout';
import { object, string, TypeOf } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import fetchJson, { FetchError } from '../../lib/fetchJson';
import { CreateAdministratorRequest } from '../../interface';

const administratorSchema = object({
	username: string()
		.min(1, 'Username is required'),
	password: string()
		.min(1, 'Password is required'),
	name: string()
		.min(1, 'Name is required'),
	phone: string()
		.min(1, 'Phone number is required').regex(/^[0-9]*$/, "Phone number can only contain digits"),

});

type AdministratorInput = TypeOf<typeof administratorSchema>;

const CreateAdministrator: NextPage = () => {
	const [errorMsg, setErrorMsg] = useState("");
	const {
		register,
		formState: { errors, isSubmitSuccessful },
		reset,
		handleSubmit,
	} = useForm<AdministratorInput>({
		resolver: zodResolver(administratorSchema),
	});

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset();
		}
	}, [isSubmitSuccessful, reset]);

	const handleCreate = async (body: any) => {
		try {
			await fetchJson<CreateAdministratorRequest>("/api/administrators/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			Router.push("/administrators");
		} catch (error) {
			setErrorMsg("An error occured");
			if (error instanceof FetchError) {
				console.log(error);
			} else {
				console.error("An unexpected error happened:", error);
			}
		}
	}

	const onSubmitHandler: SubmitHandler<AdministratorInput> = async (values) => {
		const body = {
			...values
		};
		await handleCreate(body);
	};

	return (
		<Layout>
			<Typography marginBottom="20px">Create Administrator</Typography>
			{
				errorMsg && (

					<Box marginBottom="20px">
						<Alert severity="error">{errorMsg}</Alert>
					</Box>
				)
			}
			<Box
				component='form'
				noValidate
				autoComplete='off'
				onSubmit={handleSubmit(onSubmitHandler)}
			>
				<Box marginBottom="20px">
					<TextField
						required
						label="Username"
						placeholder="Enter a username"
						fullWidth={true}
						error={!!errors['username']}
						helperText={errors['username'] ? errors['username'].message : ''}
						{...register('username')}
					/>
				</Box>
				<Box marginBottom="20px">
					<TextField
						required
						label="Password"
						placeholder="Enter a password"
						fullWidth={true}
						type="password"
						error={!!errors['password']}
						helperText={errors['password'] ? errors['password'].message : ''}
						{...register('password')}
					/>
				</Box>
				<Box marginBottom="20px">
					<TextField
						required
						label="Name"
						placeholder="Enter your name"
						fullWidth={true}
						error={!!errors['name']}
						helperText={errors['name'] ? errors['name'].message : ''}
						{...register('name')}
					/>
				</Box>
				<Box marginBottom="20px">
					<TextField
						required
						label="Phone number"
						placeholder="Enter your phone number"
						fullWidth={true}
						error={!!errors['phone']}
						helperText={errors['phone'] ? errors['phone'].message : ''}
						{...register('phone')}
					/>
				</Box>
				<Box marginBottom="20px">
					<Button variant="contained" type="submit">Create</Button>
				</Box>
			</Box>
		</Layout>
	)
}

export default CreateAdministrator;
