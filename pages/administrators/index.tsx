import { User as Administrator } from '.prisma/client';
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import type { GetServerSidePropsContext, NextPage } from 'next'
import { useState } from 'react';
import Router from "next/router";
import Layout from '../../components/Layout';
import fetchJson, { FetchError } from '../../lib/fetchJson';
import { User } from '../../lib/useUser';
import { withSessionSsr } from '../../lib/withSession';
import { setAuthState, setAuthUser } from '../../store/authSlice';
import { AppStore, wrapper } from '../../store/store';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Create';

type Props = {
	administrators: Administrator[],
	user: User;
}

const Administrators: NextPage<Props> = (props: Props) => {
	const [administrators, setAdministrators] = useState<Administrator[]>(props.administrators);

	const handleDelete = async (administrator: any) => {
		try {
			await fetchJson(`api/administrators/delete/${administrator.id}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" }
			});
		} catch (error) {
			if (error instanceof FetchError) {
				console.log(error);
			} else {
				console.error("An unexpected error happened:", error);
			}
		}
	}

	return (
		<Layout>
			<Typography>Administrators</Typography>
			<Button color="success" variant="contained" onClick={() => {
				Router.push("/administrators/add");
			}}>
				Add New
			</Button>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>id</TableCell>
							<TableCell align="right">Username</TableCell>
							<TableCell align="right">Phone</TableCell>
							<TableCell align="right">Name</TableCell>
							<TableCell align="right">Created At</TableCell>
							<TableCell align="right">Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{administrators.map((row) => (
							<TableRow
								key={row.id}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell component="th" scope="row">
									{row.id}
								</TableCell>
								<TableCell align="right">{row.username}</TableCell>
								<TableCell align="right">{row.phone}</TableCell>
								<TableCell align="right">{row.name}</TableCell>
								<TableCell align="right">{row.createdAt.toString()}</TableCell>
								<TableCell align="right">
									<IconButton color="warning" aria-label="edit">
										<EditIcon />
									</IconButton>
									<IconButton color="error" aria-label="delete" onClick={async () => {
										const filteredArray = administrators.filter((administrator) => {
											return administrator.id !== row.id;
										});
										await handleDelete(row);
										setAdministrators(filteredArray);
									}}>
										<DeleteIcon />
									</IconButton>
								</TableCell>
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

	const data = await fetchJson<{ data: User[] }>("http://localhost:3000/api/administrators", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	return {
		props: {
			user,
			administrators: data.data,
		},
	};
}

export const getServerSideProps = wrapper.getServerSideProps((store) => {
	return withSessionSsr((context) => getProps(context, store));
});

export default Administrators;
