import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import type { GetServerSidePropsContext, NextPage } from 'next'
import Router from "next/router";
import Layout from '../../components/Layout';
import { withSessionSsr } from '../../lib/withSession';
import { setAuthState, setAuthUser } from '../../store/authSlice';
import { AppStore, wrapper } from '../../store/store';
import { object, string, TypeOf } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '../../lib/useUser';
import { useEffect, useState } from 'react';
import fetchJson, { FetchError } from '../../lib/fetchJson';
import { UpdateAdministratorPasswordRequest } from '../../interface';

const passwordSchema = object({
	old_password: string()
		.min(1, 'Old password is required'),
	new_password: string()
		.min(1, 'New password is required'),
	confirm_new: string()
		.min(1, 'Confirm password is required'),
}).refine((data) => data.new_password === data.confirm_new, {
	path: ['confirm_new'],
	message: 'Passwords do not match',
});

type PasswordInput = TypeOf<typeof passwordSchema>;

type Props = {
	user: User;
}

const ChangePassword: NextPage<Props> = (props: Props) => {
	const [errorMsg, setErrorMsg] = useState("");
	const {
		register,
		formState: { errors, isSubmitSuccessful },
		reset,
		handleSubmit,
	} = useForm<PasswordInput>({
		resolver: zodResolver(passwordSchema),
	});

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset();
		}
	}, [isSubmitSuccessful, reset]);

	const handleChangePassword = async (body: any) => {
		try {
			await fetchJson<UpdateAdministratorPasswordRequest>(`/api/administrators/change_password/${props.user.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			Router.push("/");
		} catch (error) {
			if (error instanceof FetchError) {
				setErrorMsg(error.data.message);
				console.log(error);
			} else {
				setErrorMsg("An error occured");
				console.error("An unexpected error happened:", error);
			}
		}
	};

	const onSubmitHandler: SubmitHandler<PasswordInput> = async (values) => {
		const body = {
			...values
		};
		await handleChangePassword(body);
	};

	return (
		<Layout>
			<Typography marginBottom="20px">Change Password</Typography>
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
						label="Old Password"
						placeholder="Enter your old password"
						fullWidth={true}
						type="password"
						error={!!errors['old_password']}
						helperText={errors['old_password'] ? errors['old_password'].message : ''}
						{...register('old_password')}
					/>
				</Box>
				<Box marginBottom="20px">
					<TextField
						required
						label="New Password"
						placeholder="Enter your new password"
						fullWidth={true}
						type="password"
						error={!!errors['new_password']}
						helperText={errors['new_password'] ? errors['new_password'].message : ''}
						{...register('new_password')}
					/>
				</Box>
				<Box marginBottom="20px">
					<TextField
						required
						label="Confirm Password"
						placeholder="Confrim your new password"
						fullWidth={true}
						type="password"
						error={!!errors['confirm_new']}
						helperText={errors['confirm_new'] ? errors['confirm_new'].message : ''}
						{...register('confirm_new')}
					/>
				</Box>
				<Box marginBottom="20px">
					<Button variant="contained" type="submit">Change password</Button>
				</Box>
			</Box>
		</Layout>
	)
}

const getProps = async (context: GetServerSidePropsContext, store: AppStore) => {
	const { req } = context;
	const user = req.session?.user || null;

	store.dispatch(setAuthUser(user || undefined));
	store.dispatch(setAuthState(!!user));

	if (!user) {
		return {
			redirect: {
				permanent: false,
				destination: `/login`
			},
		}
	}

	return {
		props: {
			user,
		},
	};
}

export const getServerSideProps = wrapper.getServerSideProps((store) => {
	return withSessionSsr((context) => getProps(context, store));
});

export default ChangePassword;
