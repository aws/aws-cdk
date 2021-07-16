## Roles

If a CloudFormation resource has a **Role** property, it normally represents the
IAM role that will be used by the resource to perform operations on behalf of
the user.

Constructs that represent such resources should conform to the following
guidelines.

An optional prop called **role** of type **iam.IRole**should be exposed to allow
users to "bring their own role", and use either an owned or unowned role
_[awslint:role-config-prop]_.

```ts
interface FooProps {
  /**
   * The role to associate with foo.
   * @default - a role will be automatically created
   */
  role?: iam.IRole;
}
```

The construct interface should expose a **role** property, and extends
**iam.IGrantable** _[awslint:role-property]_:

```ts
interface IFoo extends iam.IGrantable {
  /**
   * The role associated with foo. If foo is imported, no role will be available.
   */
  readonly role?: iam.IRole;
}
```

This property will be `undefined` if this is an unowned construct (e.g. was not
defined within the current app).

An **addToRolePolicy** method must be exposed on the construct interface to
allow adding statements to the role's policy _[awslint:role-add-to-policy]_:

```ts
interface IFoo {
  addToRolePolicy(statement: iam.Statement): void;
}
```

If the construct is unowned, this method should no-op and issue a **permissions
notice** (TODO) to the user indicating that they should ensure that the role of
this resource should have the specified permission.

Implementing **IGrantable** brings an implementation burden of **grantPrincipal:
IPrincipal**. This property must be set to the **role** if available, or to a
new **iam.ImportedResourcePrincipal** if the resource is imported and the role
is not available.