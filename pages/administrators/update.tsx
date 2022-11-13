import { Typography } from '@mui/material';
import type { GetServerSidePropsContext, NextPage } from 'next'
import Layout from '../../components/Layout';
import { withSessionSsr } from '../../lib/withSession';
import { setAuthState, setAuthUser } from '../../store/authSlice';
import { AppStore, wrapper } from '../../store/store';


const UpdateAdministrator: NextPage = () => {
	return (
		<Layout>
			<Typography>Update Administrator</Typography>
		</Layout>
	)
}

const getProps = async (context: GetServerSidePropsContext, store: AppStore) => {
	const { req } = context;
	const user = req.session?.user || null;

	store.dispatch(setAuthUser(user || undefined));
	store.dispatch(setAuthState(!!user));


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
		},
	};
}

export const getServerSideProps = wrapper.getServerSideProps((store) => {
	return withSessionSsr((context) => getProps(context, store));
});

export default UpdateAdministrator;
