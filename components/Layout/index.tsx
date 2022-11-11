import * as React from 'react';
import Box from '@mui/material/Box';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import { styled } from '@mui/material/styles';

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

export default function Layout(props: any) {
	return (
		<Box sx={{ display: 'flex' }}>
			<Navbar />
			<Sidebar />
			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<DrawerHeader />
				{props.children ? props.children : undefined}
			</Box>
		</Box>
	);
}
