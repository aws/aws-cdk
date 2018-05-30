## AWS IAM Construct Library

Define a role and add permissions to it. This will automatically create and
attach an IAM policy to the role:

```ts
const role = new Role(this, 'MyRole', {
  assumedBy: new ServicePrincipal('sns.amazonaws.com')
});
role.addPermission(new Permission('*', 'lambda:InvokeFunction'));
```

Define a policy and attach it to groups, users and roles. Note that it is possible to attach
the policy either by calling `xxx.attachPolicy(policy)` or `policy.attachToXxx(xxx)`.

```ts
const user = new User(this, 'MyUser', { password: '1234' });
const group = new Group(this, 'MyGroup');

const policy = new Policy(this, 'MyPolicy');
policy.attachToUser(user);
group.attachPolicy(policy);
```

Managed policies can be attached using `xxx.attachManagedPolicy(arn)`:

```ts
const group = new Group(this, 'MyGroup');
group.attachManagedPolicy('arn:aws:iam::aws:policy/AdministratorAccess');
```

### Features

 * Policy name uniqueness is enforced. If two policies by the same name are attached to the same
   principal, the attachment will fail.
 * Policy names are not required - the CDK logical ID will be used and ensured to be unique.
