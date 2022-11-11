
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material'
import type { GetServerSidePropsContext, NextApiRequest, NextPage } from 'next'
import Navbar from '../../components/Navbar'
import Image from "next/image";
import fetchJson, { FetchError } from '../../lib/fetchJson';
import useUser, { User } from '../../lib/useUser';
import { withSessionSsr } from "../../lib/withSession";
import { useState } from 'react';

const Login: NextPage = () => {
	// here we just check if user is already logged in and redirect to profile
	const { mutateUser } = useUser({
		redirectTo: "/",
		redirectIfFound: true,
	});

	const [errorMsg, setErrorMsg] = useState("");
	const [isGenerated, setIsGenerated] = useState(false);

	const handleGenerate = async (event: any) => {
		const body = {
			username: event.currentTarget.username.value,
			password: event.currentTarget.password.value,
		};

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

	const handleSubmit = async (event: any) => {
		const body = {
			username: event.currentTarget.username.value,
			password: event.currentTarget.password.value,
			code: event.currentTarget.code.value,
		};

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


	const onSubmit = async (event: any) => {
		event.preventDefault();

		if(isGenerated) {
			return handleSubmit(event);
		}

		return handleGenerate(event);
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
						<form onSubmit={onSubmit}>
							<Box marginBottom="20px">
								<TextField
									required
									label="Username"
									placeholder="Enter your username"
									fullWidth={true}
									name="username"
									disabled={isGenerated}
								/>
							</Box>
							<Box marginBottom="20px">
								<TextField
									required
									label="Password"
									placeholder="Enter your password"
									fullWidth={true}
									type="password"
									name="password"
									disabled={isGenerated}
								/>
							</Box>
							<Box marginBottom="40px">
								<Button variant="contained" type="submit" disabled={isGenerated}>Send code by SMS</Button>
							</Box>
							<Box marginBottom="20px">
								<TextField
									required
									label="Verification Code"
									placeholder="Enter the code  you got by SMS"
									name="code"
									fullWidth={true}
									disabled={!isGenerated}
								/>
							</Box>
							<Box marginBottom="20px">
								<Button variant="contained" type="submit"  disabled={!isGenerated}>Login</Button>
							</Box>
						</form>
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

	if(user) {
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
