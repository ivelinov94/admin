
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material'
import type { GetServerSidePropsContext, NextApiRequest, NextPage } from 'next'
import Navbar from '../../components/Navbar'
import Image from "next/image";
import fetchJson, { FetchError } from '../../lib/fetchJson';
import useUser, { User } from '../../lib/useUser';
import { withSessionSsr } from "../../lib/withSession";
import { useEffect, useState } from 'react';
import { object, string, TypeOf } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = object({
	username: string()
		.min(1, 'Username is required'),
	password: string()
		.min(1, 'Password is required'),

});

const otpSchema = object({
	code: string()
		.min(1, 'Verification code is required'),
});

type LoginInput = TypeOf<typeof loginSchema>;
type OtpInput = TypeOf<typeof otpSchema>;

const Login: NextPage = () => {
	// here we just check if user is already logged in and redirect to profile
	const { mutateUser } = useUser({
		redirectTo: "/",
		redirectIfFound: true,
	});

	const [errorMsg, setErrorMsg] = useState("");
	const [isGenerated, setIsGenerated] = useState(false);
	const [userData, setUserData] = useState<any>();

	const {
		register,
		formState: { errors, isSubmitSuccessful },
		reset,
		handleSubmit,
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
	});

	const {
		register: registerOtp,
		formState: { errors: errorsOtp, isSubmitSuccessful: isSubmitSuccessfulOtp },
		reset: resetOtp,
		handleSubmit: handleSubmitOtp,
	} = useForm<OtpInput>({
		resolver: zodResolver(otpSchema),
	});

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset();
		}
	}, [isSubmitSuccessful, reset]);

	useEffect(() => {
		if (isSubmitSuccessfulOtp) {
			resetOtp();
		}
	}, [isSubmitSuccessfulOtp, resetOtp]);

	const handleGenerate = async (body: any) => {
		fetchJson("/api/auth/generate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		}).then(() => {
			setIsGenerated(true);
			setErrorMsg("");
		}).catch(() => {
			setErrorMsg("User/password not found");
		});
	}

	const handleLogin = async (body: any) => {
		try {
			const user = fetchJson<User>("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			// trick mutate user the user is still a promise, otherwise is failing to redirect and refresh the page
			await user;
			mutateUser(
				user,
				false,
			);
		} catch (error) {
			setErrorMsg("User/password/code not found");
			if (error instanceof FetchError) {
				console.log(error);
			} else {
				console.error("An unexpected error happened:", error);
			}
		}
	}

	const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
		const body = {
			username: values.username,
			password: values.password,
		};
		setUserData(body);
		handleGenerate(body);
	};

	const onSubmitHandlerOtp: SubmitHandler<OtpInput> = (values) => {
		const body = {
			...userData,
			code: values.code,
		};
		handleLogin(body);
	};

	return (
		<div>
			<Navbar isLogin={true} />
			<Container maxWidth="xl">
				<Box display="flex" alignItems="center" paddingTop="60px">
					<Box flex="1">
						<Box marginBottom="50px">
							<Typography variant="h3" >Account Login</Typography>
						</Box>
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
									placeholder="Enter your username"
									fullWidth={true}
									error={!!errors['username']}
									helperText={errors['username'] ? errors['username'].message : ''}
									disabled={isGenerated}
									{...register('username')}
								/>
							</Box>
							<Box marginBottom="20px">
								<TextField
									required
									label="Password"
									placeholder="Enter your password"
									fullWidth={true}
									type="password"
									error={!!errors['password']}
									helperText={errors['password'] ? errors['password'].message : ''}
									{...register('password')}
									disabled={isGenerated}
								/>
							</Box>
							<Box marginBottom="40px">
								<Button variant="contained" type="submit" disabled={isGenerated}>Send code by SMS</Button>
							</Box>
						</Box>
						<Box
							component='form'
							noValidate
							autoComplete='off'
							onSubmit={handleSubmitOtp(onSubmitHandlerOtp)}
						>
							<Box marginBottom="20px">
								<TextField
									required
									label="Verification Code"
									placeholder="Enter the code  you got by SMS"
									error={!!errorsOtp['code']}
									helperText={errorsOtp['code'] ? errorsOtp['code'].message : ''}
									{...registerOtp('code')}
									fullWidth={true}
									disabled={!isGenerated}
								/>
							</Box>
							<Box marginBottom="20px">
								<Button variant="contained" type="submit" disabled={!isGenerated}>Login</Button>
							</Box>
						</Box>
					</Box>

					<Box flex="1">
						<Image src="/images/login_background.svg" width="728" height="650" />
					</Box>
				</Box>
			</Container>
		</div>
	)
}

const getProps = (context: GetServerSidePropsContext) => {
	const { req } = context;
	const user = req.session?.user || null;

	if (user) {
		return {
			redirect: {
				permanent: false,
				destination: `/`
			},
		}
	}

	return {
		props: {
			user,
		},
	};
}



export const getServerSideProps = withSessionSsr(getProps);

export default Login
