## AWS IAM Construct Library

Define a role and add permissions to it. This will automatically create and
attach an IAM policy to the role:

[attaching permissions to role](test/example.role.lit.ts)

Define a policy and attach it to groups, users and roles. Note that it is possible to attach
the policy either by calling `xxx.attachInlinePolicy(policy)` or `policy.attachToXxx(xxx)`.

[attaching policies to user and group](test/example.attaching.lit.ts)

Managed policies can be attached using `xxx.attachManagedPolicy(arn)`:

[attaching managed policies](test/example.managedpolicy.lit.ts)

### Configuring an ExternalId

If you need to create roles that will be assumed by 3rd parties, it is generally a good idea to [require an `ExternalId`
to assume them](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html).  Configuring
an `ExternalId` works like this:

[supplying an external ID](test/example.external-id.lit.ts)

### Features

 * Policy name uniqueness is enforced. If two policies by the same name are attached to the same
   principal, the attachment will fail.
 * Policy names are not required - the CDK logical ID will be used and ensured to be unique.
