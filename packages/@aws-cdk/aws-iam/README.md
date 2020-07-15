## AWS Identity and Access Management Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---
<!--END STABILITY BANNER-->

Define a role and add permissions to it. This will automatically create and
attach an IAM policy to the role:

[attaching permissions to role](test/example.role.lit.ts)

Define a policy and attach it to groups, users and roles. Note that it is possible to attach
the policy either by calling `xxx.attachInlinePolicy(policy)` or `policy.attachToXxx(xxx)`.

[attaching policies to user and group](test/example.attaching.lit.ts)

Managed policies can be attached using `xxx.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName(policyName))`:

[attaching managed policies](test/example.managedpolicy.lit.ts)

### Granting permissions to resources

Many of the AWS CDK resources have `grant*` methods that allow you to grant other resources access to that resource. As an example, the following code gives a Lambda function write permissions (Put, Update, Delete) to a DynamoDB table.

```typescript
const fn = new lambda.Function(...);
const table = new dynamodb.Table(...);

table.grantWriteData(fn);
```

The more generic `grant` method allows you to give specific permissions to a resource:

```typescript
const fn = new lambda.Function(...);
const table = new dynamodb.Table(...);

table.grant(fn, 'dynamodb:PutItem');
```

The `grant*` methods accept an `IGrantable` object. This interface is implemented by IAM principlal resources (groups, users and roles) and resources that assume a role such as a Lambda function, EC2 instance or a Codebuild project.

You can find which `grant*` methods exist for a resource in the [AWS CDK API Reference](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html).

### Roles

Many AWS resources require *Roles* to operate. These Roles define the AWS API
calls an instance or other AWS service is allowed to make.

Creating Roles and populating them with the right permissions *Statements* is
a necessary but tedious part of setting up AWS infrastructure. In order to
help you focus on your business logic, CDK will take care of creating
roles and populating them with least-privilege permissions automatically.

All constructs that require Roles will create one for you if don't specify
one at construction time. Permissions will be added to that role
automatically if you associate the construct with other constructs from the
AWS Construct Library (for example, if you tell an *AWS CodePipeline* to trigger
an *AWS Lambda Function*, the Pipeline's Role will automatically get
`lambda:InvokeFunction` permissions on that particular Lambda Function),
or if you explicitly grant permissions using `grant` functions (see the
previous section).

#### Opting out of automatic permissions management

You may prefer to manage a Role's permissions yourself instead of having the
CDK automatically manage them for you. This may happen in one of the
following cases:

* You don't like the permissions that CDK automatically generates and
  want to substitute your own set.
* The least-permissions policy that the CDK generates is becoming too
  big for IAM to store, and you need to add some wildcards to keep the
  policy size down.

To prevent constructs from updating your Role's policy, pass the object
returned by `myRole.withoutPolicyUpdates()` instead of `myRole` itself.

For example, to have an AWS CodePipeline *not* automatically add the required
permissions to trigger the expected targets, do the following:

```ts
const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
  // custom description if desired
  description: 'This is a custom role...',
});

new codepipeline.Pipeline(this, 'Pipeline', {
  // Give the Pipeline an immutable view of the Role
  role: role.withoutPolicyUpdates(),
});

// You now have to manage the Role policies yourself
role.addToPolicy(new iam.PolicyStatement({
  action: [/* whatever actions you want */],
  resource: [/* whatever resources you intend to touch */],
});
```

#### Using existing roles

If there are Roles in your account that have already been created which you
would like to use in your CDK application, you can use `Role.fromRoleArn` to
import them, as follows:

```ts
const role = iam.Role.fromRoleArn(this, 'Role', 'arn:aws:iam::123456789012:role/MyExistingRole', {
  // Set 'mutable' to 'false' to use the role as-is and prevent adding new
  // policies to it. The default is 'true', which means the role may be
  // modified as part of the deployment.
  mutable: false,
});
```

### Configuring an ExternalId

If you need to create Roles that will be assumed by third parties, it is generally a good idea to [require an `ExternalId`
to assume them](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html).  Configuring
an `ExternalId` works like this:

[supplying an external ID](test/example.external-id.lit.ts)

### Principals vs Identities

When we say *Principal*, we mean an entity you grant permissions to. This
entity can be an AWS Service, a Role, or something more abstract such as "all
users in this account" or even "all users in this organization". An
*Identity* is an IAM representing a single IAM entity that can have
a policy attached, one of `Role`, `User`, or `Group`.

### IAM Principals

When defining policy statements as part of an AssumeRole policy or as part of a
resource policy, statements would usually refer to a specific IAM principal
under `Principal`.

IAM principals are modeled as classes that derive from the `iam.PolicyPrincipal`
abstract class. Principal objects include principal type (string) and value
(array of string), optional set of conditions and the action that this principal
requires when it is used in an assume role policy document.

To add a principal to a policy statement you can either use the abstract
`statement.addPrincipal`, one of the concrete `addXxxPrincipal` methods:

* `addAwsPrincipal`, `addArnPrincipal` or `new ArnPrincipal(arn)` for `{ "AWS": arn }`
* `addAwsAccountPrincipal` or `new AccountPrincipal(accountId)` for `{ "AWS": account-arn }`
* `addServicePrincipal` or `new ServicePrincipal(service)` for `{ "Service": service }`
* `addAccountRootPrincipal` or `new AccountRootPrincipal()` for `{ "AWS": { "Ref: "AWS::AccountId" } }`
* `addCanonicalUserPrincipal` or `new CanonicalUserPrincipal(id)` for `{ "CanonicalUser": id }`
* `addFederatedPrincipal` or `new FederatedPrincipal(federated, conditions, assumeAction)` for
  `{ "Federated": arn }` and a set of optional conditions and the assume role action to use.
