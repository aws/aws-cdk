## Amazon Cognito Construct Library
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

[Amazon Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) provides
authentication, authorization, and user management for your web and mobile apps. Your users can sign in directly with a
user name and password, or through a third party such as Facebook, Amazon, Google or Apple.

The two main components of Amazon Cognito are [user
pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) and [identity
pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html). User pools are user directories
that provide sign-up and sign-in options for your app users. Identity pools enable you to grant your users access to
other AWS services.

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## User Pools

User pools allow creating and managing your own directory of users that can sign up and sign in. They enable easy
integration with social identity providers such as Facebook, Google, Amazon, Microsoft Active Directory, etc. through
SAML.

Using the CDK, a new user pool can be created as part of the stack using the construct's constructor. You may specify
the `userPoolName` to give your own identifier to the user pool. If not, CloudFormation will generate a name.

```ts
new UserPool(this, 'myuserpool', {
  userPoolName: 'myawesomeapp-userpool',
});
```

### Sign Up

Users can either be signed up by the app's administrators or can sign themselves up. Once a user has signed up, their
account needs to be confirmed. Cognito provides several ways to sign users up and confirm their accounts. Learn more
about [user sign up here](https://docs.aws.amazon.com/cognito/latest/developerguide/signing-up-users-in-your-app.html).

When a user signs up, email and SMS messages are used to verify their account and contact methods. The following code
snippet configures a user pool with properties relevant to these verification messages -

```ts
new UserPool(this, 'myuserpool', {
  // ...
  selfSignUpEnabled: true,
  userVerification: {
    emailSubject: 'Verify your email for our awesome app!',
    emailBody: 'Hello {username}, Thanks for signing up to our awesome app! Your verification code is {####}',
    emailStyle: VerificationEmailStyle.CODE,
    smsMessage: 'Hello {username}, Thanks for signing up to our awesome app! Your verification code is {####}',
  }
});
```

By default, self sign up is disabled. Learn more about [email and SMS verification messages
here](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-message-customizations.html).

Besides users signing themselves up, an administrator of any user pool can sign users up. The user then receives an
invitation to join the user pool. The following code snippet configures a user pool with properties relevant to the
invitation messages -

```ts
new UserPool(this, 'myuserpool', {
  // ...
  userInvitation: {
    emailSubject: 'Invite to join our awesome app!',
    emailBody: 'Hello {username}, you have been invited to join our awesome app! Your temporary password is {####}',
    smsMessage: 'Your temporary password for our awesome app is {####}'
  }
});
```

All email subjects, bodies and SMS messages for both invitation and verification support Cognito's message templating.
Learn more about [message templates
here](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-message-templates.html).

### Sign In

Users registering or signing in into your application can do so with multiple identifiers. There are 4 options
available:

* `username`: Allow signing in using the one time immutable user name that the user chose at the time of sign up.
* `email`: Allow signing in using the email address that is associated with the account.
* `phone`: Allow signing in using the phone number that is associated with the account.
* `preferredUsername`: Allow signing in with an alternate user name that the user can change at any time. However, this
  is not available if the `username` option is not chosen.

The following code sets up a user pool so that the user can sign in with either their username or their email address -

```ts
new UserPool(this, 'myuserpool', {
  // ...
  // ...
  signInAliases: {
    username: true,
    email: true
  },
});
```

User pools can either be configured so that user name is primary sign in form, but also allows for the other three to be
used additionally; or it can be configured so that email and/or phone numbers are the only ways a user can register and
sign in. Read more about this
[here](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#user-pool-settings-aliases-settings).

To match with 'Option 1' in the above link, with a verified email, `signInAliases` should be set to
`{ username: true, email: true }`. To match with 'Option 2' in the above link with both a verified
email and phone number, this property should be set to `{ email: true, phone: true }`.

Cognito recommends that email and phone number be automatically verified, if they are one of the sign in methods for
the user pool. Read more about that
[here](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#user-pool-settings-aliases).
The CDK does this by default, when email and/or phone number are specified as part of `signInAliases`. This can be
overridden by specifying the `autoVerify` property.

The following code snippet sets up only email as a sign in alias, but both email and phone number to be auto-verified.

```ts
new UserPool(this, 'myuserpool', {
  // ...
  // ...
  signInAliases: { username: true, email: true },
  autoVerify: { email: true, phone: true }
});
```

### Security

Cognito sends various messages to its users via SMS, for different actions, ranging from account verification to
marketing. In order to send SMS messages, Cognito needs an IAM role that it can assume, with permissions that allow it
to send SMS messages. By default, CDK will create this IAM role but can also be explicily specified to an existing IAM
role using the `smsRole` property.

```ts
import { Role } from '@aws-cdk/aws-iam';

const poolSmsRole = new Role(this, 'userpoolsmsrole', { /* ... */ });

new UserPool(this, 'myuserpool', {
  // ...
  smsRole: poolSmsRole,
  smsRoleExternalId: 'c87467be-4f34-11ea-b77f-2e728ce88125'
});
```

When the `smsRole` property is specified, the `smsRoleExternalId` may also be specified. The value of
`smsRoleExternalId` will be used as the `sts:ExternalId` when the Cognito service assumes the role. In turn, the role's
assume role policy should be configured to accept this value as the ExternalId. Learn more about [ExternalId
here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html).

### Attributes

Attributes represent the various properties of each user that's collected and stored in the user pool. Cognito
provides a set of standard attributes that are available for all user pools. Users are allowed to select any of these
standard attributes to be required. Users will not be able to sign up to the user pool without providing the required
attributes. Besides these, additional attributes can be further defined, and are known as custom attributes.

Learn more on [attributes in Cognito's
documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html).

The following code sample configures a user pool with two standard attributes (name and address) as required, and adds
four optional attributes.

```ts
new UserPool(this, 'myuserpool', {
  // ...
  // ...
  requiredAttributes: [ StandardAttribute.address, StandardAttribute.name ],
  customAttributes: {
    'myappid': new StringAttribute({ minLen: 5, maxLen: 15 }),
    'callingcode': new NumberAttribute({ min: 1, max: 3 }),
    'isEmployee': new BooleanAttribute(),
    'joinedOn': new DateTimeAttribute()
  },
});
```

As shown in the code snippet, there are data types that are available for custom attributes. The 'String' and 'Number'
data types allow for further constraints on their length and values, respectively.

Custom attributes cannot be marked as required.

### Importing User Pools

Any user pool that has been created outside of this stack, can be imported into the CDK app. Importing a user pool
allows for it to be used in other parts of the CDK app that reference an `IUserPool`. However, imported user pools have
limited configurability. As a rule of thumb, none of the properties that is are part of the
[`AWS::Cognito::UserPool`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html)
CloudFormation resource can be configured.

User pools can be imported either using their id via the `UserPool.fromUserPoolId()`, or by using their ARN, via the
`UserPool.fromUserPoolArn()` API.

```ts
const stack = new Stack(app, 'my-stack');

const awesomePool = UserPool.fromUserPoolId(stack, 'awesome-user-pool', 'us-east-1_oiuR12Abd');

const otherAwesomePool = UserPool.fromUserPoolArn(stack, 'other-awesome-user-pool',
  'arn:aws:cognito-idp:eu-west-1:123456789012:userpool/us-east-1_mtRyYQ14D');
```