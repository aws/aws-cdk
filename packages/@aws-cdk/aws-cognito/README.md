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

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

### User Pools

User Pools allows creating and managing your own directory of users that can sign up and sign in. They enable easy
integration with social identity providers such as Facebook, Google, Amazon, Microsoft Active Directory, etc. through
SAML.

#### Sign Up

Users need to either signed up by the app's administrators or can sign themselves up. You can read more about both these
kinds of sign up and how they work
[here](https://docs.aws.amazon.com/cognito/latest/developerguide/signing-up-users-in-your-app.html).

Further, a welcome email and/or SMS can be configured to be sent automatically once a user has signed up. This welcome
email and/or SMS will carry the temporary password for the user. The user will use this password to log in and reset
their password. The temporary password is valid only for a limited number of days.

All of these options can be configured under the `signUp` property. The pool can be configured to let users sign
themselves up by setting the `selfSignUp` property. A welcome email template can be configured by specifying the
`welcomeEmail` property and a similar `welcomeSms` property for the welcome SMS. The validity of the temporary password
can be specified via the `tempPasswordValidity` property.

The user pool can be configured such that either the user's email address, phone number or both should be verifed at the
time of sign in. Verification is necessary for account recovery, so that there is at least one mode of communication for
a user to reset their password or MFA token when lost.

When either one or both of these are configured to be verified, a confirmation message and/or email are sent at the
time of user sign up that they then enter back into the system to verify these attributes and confirm user sign up.

*Note*: If both email and phone number are specified, Cognito will only verify the phone number. To also verify the
email address, see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-email-phone-verification.html

*Note*: By default, the email and/or phone number attributes will be marked as required if they are specified as a
verified contact method. See [attributes](#attributes) section for details about standard attributes.

> TODO: pre-signup lambda trigger

The `verifyContactMethods` attribute allows for this to be configured.

*Defaults*:
* signUp.selfSignUp: true
* signUp.tempPasswordValidity: 7 days
* signUp.welcomeEmail.subject: 'Thanks for signing up'
* signUp.welcomeEmail.body - 'Hello {username}, Your temporary password is {####}'
* signUp.welcomeSms.message - 'Your temporary password is {####}'
* signUp.verifyContactMethods - Email

Code sample:

```ts
new UserPool(this, 'myuserpool', {
  // ...
  // ...
  signUp: {
    selfSignUp: true,
    tempPasswordValidity: Duration.days(3),
    welcomeEmail: {
      subject: 'Welcome to our awesome app!'
      body: 'Hello {username}, Thanks for signing up to our awesome app! Your temporary password is {####}'
    },
    welcomeSms: {
      message: 'Your temporary password for our awesome app is {####}'
    },
    verifyContactMethods: [ ContactMethods.EMAIL, ContactMethods.PHONE_NUMBER ],
  }
});
```

> Internal Note: Implemented via UserPool-AdminCreateUserConfig, temp password via UserPool-Policies,
> verifyContactMethods via UserPool-AutoVerifiedAttributes.

#### Sign In

These are the various ways a user of your app can sign in. There are 4 options available with the enum `SignInType`:

* USERNAME: Allow signing in using the one time immutable user name that the user chose at the time of sign up.
* PREFERRED\_USERNAME: Allow signing in with an alternate user name that the user can change at any time. However, this
  is not available if the USERNAME option is not chosen.
* EMAIL: Allow signing in using the email address that is associated with the account.
* PHONE\_NUMBER: Allow signing in using the phone number that is associated with the account.

*Defaults*: USERNAME.

Code sample:

```ts
new UserPool(this, 'myuserpool', {
  // ...
  // ...
  signInType: [ SignInType.USERNAME, SignInType.EMAIL ],
});
```

> Internal Note: Implemented via UserPool-UsernameAttributes and -AliasAttributes

#### Attributes

These are the set of attributes you want to collect and store with each user in your user pool. Cognito provides a set
of standard attributes that are available all user pools. Users are allowed to select any of these standard attributes
to be required. Users will not be able to sign up without specifying the attributes that are marked as required. Besides
these, additional attributes can be further defined, known as custom attributes.

Custom attributes cannot be marked as required.

[Go here](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html) for more info.

Standard attributes are available via the `StandardAttrs` enum.

*Note*: By default, the standard attributes 'email' and/or 'phone\_number' will automatically be marked required if
they are one of the verified contact methods. See [Sign up](#sign-up) for details on verified contact methods.

Custom attributes can be specified via the `stringAttr` and `numberAttr` methods, depending on whether the attribute
type is either a string or a number. Constraints can be defined on both string and number types, with length constraint
on the former and range constraint on the latter.

Additionally, two properties `mutable` and `adminOnly` properties can be set for each custom attribute. The former
specifies that the property can be modified by the user while the latter specifies that it can only be modified by the
app's administrator and not by the user (using their access token).

*Defaults*:
* No standard attributes are marked required.
* For all custom attributes, mutable is true and adminOnly is false.

Code sample:

```ts
new UserPool(this, 'myuserpool', {
  // ...
  // ...
  attributes: {
    required: [ StandardAttrs.address, StandardAttrs.name ],
    custom: [
      stringAttr({ name: 'myappid', minLen: 5, maxLen: 15 }),
      numberAttr({ name: 'callingcode', min: 1, max: 3 }),
    ],
  }
});
```

> Internal note: Implemented via UserPool-SchemaAttribute

> Internal note: Follow up - is mutable = false and adminOnly = true allowed?

#### Security

User pools can be configured to enable MFA. It can either be turned off, set to optional or made required. Setting MFA
to optional means that individual users can choose to enable it. Phone numbers must be verified if MFA is enabled.
Additionally, MFA can be sent either via SMS text message or via a time-based software token.
[Go here](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-mfa.html) to learn more.

This can be configured by setting the `mfa.enforcement` option under `security` properties to be one of the values in
the `MfaEnforcement` enum. Available values are `REQUIRED`, `OPTIONAL`, `OFF`.
The type of MFA can be configured by its peer property `type` which can be set to a list of values in the enum
`MfaType`. The available values are `SMS` and `SOFTWARE_TOKEN`.

User pools can be specify the constraints that should be applied when users choose their password. Constraints such as
minimum length, whether lowercase, numbers and/or symbols are required can be specified.

In order to send an SMS, Cognito needs an IAM role that it can assume with permissions that allow it to send an SMS on
behalf of the AWS account. By default, CDK will create this IAM user but allows for it to be overridden via the
`smsRole` permissions.

*Defaults*:
* security.mfa.enforcement: OPTIONAL
* security.mfa.type: SMS
* security.passwordPolicy.minLength: 8
* security.passwordPolicy.required - lowercase, numbers and symbols
* security.smsRole - assumable by `cognito-idp.amazonaws.com` and permitting `sns:Publish` action against resource `*`.
  The role assumption will be conditioned on a strict equals on an ExternalId that will be unique to this user pool.

Code sample:

```ts
new UserPool(this, 'myuserpool', {
  // ...
  // ...
  security: {
    mfa: {
      enforcement: MfaEnforcement.REQUIRED,
      type: [ MfaType.SMS, MfaType.SOFTWARE_TOKEN ]
    },
    passwordPolicy: {
      required: [ PasswordPolicy.LOWERCASE, PasswordPolicy.NUMBERS, PasswordPolicy.SYMBOLS ],
      minLength: 12,
    },
    smsRole: iam.Role.fromRoleArn(/* ... */),
  }
});
```

> Internal Note: Password policy via UserPool-Policies, MFA enable via UserPool-MfaConfiguration; MFA type via
> UserPool-EnabledMfas; smsRole via UserPool-SmsConfiguration

> Internal Note: Account Recovery settings are missing from UserPool CloudFormation resource.

#### Emails

Cognito will handle sending emails to users in the user pool. The address from which emails are sent can be configured
on the user pool via the `from` property, and the `replyTo` property to configure the email where replies are sent.

User pools can also be configured to send emails through Amazon SES, however, that is not yet supported via the CDK. Use
the cfn layer to configure this - https://docs.aws.amazon.com/cdk/latest/guide/cfn_layer.html.

*Defaults*
* email.from - TODO: find the default that Cognito uses.
* email.replyTo - use the same address as from.

Code sample:

```ts
new UserPool(this, 'myuserpool', {
  // ...
  // ...
  email: {
    from: 'noreply@my-awesome-app.com'
    replyTo: 'support@my-awesome-app.com'
  }
});
```

> Internal Note: configured via UserPool-EmailConfiguration

#### Triggers

User pools can be configured with a number of lambda function backed triggers. They are available in the CDK via the
`triggers` property. [Go
here](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html)
to read more about user pool workflows using lambda triggers, and details around each trigger.

Check out the [documentation](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-cognito/lib/user-pool.ts#L148)
to find the list of triggers supported by the CDK.

*Defaults*: no lambda triggers are configured.

Code sample:

```ts
const presignupLambda = new lambda.Function(this, 'presignup' {
  // ...
});

const postsignupLambda = new lambda.Function(this, 'postsignup', {
  // ...
});

new UserPool(this, 'myuserpool', {
  // ...
  // ...
  triggers: {
    preSignUp: presignupLambda,
    postSignUp: postsignupLambda,
    preAuthentication: preauthLambda,
    // ...
  }
});
```

#### Users

> TODO

#### Clients

> TODO

### Identity Pools

Control access of backend APIs and AWS resources for your app's users. Assign users to different roles and permissions,
and get temporary AWS credentials for accessing AWS services.

> TODO
