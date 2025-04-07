# Amazon Cognito Identity Pool Construct Library

[Amazon Cognito Identity Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html) enable you to grant your users access to other AWS services.

Identity Pools are one of the two main components of [Amazon Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html), which provides authentication, authorization, and
user management for your web and mobile apps. Your users can sign in through a a trusted identity provider, like a user 
pool or a SAML 2.0 service, as well as with third party providers such as Facebook, Amazon, Google or Apple. 

The other main component in Amazon Cognito is [user pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html). User Pools are user directories that provide sign-up and
sign-in options for your app users.

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

```ts nofixture
import { IdentityPool, UserPoolAuthenticationProvider } from 'aws-cdk-lib/aws-cognito-identitypool';
```

## Table of Contents

- [Identity Pools](#identity-pools)
  - [Authenticated and Unauthenticated Identities](#authenticated-and-unauthenticated-identities)
  - [Authentication Providers](#authentication-providers)
    - [User Pool Authentication Provider](#user-pool-authentication-provider)
    - [Server Side Token Check](#server-side-token-check)
    - [Associating an External Provider Directly](#associating-an-external-provider-directly)
    - [OpenIdConnect and Saml](#openid-connect-and-saml)
    - [Custom Providers](#custom-providers)
  - [Role Mapping](#role-mapping)
    - [Provider Urls](#provider-urls)
  - [Authentication Flow](#authentication-flow)
  - [Cognito Sync](#cognito-sync)
  - [Importing Identity Pools](#importing-identity-pools)

## Identity Pools

Identity pools provide temporary AWS credentials for users who are guests (unauthenticated) and for users who have 
authenticated by presenting a token from another identity provider. An identity pool is a store of user identity data 
specific to an account.

Identity pools can be used in conjunction with Cognito User Pools or by accessing external federated identity providers  
directly. Learn more at [Amazon Cognito Identity Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html).

### Authenticated and Unauthenticated Identities

Identity pools define two types of identities: authenticated(`user`) and unauthenticated (`guest`). Every identity in  
an identity pool is either authenticated or unauthenticated. Each identity pool has a default role for authenticated  
identities, and a default role for unauthenticated identities. Absent other overriding rules (see below), these are the  
roles that will be assumed by the corresponding users in the authentication process. 

A basic Identity Pool with minimal configuration has no required props, with default authenticated (user) and  
unauthenticated (guest) roles applied to the identity pool: 

```ts
new IdentityPool(this, 'myIdentityPool');
```

By default, both the authenticated and unauthenticated roles will have no permissions attached. When granting permissions,
you should ensure that you are granting the least privileged permissions required for your use case. Grant permissions 
to roles using the public `authenticatedRole` and `unauthenticatedRole` properties: 

```ts
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

const identityPool = new IdentityPool(this, 'myIdentityPool');
declare const table: dynamodb.Table;

// Grant permissions to authenticated users
table.grantReadWriteData(identityPool.authenticatedRole);
// Grant permissions to unauthenticated guest users
table.grantReadData(identityPool.unauthenticatedRole);

// Or add policy statements straight to the role
identityPool.authenticatedRole.addToPrincipalPolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: ['dynamodb:UpdateItem'],
  resources: [table.tableArn],
}));
```

The default roles can also be supplied in `IdentityPoolProps`:

```ts
const stack = new Stack();
const authenticatedRole = new iam.Role(this, 'authRole', {
  assumedBy: new iam.ServicePrincipal('service.amazonaws.com'),
});
const unauthenticatedRole = new iam.Role(this, 'unauthRole', {
  assumedBy: new iam.ServicePrincipal('service.amazonaws.com'),
});
const identityPool = new IdentityPool(this, 'TestIdentityPoolActions', {
  authenticatedRole,
  unauthenticatedRole,
});
```

### Authentication Providers

Authenticated identities belong to users who are authenticated by a public login provider (Amazon Cognito user pools,  
Login with Amazon, Sign in with Apple, Facebook, Google, SAML, or any OpenID Connect Providers) or a developer provider  
(your own backend authentication process).

[Authentication providers](https://docs.aws.amazon.com/cognito/latest/developerguide/external-identity-providers.html) can be associated with an Identity Pool by first associating them with a Cognito User Pool or by  
associating the provider directly with the identity pool.

#### User Pool Authentication Provider

In order to attach a user pool to an identity pool as an authentication provider, the identity pool needs properties
from both the user pool and the user pool client. For this reason identity pools use a `UserPoolAuthenticationProvider`
to gather the necessary properties from the user pool constructs.

```ts
const userPool = new cognito.UserPool(this, 'Pool');

new IdentityPool(this, 'myidentitypool', {
  identityPoolName: 'myidentitypool',
  authenticationProviders: {
    userPools: [new UserPoolAuthenticationProvider({ userPool })],
  },
});
```

User pools can also be associated with an identity pool after instantiation. The Identity Pool's `addUserPoolAuthentication` method  
returns the User Pool Client that has been created:

```ts
declare const identityPool: IdentityPool;
const userPool = new cognito.UserPool(this, 'Pool');
const userPoolClient = identityPool.addUserPoolAuthentication(new UserPoolAuthenticationProvider({
  userPool,
}));
```

#### Server Side Token Check

With the `IdentityPool` CDK Construct, by default the pool is configured to check with the integrated user pools to  
make sure that the user has not been globally signed out or deleted before the identity pool provides an OIDC token or  
AWS credentials for the user. 

If the user is signed out or deleted, the identity pool will return a 400 Not Authorized error. This setting can be  
disabled, however, in several ways.

Setting `disableServerSideTokenCheck` to true will change the default behavior to no server side token check. Learn  
more [here](https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_CognitoIdentityProvider.html#CognitoIdentity-Type-CognitoIdentityProvider-ServerSideTokenCheck):

```ts
declare const identityPool: IdentityPool;
const userPool = new cognito.UserPool(this, 'Pool');
identityPool.addUserPoolAuthentication(new UserPoolAuthenticationProvider({ 
  userPool,
  disableServerSideTokenCheck: true, 
}));
```

#### Associating an External Provider Directly

One or more [external identity providers](https://docs.aws.amazon.com/cognito/latest/developerguide/external-identity-providers.html) can be associated with an identity pool directly using  
`authenticationProviders`:

```ts
new IdentityPool(this, 'myidentitypool', {
  identityPoolName: 'myidentitypool',
  authenticationProviders: {
    amazon: {
      appId: 'amzn1.application.12312k3j234j13rjiwuenf',
    },
    facebook: {
      appId: '1234567890123',
    },
    google: {
      clientId: '12345678012.apps.googleusercontent.com',
    },
    apple: {
      servicesId: 'com.myappleapp.auth',
    },
    twitter: {
      consumerKey: 'my-twitter-id',
      consumerSecret: 'my-twitter-secret',
    },
  },
});
```

To associate more than one provider of the same type with the identity pool, use User  
Pools, OpenIdConnect, or SAML. Only one provider per external service can be attached directly to the identity pool.

#### OpenId Connect and Saml

[OpenID Connect](https://docs.aws.amazon.com/cognito/latest/developerguide/open-id.html) is an open standard for  
authentication that is supported by a number of login providers. Amazon Cognito supports linking of identities with  
OpenID Connect providers that are configured through [AWS Identity and Access Management](http://aws.amazon.com/iam/). 

An identity provider that supports [Security Assertion Markup Language 2.0 (SAML 2.0)](https://docs.aws.amazon.com/cognito/latest/developerguide/saml-identity-provider.html) can be used to provide a simple  
onboarding flow for users. The SAML-supporting identity provider specifies the IAM roles that can be assumed by users  
so that different users can be granted different sets of permissions. Associating an OpenId Connect or Saml provider  
with an identity pool:

```ts
declare const openIdConnectProvider: iam.OpenIdConnectProvider;
declare const samlProvider: iam.SamlProvider;

new IdentityPool(this, 'myidentitypool', {
  identityPoolName: 'myidentitypool',
  authenticationProviders: {
    openIdConnectProviders: [openIdConnectProvider],
    samlProviders: [samlProvider],
  },
});
```

#### Custom Providers

The identity pool's behavior can be customized further using custom [developer authenticated identities](https://docs.aws.amazon.com/cognito/latest/developerguide/developer-authenticated-identities.html).  
With developer authenticated identities, users can be registered and authenticated via an existing authentication  
process while still using Amazon Cognito to synchronize user data and access AWS resources.

Like the supported external providers, though, only one custom provider can be directly associated with the identity  
pool.

```ts
declare const openIdConnectProvider: iam.OpenIdConnectProvider;
new IdentityPool(this, 'myidentitypool', {
  identityPoolName: 'myidentitypool',
  authenticationProviders: {
    google: {
      clientId: '12345678012.apps.googleusercontent.com',
    },
    openIdConnectProviders: [openIdConnectProvider],
    customProvider: 'my-custom-provider.example.com',
  },
});
```

### Role Mapping

In addition to setting default roles for authenticated and unauthenticated users, identity pools can also be used to  
define rules to choose the role for each user based on claims in the user's ID token by using Role Mapping. When using  
role mapping, it's important to be aware of some of the permissions the role will need, and that the least privileged
roles necessary are given for your specific use case. An in depth  
review of roles and role mapping can be found [here](https://docs.aws.amazon.com/cognito/latest/developerguide/role-based-access-control.html).

Using a [token-based approach](https://docs.aws.amazon.com/cognito/latest/developerguide/role-based-access-control.html#using-tokens-to-assign-roles-to-users) to role mapping will allow mapped roles to be passed through the `cognito:roles` or  
`cognito:preferred_role` claims from the identity provider:

```ts
import { IdentityPoolProviderUrl } from 'aws-cdk-lib/aws-cognito-identitypool';

new IdentityPool(this, 'myidentitypool', {
  identityPoolName: 'myidentitypool',
  roleMappings: [{
    providerUrl: IdentityPoolProviderUrl.AMAZON,
    useToken: true,
  }],
});
```

Using a rule-based approach to role mapping allows roles to be assigned based on custom claims passed from the identity provider:

```ts
import { IdentityPoolProviderUrl, RoleMappingMatchType } from 'aws-cdk-lib/aws-cognito-identitypool';

declare const adminRole: iam.Role;
declare const nonAdminRole: iam.Role;
new IdentityPool(this, 'myidentitypool', {
  identityPoolName: 'myidentitypool',
  // Assign specific roles to users based on whether or not the custom admin claim is passed from the identity provider
  roleMappings: [{
    providerUrl: IdentityPoolProviderUrl.AMAZON,
    rules: [
      {
        claim: 'custom:admin',
        claimValue: 'admin',
        mappedRole: adminRole,
      },
      {
        claim: 'custom:admin',
        claimValue: 'admin',
        matchType: RoleMappingMatchType.NOTEQUAL,
        mappedRole: nonAdminRole,
      }
    ],
  }],
});
```

#### Provider Urls

Role mappings must be associated with the url of an Identity Provider which can be supplied
`IdentityPoolProviderUrl`. Supported Providers have static Urls that can be used:

```ts
import { IdentityPoolProviderUrl } from 'aws-cdk-lib/aws-cognito-identitypool';

new IdentityPool(this, 'myidentitypool', {
  identityPoolName: 'myidentitypool',
  roleMappings: [{
    providerUrl: IdentityPoolProviderUrl.FACEBOOK,
    useToken: true,
  }],
});
```

For identity providers that don't have static Urls, a custom Url can be supplied:

```ts
import { IdentityPoolProviderUrl } from 'aws-cdk-lib/aws-cognito-identitypool';

new IdentityPool(this, 'myidentitypool', {
  identityPoolName: 'myidentitypool',
  roleMappings: [
    {
      providerUrl: IdentityPoolProviderUrl.custom('my-custom-provider.com'),
      useToken: true,
    },
  ],
});
```

If a provider URL is a CDK Token, as it will be if you are trying to use a previously defined Cognito User Pool, you will need to also provide a mappingKey.
This is because by default, the key in the Cloudformation role mapping hash is the providerUrl, and Cloudformation map keys must be concrete strings, they
cannot be references. For example:

```ts
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { IdentityPoolProviderUrl } from 'aws-cdk-lib/aws-cognito-identitypool';

declare const userPool: UserPool;
declare const userPoolClient: UserPoolClient;
new IdentityPool(this, 'myidentitypool', {
  identityPoolName: 'myidentitypool',
  roleMappings: [{
    mappingKey: 'cognito',
    providerUrl: IdentityPoolProviderUrl.userPool(userPool, userPoolClient),
    useToken: true,
  }],
});
```

See [here](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html#cfn-cognito-identitypoolroleattachment-rolemapping-identityprovider) for more information.

### Authentication Flow

Identity Pool [Authentication Flow](https://docs.aws.amazon.com/cognito/latest/developerguide/authentication-flow.html) defaults to the enhanced, simplified flow. The Classic (basic) Authentication Flow  
can also be implemented using `allowClassicFlow`:

```ts
new IdentityPool(this, 'myidentitypool', {
  identityPoolName: 'myidentitypool',
  allowClassicFlow: true,
});
```

### Cognito Sync

It's now recommended to integrate [AWS AppSync](https://aws.amazon.com/appsync/) for synchronizing app data across devices, so  
Cognito Sync features like `PushSync`, `CognitoEvents`, and `CognitoStreams` are not a part of `IdentityPool`. More    
information can be found [here](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-sync.html).

### Importing Identity Pools

You can import existing identity pools into your stack using Identity Pool static methods with the Identity Pool Id or  
Arn:

```ts
IdentityPool.fromIdentityPoolId(this, 'my-imported-identity-pool',
  'us-east-1:dj2823ryiwuhef937');
IdentityPool.fromIdentityPoolArn(this, 'my-imported-identity-pool',
  'arn:aws:cognito-identity:us-east-1:123456789012:identitypool/us-east-1:dj2823ryiwuhef937');
```
