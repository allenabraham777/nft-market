import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../layouts/default";
import { SignerProvider } from "../state/signer";

const GRAPH_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL as string;
const client = new ApolloClient({ cache: new InMemoryCache(), uri: GRAPH_URL });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SignerProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SignerProvider>
    </ApolloProvider>
  );
}

export default MyApp;
