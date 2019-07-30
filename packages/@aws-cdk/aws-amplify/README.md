## AWS Amplify Construct Library

The AWS Amplify Console provides a Git-based workflow for deploying and hosting fullstack serverless web applications. A fullstack serverless app consists of a backend built with cloud resources such as GraphQL or REST APIs, file and data storage, and a frontend built with single page application frameworks such as React, Angular, Vue, or Gatsby. 

Fullstack serverless web applications functionality is often spread across frontend code running in the browser and backend business logic running in the cloud. This makes application deployment complex and time consuming as you need to carefully coordinate release cycles to ensure your frontend and backend are compatible, and new features do not break your production customers.

The Amplify Console accelerates your application release cycle by providing a simple workflow for deploying full-stack serverless applications. You just connect your application's code repository to Amplify Console, and changes to your frontend and backend are deployed in a single workflow on every code commit.

<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

## Create a Todo App
Using the sample application from VueJS (https://github.com/vuejs/vue/tree/dev/examples/todomvc), you can deploy a Todo app that uses VueJS.

The example will create an Amplify app that contains a BuildSpec and some custom rules to ensure files are able to be loaded correctly when the page is requested. It will also add domain pointing to the master branch. 


```ts
const app = new amplify.App(stack, 'TodoApp', {
  name: 'TodoApp',
  repository: 'https://github.com/vuejs/vue',
  description: 'TodoApp Example from VueJS',
  oauthToken: new cdk.Secret('sometoken'),
  buildSpec: codebuild.BuildSpec.fromObject({
    version: 0.2,
    frontend: {
      phases: {
        build: {
          commands: [
            'npm i'
            'npm run build',
            'cp dist/vue.min.js examples/todomvc/'
          ]
        }
      },
      artifacts: {
        baseDirectory: 'examples/todomvc/',
        files: [
          '*'
        ]
      }
    }
  })
});

app.addCustomRule('/dist/vue.min.js', '/vue.min.js', '200');
app.addBranch('TodoMaster', {
  branchName: 'master',
  description: 'master branch'
});

app.addDomain('TodoDomain', {
  domainName: 'example.com',
  subdomainSettings: [{
    branchName: 'master',
    prefix: '/'
  }]
})
```

## Add an App
Define a new App:
```ts
new amplify.App(stack, 'MyApp', {
  name: 'MyApp',
  repository: 'https://github.com/aws/aws-cdk'
});
```
`App` constructs expose the following deploy-time attributes:
- `appId` - Unique Id for the Amplify App (i.e. `dbhvlzrug0n3u`)
- `appName` - Name for the Amplify App (i.e. `MyApp`)
- `appArn` - ARN for the Amplify App (i.e. `arn:aws:amplify:eu-west-1:1234567890123:apps/dbhvlzrug0n3u`)
- `appDefaultDomain` - Default domain for the Amplify App (i.e. `dbhvlzrug0n3u.amplifyapp.com`)

### Add Domain
```ts
const app = new amplify.App(stack, 'MyApp', {
  name: 'MyApp',
  repository: 'https://github.com/aws/aws-cdk'
});

app.addDomain('MyDomain', {
  domainName: 'example.com',
  subdomainSettings: [{
    branchName: 'master',
    prefix: '/'
  }]
});
```

### Add Branch
```ts
const app = new amplify.App(stack, 'MyApp', {
  name: 'MyApp',
  repository: 'https://github.com/aws/aws-cdk'
});

app.addBranch('MyBranch', {
  branchName: 'master'
});
```

## Domain
To add a domain to an existing app:
```ts
const app = amplify.App.fromAppId(stack, 'MyApp', 'dbhvlzrug0n3u');

app.addDomain('MyDomain', {
  domainName: 'example.com',
  subdomainSettings: [{
    branchName: 'master',
    prefix: '/'
  }]
})
```

The `Domain` construct exposes the following deploy-time attributes:
- `arn` - ARN for the Domain Association (i.e. `arn:aws:amplify:eu-west-1:12345678901234:apps/dbhvlzrug0n3u/domains/example.com`)
- `certificateRecord` - DNS Record for certificate verification (i.e. `_ed2e4e47958904855e7e12a2714c9d38.example.com. CNAME _d92413da499c5d5bd55611aeb2652633.duyqrilejt.acm-validations.aws.`)
- `domainName` - Name of the domain (i.e. `example.com`)
- `domainStatus` - Status fo the Domain Association (i.e. `AVAILABLE`)
- `statusReason` - Reason for the current status of the domain


## Branch
To add a branch to an existing app:
```ts
const app = amplify.App.fromAppId(stack, 'MyApp', 'dbhvlzrug0n3u');

app.addBranch('MyBranch', {
  branchName: 'master'
})
```

`Branch` constructs expose the following deploy-time attributes:
- `branchArn` - ARN for a branch, part of an Amplify App. (i.e. `arn:aws:amplify:eu-west-1:12345678901234:apps/dbhvlzrug0n3u/branches/master`)
- `branchName` - Name for a branch, part of an Amplify App. (i.e. `master`)