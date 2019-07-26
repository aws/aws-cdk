## AWS Amplify Construct Library
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

Define a new App:
```ts
new App(this, 'MyApp', {
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
const app = new App(stack, 'MyApp', {
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
const app = new App(stack, 'MyApp', {
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
const app = App.fromAppId(stack, 'MyApp', 'dbhvlzrug0n3u');

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
const app = App.fromAppId(stack, 'MyApp', 'dbhvlzrug0n3u');

app.addBranch('MyBranch', {
  branchName: 'master'
})
```

`Branch` constructs expose the following deploy-time attributes:
- `branchArn` - ARN for a branch, part of an Amplify App. (i.e. `arn:aws:amplify:eu-west-1:12345678901234:apps/dbhvlzrug0n3u/branches/master`)
- `branchName` - Name for a branch, part of an Amplify App. (i.e. `master`)