* `addAnyPrincipal` or `new AnyPrincipal` for `{ "AWS": "*" }`

If multiple principals are added to the policy statement, they will be merged together:

```ts
const statement = new PolicyStatement();
statement.addServicePrincipal('cloudwatch.amazonaws.com');
statement.addServicePrincipal('ec2.amazonaws.com');
statement.addArnPrincipal('arn:aws:boom:boom');
```

Will result in:

```json
{
  "Principal": {
    "Service": [ "cloudwatch.amazonaws.com", "ec2.amazonaws.com" ],
    "AWS": "arn:aws:boom:boom"
  }
}
```

The `CompositePrincipal` class can also be used to define complex principals, for example:

```ts
const role = new iam.Role(this, 'MyRole', {
  assumedBy: new iam.CompositePrincipal(
    new iam.ServicePrincipal('ec2.amazonaws.com'),
    new iam.AccountPrincipal('1818188181818187272')
  )
});
```

The `PrincipalWithConditions` class can be used to add conditions to a
principal, especially those that don't take a `conditions` parameter in their
constructor. The `principal.withConditions()` method can be used to create a
`PrincipalWithConditions` from an existing principal, for example:

```ts
const principal = new iam.AccountPrincipal('123456789000')
  .withConditions({ StringEquals: { foo: "baz" } });
```

> NOTE: If you need to define an IAM condition that uses a token (such as a
> deploy-time attribute of another resource) in a JSON map key, use `CfnJson` to
> render this condition. See [this test](./test/integ-condition-with-ref.ts) for
> an example.

The `WebIdentityPrincipal` class can be used as a principal for web identities like
Cognito, Amazon, Google or Facebook, for example:

```ts
const principal = new iam.WebIdentityPrincipal('cognito-identity.amazonaws.com')
  .withConditions({
    "StringEquals": { "cognito-identity.amazonaws.com:aud": "us-east-2:12345678-abcd-abcd-abcd-123456" },
    "ForAnyValue:StringLike": {"cognito-identity.amazonaws.com:amr": "unauthenticated"}
  });
```

### Parsing JSON Policy Documents

The `PolicyDocument.fromJson` and `PolicyStatement.fromJson` static methods can be used to parse JSON objects. For example:

```ts
const policyDocument = {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "FirstStatement",
      "Effect": "Allow",
      "Action": ["iam:ChangePassword"],
      "Resource": "*"
    },
    {
      "Sid": "SecondStatement",
      "Effect": "Allow",
      "Action": "s3:ListAllMyBuckets",
      "Resource": "*"
    },
    {
      "Sid": "ThirdStatement",
      "Effect": "Allow",
      "Action": [
        "s3:List*",
        "s3:Get*"
      ],
      "Resource": [
        "arn:aws:s3:::confidential-data",
        "arn:aws:s3:::confidential-data/*"
      ],
      "Condition": {"Bool": {"aws:MultiFactorAuthPresent": "true"}}
    }
  ]
};

const newPolicyDocument = PolicyDocument.fromJson(policyDocument);

```

### OpenID Connect Providers

OIDC identity providers are entities in IAM that describe an external identity
provider (IdP) service that supports the [OpenID Connect] (OIDC) standard, such
as Google or Salesforce. You use an IAM OIDC identity provider when you want to
establish trust between an OIDC-compatible IdP and your AWS account. This is
useful when creating a mobile app or web application that requires access to AWS
resources, but you don't want to create custom sign-in code or manage your own
user identities. For more information about this scenario, see [About Web
Identity Federation] and the relevant documentation in the [Amazon Cognito
Identity Pools Developer Guide].

[OpenID Connect]: http://openid.net/connect
[About Web Identity Federation]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc.html
[Amazon Cognito Identity Pools Developer Guide]: https://docs.aws.amazon.com/cognito/latest/developerguide/open-id.html

The following examples defines an OpenID Connect provider. Two client IDs
(audiences) are will be able to send authentication requests to
https://openid/connect.

```ts
const provider = new OpenIdConnectProvider(this, 'MyProvider', {
  url: 'https://openid/connect',
  clients: [ 'myclient1', 'myclient2' ]
});
```

You can specify an optional list of `thumbprints`. If not specified, the
thumbprint of the root certificate authority (CA) will automatically be obtained
from the host as described
[here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html).

Once you define an OpenID connect provider, you can use it with AWS services
that expect an IAM OIDC provider. For example, when you define an [Amazon
Cognito identity
pool](https://docs.aws.amazon.com/cognito/latest/developerguide/open-id.html)
you can reference the provider's ARN as follows:

```ts
new cognito.CfnIdentityPool(this, 'IdentityPool', {
  openIdConnectProviderARNs: [ provider.openIdConnectProviderArn ]
});
```

The `OpenIdConnectPrincipal` class can be used as a principal used with a `OpenIdConnectProvider`, for example:

```ts
const provider = new OpenIdConnectProvider(this, 'MyProvider', {
  url: 'https://openid/connect',
  clients: [ 'myclient1', 'myclient2' ]
});
const principal = new iam.OpenIdConnectPrincipal(provider);
```

### Features

 * Policy name uniqueness is enforced. If two policies by the same name are attached to the same
   principal, the attachment will fail.
 * Policy names are not required - the CDK logical ID will be used and ensured to be unique.
