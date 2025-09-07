import "@mantine/core/styles.css";
import "@/styles/globals.css";
import { createTheme, MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import { ModalsProvider } from "@mantine/modals";
import Head from "next/head";

const theme = createTheme({
  // primaryColor: "violet",
  // primaryShade: { light: 9, dark: 9 },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Head>
        <title>YouLearn</title>
        <meta
          name="description"
          content="Youlearn enables students to watch learning videos."
        />
        <link rel="icon" href="/vercel.svg" />
      </Head>

      <ModalsProvider>
        <Component {...pageProps} />
      </ModalsProvider>
    </MantineProvider>
  );
}
