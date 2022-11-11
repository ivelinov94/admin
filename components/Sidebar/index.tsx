
import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from "@mui/icons-material/Dashboard";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import WalletIcon from "@mui/icons-material/Wallet";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useDispatch, useSelector } from 'react-redux';
import { selectUiSidebarOpen, setSidebarToggle } from '../../store/uiSlice';
import { List } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
	({ theme, open }) => ({
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
		boxSizing: 'border-box',
		...(open && {
			...openedMixin(theme),
			'& .MuiDrawer-paper': openedMixin(theme),
		}),
		...(!open && {
			...closedMixin(theme),
			'& .MuiDrawer-paper': closedMixin(theme),
		}),
	}),
);

const menu = [
	{
		label: "Home",
		icon: <DashboardIcon />,
		isActive(routerAsPath: string) {
			return routerAsPath === "/";
		},
		slug: "/"
	},
	{
		label: "Administrators",
		icon: <SupervisorAccountIcon />,
		isActive(routerAsPath: string) {
			return routerAsPath === "/administrators";
		},
		slug: "/administrators"
	},
	{
		label: "Wallets",
		icon: <WalletIcon />,
		isActive(routerAsPath: string) {
			return routerAsPath === "/wallets";
		},
		slug: "/wallets"
	},
	{
		label: "Transactions",
		icon: <CompareArrowsIcon />,
		isActive(routerAsPath: string) {
			return routerAsPath === "/transactions";
		},
		slug: "/transactions"
	},
	{
		label: "Revenues",
		icon: <CardGiftcardIcon />,
		isActive(routerAsPath: string) {
			return routerAsPath === "/revenues";
		},
		slug: "/revenues"

	},
	{
		label: "SystemLogs",
		icon: <AvTimerIcon />,
		isActive(routerAsPath: string) {
			return routerAsPath === "/system_logs";
		},
		slug: "/system_logs",

	},
	{
		label: "Settings",
		icon: <SettingsIcon />,
		isActive(routerAsPath: string) {
			return routerAsPath === "/settings";
		},
		slug: "/settings",

	},
	{
		label: "Logout",
		icon: <PowerSettingsNewIcon />,
		isActive(routerAsPath: string) {
			return routerAsPath === "/logout";
		},
		slug: "/logout",
	},

];

export default function Sidebar() {
	const theme = useTheme();
	const router =  useRouter();
	const open = useSelector(selectUiSidebarOpen);
	const dispatch = useDispatch();

	const handleToggleSidebar = () => {
		dispatch(setSidebarToggle(!open))
	}

	return (
		<Drawer variant="permanent" open={open}>
			<DrawerHeader>
				{
					!open ? (
						<IconButton onClick={handleToggleSidebar} sx={{ margin: "auto" }}>
							<MenuIcon />
						</IconButton>
					) : (

						<IconButton onClick={handleToggleSidebar}>
							{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
						</IconButton>
					)
				}
			</DrawerHeader>
			<Divider />
			<List>
				{menu.map((menuItem) => (
					<ListItem key={menuItem.label} disablePadding sx={{ display: 'block' }}>
						<Link href={menuItem.slug as string}>
							<ListItemButton
								sx={{
									minHeight: 48,
									justifyContent: open ? 'initial' : 'center',
									px: 2.5,
								}}
								selected={menuItem.isActive(router.asPath)}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: open ? 3 : 'auto',
										justifyContent: 'center',
									}}
								>
									{menuItem.icon}
								</ListItemIcon>
								<ListItemText primary={menuItem.label} sx={{ opacity: open ? 1 : 0 }} />
							</ListItemButton>
						</Link>
					</ListItem>
				))}
			</List>
		</Drawer>
	);
}
