## State

Persistent resources are AWS resource which hold persistent state, such as
databases, tables, buckets, etc.

To make sure stateful resources can be easily identified, all resource
constructs must include the **@stateful** or **@stateless** JSDoc annotations at
the class level _[awslint:state-annotation]_.

This annotation enables the following linting rules.

```ts
/**
 * @stateful
 */
export class Table { }
```

Persistent resources must have a **removalPolicy** prop, defaults to
**Orphan** _[awslint:state-removal-policy-prop]_:

```ts
import { RemovalPolicy } from '@aws-cdk/cdk';

export interface TableProps {
  /**
   * @default ORPHAN
   */
  readonly removalPolicy?: RemovalPolicy;
}
```

Removal policy is applied at the CFN resource level using the
**RemovalPolicy.apply(resource)**:

```ts
RemovalPolicy.apply(cfnTable, props.removalPolicy);
```

The **IResource** interface requires that all resource constructs implement a
property **stateful** which returns **true** or **false** to allow runtime
checks query whether a resource is persistent
_[awslint:state-stateful-property]_.