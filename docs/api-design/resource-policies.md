## Resource Policies

Resource policies are IAM policies defined on the side of the resource (as
oppose to policies attached to the IAM principal). Different resources expose
different APIs for controlling their resource policy. For example, ECR
repositories have a **RepositoryPolicyText** prop, SQS queues offer a
**QueuePolicy** resource, etc.

Constructs that represents resources with a resource policy should encapsulate
the details of how resource policies are created behind a uniform API as
described in this section.

When a construct represents an AWS resource that supports a resource policy, it
should expose an optional prop that will allow initializing resource with a
specified policy _[awslint:resource-policy-prop]_:

```ts
resourcePolicy?: iam.PolicyStatement[]
```

Furthermore, the construct *interface* should include a method that allows users
to add statements to the resource policy
_[awslint:resource-policy-add-to-policy]_:

```ts
interface IFoo extends iam.IResourceWithPolicy {
  addToResourcePolicy(statement: iam.PolicyStatement): void;
}
```

For some resources, such as ECR repositories, it is impossible (in
CloudFormation) to add a resource policy if the resource is unowned (the policy
is coupled with the resource creation). In such cases, the implementation of
`addToResourcePolicy` should add a **permission** **notice** to the construct
(using `node.addInfo`) indicating to the user that they must ensure that the
resource policy of that specified resource should include the specified
statement.
