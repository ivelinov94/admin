import { Box, Card, Typography } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import type { GetServerSidePropsContext, NextPage } from 'next'
import Layout from '../components/Layout';
import { withSessionSsr } from '../lib/withSession';
import { setAuthState, setAuthUser } from '../store/authSlice';
import { AppStore, wrapper } from '../store/store';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const Home: NextPage = () => {
	const optionsMonth = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: 'Transactions over the last month',
			},
		},
		cubicInterpolationMode: 'monotone',
	};

	const labelsMonth = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

	const dataMonth = {
		labels: labelsMonth,
		datasets: [
			{
				label: 'Transactions for November',
				data: [7000, 10000, 8500, 11000],
				borderColor: 'rgb(75, 192, 192)',
				segment: {
					borderColor: (ctx: any) => ctx.p0.parsed.y > ctx.p1.parsed.y ? 'rgb(192,75,75)' : undefined,
				},
			},
		],
	};

	const optionsYear = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: 'Transactions over the last year',
			},
		},
		cubicInterpolationMode: 'monotone',
	};

	const labelsYear = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	const dataYear = {
		labels: labelsYear,
		datasets: [
			{
				label: 'Transactions for 2022',
				data: [30000, 40000, 50000, 42000, 48000, 46000, 49000, 53000, 55000, 52000, 54000, 56000],
				borderColor: 'rgb(75, 192, 192)',
				segment: {
					borderColor: (ctx: any) => ctx.p0.parsed.y > ctx.p1.parsed.y ? 'rgb(192,75,75)' : undefined,
				},
			},
		],
	};

	return (
		<Layout>
			<Typography variant='h3' marginBottom="20px">Dashboard</Typography>
			<Box style={{ display: 'flex', justifyContent: 'center' }}>
				<Card sx={{ width: '25%' }} style={{ padding: 10, margin: 10 }}>
					<Box>
						<Typography variant='h5' marginBottom="10px" textAlign='center'>
							Total Users
						</Typography>
						<Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<PeopleAltIcon />
							<Typography variant='h6' marginLeft="10px">
								1234
							</Typography>
						</Box>
					</Box>
				</Card>
				<Card sx={{ width: '25%' }} style={{ padding: 10, margin: 10 }}>
					<Box>
						<Typography variant='h5' marginBottom="10px" textAlign='center'>
							New Users Last Month
						</Typography>
						<Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<PersonAddIcon />
							<Typography variant='h6' marginLeft="10px">
								1234
							</Typography>
						</Box>
					</Box>
				</Card>
				<Card sx={{ width: '25%' }} style={{ padding: 10, margin: 10 }}>
					<Box>
						<Typography variant='h5' marginBottom="10px" textAlign='center'>
							Total Transactions
						</Typography>
						<Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<AttachMoneyIcon />
							<Typography variant='h6'>
								1234
							</Typography>
						</Box>
					</Box>
				</Card>
				<Card sx={{ width: '25%' }} style={{ padding: 10, margin: 10 }}>
					<Box>
						<Typography variant='h5' marginBottom="10px" textAlign='center'>
							Total Transactions Last Month
						</Typography>
						<Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<AttachMoneyIcon />
							<Typography variant='h6'>
								1234
							</Typography>
						</Box>
					</Box>
				</Card>
			</Box>
			<Box style={{ display: 'flex' }}>
				<Card sx={{ width: '75%' }} style={{ padding: 10, margin: 10 }}>
					<Box height={400} width="100%">
						<Line options={optionsYear} data={dataYear} />
					</Box>
				</Card>
				<Card sx={{ width: '25%' }} style={{ padding: 10, margin: 10 }}>
					<Box height={400} width="100%">
						<Line options={optionsMonth} data={dataMonth} />
					</Box>
				</Card>
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



export const getServerSideProps = wrapper.getServerSideProps((store: any) => {
	return withSessionSsr((context) => getProps(context, store));
});

export default Home;
