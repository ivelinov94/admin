import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../config/theme';
import createEmotionCache from '../config/createEmotionCache';
import { wrapper } from '../store/store';

import { Provider } from "react-redux";
import { FC } from 'react';


// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MyApp: FC<MyAppProps> =  ({ Component, ...rest }) => {
	const { store, props } = wrapper.useWrappedStore(rest);
	const { emotionCache = clientSideEmotionCache, pageProps } = props;
	return (
		<Provider store={store}>
			<CacheProvider value={emotionCache}>
				<Head>
					<meta name="viewport" content="initial-scale=1, width=device-width" />
				</Head>
				<ThemeProvider theme={theme}>
					{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
					<CssBaseline />
					<Component {...pageProps} />
				</ThemeProvider>
			</CacheProvider>
		</Provider>
	);
}

export default MyApp;
