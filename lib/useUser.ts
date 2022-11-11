import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";


export type User = {
    id: number;
	username: string;
	phone: string;
	isLoggedIn: boolean;
};

export default function useUser({
	redirectTo = "",
	redirectIfFound = false,
} = {}) {
	const { data: user, mutate: mutateUser } = useSWR<User>("/api/auth/user");

	useEffect(() => {
		if (!redirectTo || !user) return;

		if (
			(redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      (redirectIfFound && user?.isLoggedIn)
		) {
			Router.push(redirectTo);
		}
	}, [user, redirectIfFound, redirectTo]);

	return { user, mutateUser };
}
