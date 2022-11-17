import { Box, CardMedia, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { User } from '@prisma/client';
import type { GetServerSidePropsContext, NextPage } from 'next'
import Router, { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import fetchJson from '../../lib/fetchJson';
import { withSessionSsr } from '../../lib/withSession';
import { setAuthState, setAuthUser } from '../../store/authSlice';
import { AppStore, wrapper } from '../../store/store';

const Wallet: NextPage = () => {
    const [wallet, setWallet] = useState<any>();
    const router = useRouter();
    const data = router.query;

    const getWallet = async () => {
        const result = await fetchJson<{ data: User[] }>(`http://localhost:3000/api/wallets/${data.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        setWallet(result);
    }

    useEffect(() => {
        getWallet();
    }, []);

    return (
        <Layout>
            <KeyboardArrowLeftIcon cursor="pointer" onClick={() => {
                Router.push("/wallets");
            }} />
            <Typography variant="h6" marginBottom="20px">Wallet</Typography>
            <Box display="flex">
                <Typography marginBottom="20px" marginRight="20px">User id: {wallet?.user?.user_id}</Typography>
                <Typography marginBottom="20px">Phone number: {wallet?.user?.phone_number}</Typography>
            </Box>
            <Box marginBottom="20px">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Device Id</TableCell>
                                <TableCell>Key Id</TableCell>
                                <TableCell>Public Key</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {wallet?.devices?.map((row: any) => (
                                <TableRow
                                    key={row.id}
                                >
                                    <TableCell>{row.deviceId}</TableCell>
                                    <TableCell>{row.keyId}</TableCell>
                                    <TableCell style={{ whiteSpace: 'normal', wordBreak: 'break-word', width: '70%' }}>{row.publicKey.substring(26, row.publicKey.length - 25)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Typography marginBottom="20px">Signature</Typography>
            <CardMedia component='img' src={`data:image/png;base64, ${wallet?.user?.metadata?.signature}`} />
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

export const getServerSideProps = wrapper.getServerSideProps((store) => {
    return withSessionSsr((context) => getProps(context, store));
});

export default Wallet;
