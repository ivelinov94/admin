import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import type { GetServerSidePropsContext, NextPage } from 'next'
import Router from "next/router";
import { useState } from 'react';
import Layout from '../../components/Layout';
import fetchJson from '../../lib/fetchJson';
import { User } from '../../lib/useUser';
import { withSessionSsr } from '../../lib/withSession';
import { setAuthState, setAuthUser } from '../../store/authSlice';
import { AppStore, wrapper } from '../../store/store';
import styles from '../../styles/wallets/wallets.module.css'
import { debounce } from '../../utils/utils';

type Props = {
	wallets: any,
	user: User;
}

const Wallets: NextPage<Props> = (props: Props) => {
	const [wallets, setWallets] = useState<any[]>(props.wallets.users);


	const handleSearch = async (event: any) => {
		event.preventDefault();
		const searchTerm = event.target.value;
		const filteredWallets = await fetchJson<{ users: any }>(`http://localhost:3000/api/wallets?phone=${searchTerm}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		filteredWallets.users.forEach((user: any) => {
			user.time_joined = new Date(user.time_joined).toDateString();
		});
		setWallets(filteredWallets.users);
	};

	const debouncedHandleSearch = debounce(handleSearch, 300);

	return (
		<Layout>
			<Box className={styles.pageHeader}>
				<Typography alignSelf="center">Wallets</Typography>
				<TextField
					placeholder="Search"
					name="search"
					onChange={debouncedHandleSearch}
				/>
			</Box>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>User Id</TableCell>
							<TableCell>Phone</TableCell>
							<TableCell>Time Joined</TableCell>
							<TableCell>Active</TableCell>
							<TableCell>Verified</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{wallets?.map((row) => (
							<TableRow
								style={{ cursor: 'pointer' }}
								key={row.id}
								onClick={() => {
									Router.push(`/wallets/${row.user_id}`);
								}}
							>
								<TableCell>{row.user_id}</TableCell>
								<TableCell>{row.phone_number}</TableCell>
								<TableCell>{row.time_joined.toString()}</TableCell>
								<TableCell>{row.metadata ? `${row.metadata.active}` : 'false'}</TableCell>
								<TableCell>{row.metadata ? `${row.metadata.verified}` : 'false'}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
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

	const data = await fetchJson<{ users: any }>("http://localhost:3000/api/wallets", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	data.users.forEach((user: any) => {
		user.time_joined = new Date(user.time_joined).toDateString();
	});

	return {
		props: {
			user,
			wallets: data,
		},
	};
}

export const getServerSideProps = wrapper.getServerSideProps((store) => {
	return withSessionSsr((context) => getProps(context, store));
});

export default Wallets;
