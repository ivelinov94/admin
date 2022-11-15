import type { NextPage } from 'next'
import Router, { useRouter } from "next/router";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import fetchJson from '../../lib/fetchJson';
import { logoutUser } from '../../store/authSlice';

const Logout: NextPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(logoutUser());
        fetchJson("/api/auth/logout").then(() => {
            console.log(`user logged out`);
        })
        router.replace("/login");
    }, []);

    return (
        <Layout></Layout>
    )
}

export default Logout;
