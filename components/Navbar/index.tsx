import React from "react";
import Image from "next/image";
import { Avatar, Box, IconButton, Menu, MenuItem, styled, Toolbar, Tooltip, Typography } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectAuthUser } from "../../store/authSlice";
import Router, { useRouter } from "next/router";
import fetchJson from "../../lib/fetchJson";
import { selectUiSidebarOpen } from "../../store/uiSlice";

const pages = ['Products', 'Pricing', 'Blog'];

const settings = [
	{
		label: "Profile",
		action: null,
	},
	{
		label: "Change password",
		action: "Password",
	},
	{
		label: "Logout",
		action: "Logout",
	}
];

const drawerWidth = 240;
const closedDrawer = 65;

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
	isLogin?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open, isLogin = false }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	marginLeft: closedDrawer,
	width: isLogin ? "100%" : `calc(100% - ${closedDrawer}px)`,
	paddingRight: "60px",
	boxShadow: "0px 1px 2px 0px rgb(0 0 0 / 20%)",
	...(open && !isLogin && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

type Props = {
	isLogin?: boolean;
}

const Navbar = (props: Props) => {
	const user = useSelector(selectAuthUser);
	const open = useSelector(selectUiSidebarOpen);
	const dispatch = useDispatch();
	const router = useRouter();
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};


	const handleCloseUserMenu = async (e: typeof settings[0]) => {
		setAnchorElUser(null);
		switch (e.action) {
			case "Logout":
				Router.push("/logout");
			case "Password":
				Router.push("/change_password");
				break;
			default:
				break;
		}
	};

	return (
		<AppBar position="fixed" open={open} isLogin={props.isLogin || false} color="transparent">
			<Toolbar >
				<Box display="flex" alignItems="center">
					<Image src="/images/logo.svg" width="50" height="50" />
					<Box width="20px" />
					<Image src="/images/logo_text.svg" width="200" height="24" style={{ marginLeft: "10px" }} />
				</Box>

				<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
				</Box>

				{
					user && (
						<Box sx={{ flexGrow: 0 }}>
							<Tooltip title="Open settings">
								<Box onClick={handleOpenUserMenu}>
									<IconButton sx={{ p: 0, marginRight: "10px" }}>
										<Avatar alt={user.username} sx={{ textTransform: "uppercase" }}>{user.username.slice(0, 1)}</Avatar>
									</IconButton>
									{user.username}
								</Box>
							</Tooltip>
							<Menu
								sx={{ mt: '45px' }}
								id="menu-appbar"
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								{settings.map((setting) => (
									<MenuItem key={setting.label} onClick={() => handleCloseUserMenu(setting)}>
										<Typography textAlign="center">{setting.label}</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
					)
				}

			</Toolbar>
		</AppBar>
	);
}

export default Navbar;
