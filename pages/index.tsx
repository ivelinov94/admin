import { Typography } from '@mui/material';
import type { GetServerSidePropsContext, NextPage } from 'next'
import Layout from '../components/Layout';
import { withSessionSsr } from '../lib/withSession';
import { User, UserMetaData } from '../modules/User';
import UserDto from '../modules/UserDto';
import { setAuthState, setAuthUser } from '../store/authSlice';
import { AppStore, wrapper } from '../store/store';

const Home: NextPage = () => {
	return (
		<Layout >
			<Typography>Dashboard</Typography>
		</Layout>
	)
}

const getProps = async (context: GetServerSidePropsContext, store: AppStore) => {
	const { req } = context;
	const user = req.session?.user || null;

	store.dispatch(setAuthUser(user || undefined));
	store.dispatch(setAuthState(!!user));

	const users = await User.findAll({ include: UserMetaData });

	if(!user) {
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
			users: UserDto.toLocalUser(users)
		},
	};
}



export const getServerSideProps = wrapper.getServerSideProps((store) => {
	return withSessionSsr((context) => getProps(context, store));
});

export default Home;
