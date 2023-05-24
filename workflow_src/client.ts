import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client/core";
import fetch from 'cross-fetch';

export function githubClient(): ApolloClient<NormalizedCacheObject> {
if (!process.env.GITHUB_TOKEN) {
    throw new Error(
    "You need to provide a Github personal access token as `GITHUB_TOKEN` env variable. See README for more info."
    );
}

return new ApolloClient({
    link: new HttpLink({
    uri: "https://api.github.com/graphql",
    headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
    fetch
    }),
    cache: new InMemoryCache(),
});
}