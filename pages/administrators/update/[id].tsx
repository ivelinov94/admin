import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { User } from '@prisma/client';
import type { GetServerSidePropsContext, NextPage } from 'next'
import Router, { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import fetchJson, { FetchError } from '../../../lib/fetchJson';
import { withSessionSsr } from '../../../lib/withSession';
import { AdministratorType } from '../../../modules/Administrator';
import { setAuthState, setAuthUser } from '../../../store/authSlice';
import { AppStore, wrapper } from '../../../store/store';
import { object, string, TypeOf } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateAdministratorRequest } from '../../../interface';

const administratorSchema = object({
    name: string()
        .min(1, 'Name is required'),
    phone: string()
        .min(1, 'Phone number is required').regex(/^[0-9]*$/, "Phone number can only contain digits"),

});

type Props = {
    administrators: AdministratorType[],
    user: User;
}

type AdministratorInput = TypeOf<typeof administratorSchema>;

const UpdateAdministrator: NextPage<Props> = (props: Props) => {
    const [administrator, setAdministrator] = useState<AdministratorType>();
    const [errorMsg, setErrorMsg] = useState("");
    const {
        register,
        formState: { errors, isSubmitSuccessful },
        reset,
        handleSubmit,
    } = useForm<AdministratorInput>({
        resolver: zodResolver(administratorSchema),
    });
    const router = useRouter();
    const data = router.query;

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);

    useEffect(() => {
        const id = data.id;
        const admin = props.administrators.find((a) => a.id.toString() === id);
        setAdministrator(admin);
    }, []);

    const handleUpdate = async (body: any) => {
        try {
            await fetchJson<UpdateAdministratorRequest>(`/api/administrators/update/${administrator?.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            Router.push("/administrators");
        } catch (error) {
            setErrorMsg("An error occured");
            if (error instanceof FetchError) {
                console.log(error);
            } else {
                console.error("An unexpected error happened:", error);
            }
        }
    }

    const onSubmitHandler: SubmitHandler<AdministratorInput> = async (values) => {
        const body = {
            ...values
        };
        await handleUpdate(body);
    };

    return (
        <Layout>
            <Typography marginBottom="20px">Update Administrator</Typography>
            {
                errorMsg && (

                    <Box marginBottom="20px">
                        <Alert severity="error">{errorMsg}</Alert>
                    </Box>
                )
            }
            {
                administrator && (
                    <Box
                        component='form'
                        noValidate
                        autoComplete='off'
                        onSubmit={handleSubmit(onSubmitHandler)}
                    >
                        <Box marginBottom="20px">
                            <Box marginBottom="20px">
                                <TextField
                                    defaultValue={administrator?.name}
                                    required
                                    label="Name"
                                    placeholder="Enter your name"
                                    fullWidth={true}
                                    error={!!errors['name']}
                                    helperText={errors['name'] ? errors['name'].message : ''}
                                    {...register('name')}
                                />
                            </Box>
                            <Box marginBottom="20px">
                                <TextField
                                    defaultValue={administrator?.phone}
                                    required
                                    label="Phone number"
                                    placeholder="Enter your phone number"
                                    fullWidth={true}
                                    error={!!errors['phone']}
                                    helperText={errors['phone'] ? errors['phone'].message : ''}
                                    {...register('phone')}
                                />
                            </Box>
                            <Box marginBottom="20px">
                                <Button variant="contained" type="submit">Update</Button>
                            </Box>
                        </Box>
                    </Box>
                )
            }
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

export default UpdateAdministrator;
