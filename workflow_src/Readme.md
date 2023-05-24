# "Handle Stale Discussions" Action for Github Action

This Github action checks the answerable discussions when an answer is proposed with keyword `@bot proposed-answer`. If the expected reaction is received on the proposed answer, discussions is marked answered and closed, otherwise a label `attention` is added for further traction. In case of no reaction on proposed answer for 7 days, a reminder is sent to discussion author to provide his response. In absence of response after next 4 days, discussion is closed as being stale.

## Terminologies

- [Answerable Discussions](https://docs.github.com/en/discussions) - Since Github discussions can be of 25 various different categories, only the answerable discussions are considered for this action.

- [Github Graphql API Client](https://docs.github.com/en/graphql) - To create integrations, retrieve data, and automate your workflows, the GitHub GraphQL API is used.

- [Queries](https://docs.github.com/en/graphql/reference/queries) - Queries are used to retrieve the metadata about github schema; it could be anything like who posted the comment, owner of the repo, latest comment posted or reaction on any comment.


- [Mutations](https://docs.github.com/en/graphql/reference/mutations) - Mutations are GraphQL operations that change the data; like the create/update operations; like you want to post a comment or edit the comment text. 

- [Github schema](https://docs.github.com/en/graphql/overview/public-schema) - All the Github data; i.e. comments, discussions, PR etc. comprise of Github Schema. It contains metadata about Github data.

- [GraphQL Codegen](https://the-guild.dev/graphql/codegen/docs/getting-started) - GraphQL Code Generator is a plugin-based tool that helps you get the best out of your GraphQL stack.

- Github Personal Access Token with repo scope is needed for this action, please create one in your [settings](https://github.com/settings/tokens).

## Steps

1. Install the required Github API Client and codegen to generate the required types.
2. Generate Github token in [Settings](https://dev.to/github/the-githubtoken-in-github-actions-how-it-works-change-permissions-customizations-3cgp).
3. Write workflow and [Github action](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).
4. [Schedule the github action](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows) to run at specified time.

## Installing the required libraries and packages

To access github discussions and fetch the metadata, Apollo GraphQL API needs to be installed first, followed by setup wizard.

### Installing Github GraphQL API Client -

1. Get the Tyepscript/GrahQL Repo initialised by running these command in your repo  terminal - 

    - npm install --save graphql        
    - npm install --save-dev typescript ts-node
    - npx tsc --init

2. Generating types from Github GraphQL Schema -

[@octokit/graphql-schema](https://github.com/octokit/graphql-schema) is used for generating the types from Github GraphQL Schema. Install the schema and graphql-codegen by running this command -

    - npm install --save-dev @octokit/graphql-schema @graphql-codegen/cli

3. Use the graphql-codegen wizard to configure initial code generation config.

    - npx graphql-codegen init

        Welcome to GraphQL Code Generator!
         Answer few questions and we will setup everything for you.
        - What type of application are you building?  (For getting started, choose this option for the app you are building)
            - Backend - API or server
        - Where is your schema?: (We’ll point graphql-codegen at the schema published by @octokit/graphql-schema that we installed earlier. For now, type src/generated/github-schema-loader.ts and press enter.)
            - src/generated/github-schema-loader.ts
        - Pick plugins: (Here, we would be using typescript-document-nodes for writing distinct GraphQL Files for IDE Support)

                ◉ TypeScript (required by other typescript plugins)
                ◉ TypeScript Resolvers (strongly typed resolve functions)
                ◯ TypeScript MongoDB (typed MongoDB objects)
                ❯◉ TypeScript GraphQL document nodes (embedded GraphQL document)

        - Where to write the output: (Select the default suggestion here)
            - src/generated/graphql.ts

        - Do you want to generate an introspection file? (Y/n) (We don't need an introspection file)
            - n

        - How to name the config file? (Naming the graphql-codegen configuration file given in the suggestion, select the suggestion as it is)
            - codegen.yml

        - What script in package.json should run the codegen? (This will create an entry in the package.json scripts object, so write codegen)
            - codegen

4. Since the initial config settings are done, install all the plugins the wizard wrote to package.json’s devDependencies.
    - npm install

5. The last setup step is to write the src/generated/github-schema-loader.ts file we referenced earlier. Create a file at src/generated/github-schema-loader.ts and paste the following code:

`
import { schema } from '@octokit/graphql-schema'
export default schema.json;
`

This will load the schema up from the package published by Github, @octokit/graphql-schema.

6. Finally, you’ll need to add `ts-node/register` to your `codegen.yml` file so the `github-schema-loader.ts` can be transpiled. The file should look like this:

```
overwrite: true

schema: "src/generated/github-schema-loader.ts"

documents: null

generates:
  src/generated/graphql.ts:
    plugins:
      - "typescript"
      - "typescript-resolvers"
      - "typescript-document-nodes"

require:
  - ts-node/register

```


7. Run to generate Github related types-
    - npm run codegen

Note -> It is preferrable to keep the queries and mutations in separate folders like created in this repo. We would learn more about writing queries/mutations in sections below.

    - src/queries/*.graphql
    - src/mutation/*.graphql

### Install Apollo

Apollo is used as GraphQL Client. Install Apollo and its dependencies by running the command below -
    
- npm install --save @apollo/client cross-fetch

Create a file `src/client.ts` and copy the below code in the file -

```
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
```

This code  is setting up a GraphQL client to use when communicating with the Github GraphQL API

### GraphQL Codegen Typescript Operations

To add types to our queries, mutations, and variables, let’s add the @graphql-codegen/typescript-operations plugin to generate Typescript classes from our .graphql files.

- npm install --save-dev @graphql-codegen/typescript-operations

and reference it in your codegen.yml file under the plugins list.

```
generates:
  src/generated/graphql.ts:
    plugins:
      - "typescript"
      - "typescript-resolvers"
      - "typescript-document-nodes"
      - "typescript-operations"

```

#### Rules for running queries and mutations

Queries are used to get the data. Here is sample query, you could copy this code in file src/who-am-i.graphql -

```
query WhoAmI {
  viewer {
    login
  }
}
```

For every query added, codegen needs to generate the types. Running this command is mandatory after addition of queries/mutations. So lets run this command -

- npm run codegen

This viewer query will return your username (docs). Now, this is where the generated types come in super-handy. Create an index file at src/index.ts and paste the following code:

```
import { githubClient } from "./client";
import { WhoAmIQuery, WhoAmI } from "./generated/graphql";

async function whoAmI() {
  const result = await githubClient().query<WhoAmIQuery>({
    query: WhoAmI,
  });

  return result.data.viewer.login;
}

async function main() {
  const username = await whoAmI();
  console.info(`Your github username is ${username}`);
}

main();

```

### Writing a mutation

Next, lets write a mutation that requires a variable to show the power of layer in types when communicating with the API.

Create `src/mutations/add-star.graphql` and paste the following code:

```
mutation AddStar($starrableId: ID!) {
  addStar(input: { starrableId: $starrableId }) {
    starrable {
      stargazers {
        totalCount
      }
    }
  }
}
```

This code will add a star on the repository ID you pass. Note that we’re using a GraphQL variable called starrableId that will be set at runtime. Since we’ve added a .graphql file, we need to run codegen again.   

- npm run codegen

Let’s update our `src/index.ts` to call this mutation.

```
import { AddStarMutation, AddStarMutationVariables, AddStar } from "./generated/graphql";

async function starRepo(repoId: string) {
  const result = await githubClient().mutate<AddStarMutation, AddStarMutationVariables>({
    mutation: AddStar,
    variables: {
      starrableId: repoId,
    },
  });

  if (result.errors) {
    throw new Error("Mutation failed!");
  }

  console.info(`The repository now has ${result.data?.addStar?.starrable?.stargazers.totalCount} stargazers!!`);
}

async function main() {
  const username = await whoAmI();
  console.info(`Your github username is ${username}`);

  const RepoId = "MDEwOlJlcG9zaXRvcnkxMjUwOTk3OA==";
  await starRepo(RepoId);
}

main();
```

Note that we’ve added the starRepo method that calls our new mutation. By passing <AddStarMutation, AddStarMutationVariables>, Typescript will now ensure that we’re passing all the required variables to the mutation, and that they’re of the correct type. This is great because it will help catch bugs before we even call the Github API.

Because @octokit/graphql-schema is automatically updated any time Github GraphQL schema is updated, we can simply update the package and ensure our Typescript still compiles.

- npm update @octokit/graphql-schema

Without generating types from the schema, Github could change their schema in a way that breaks our code, and we wouldn’t know until runtime.

## Writing github action

Once the required setup, installation is done with queries and mutations needed, next step is to write a workflow file. Copy the file `github/workflows/handle-stale-discussions.yml`, along with `action.yml` and paste into your repo. Right now, this action runs 2 times a day, but you could change it as required.

## Files Hierarchy and usage

- `.github/workflows/handle-stale-discussions.yml` - contains the workflow for running the github action 2 times a day.
- `src/generated/github-schema-loader.ts` - created during setup manually, for importing the GraphQL Schema.
- `src/generated/graphql.ts` - generated during config setup automatically.
- `src/mutations/*.graphql`- contains mutations for different scenario.
- `src/queries/*.graphql` - contains queries for fetching the required data for different scenarios.
- `client.ts` - code for making the GraphQL client call.
- `index.ts` - meaty code for handling the discussions.
- `test/index.test.ts` - unit test code for different code blocks.
- `codegen.yml` - config setup file for codegen.

## Testing 

Jest framework is used for testing. Setup instructions can be found [here](https://jestjs.io/docs/getting-started). Please refer to `test/index.test.js` for writing unit tests.


## References 

- [Github GraphQL API]()

- [Queries](https://docs.github.com/en/graphql/reference/queries)

- [Mutations](https://docs.github.com/en/graphql/reference/mutations) 

- [Using GraphQL API for Discussions](https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions)