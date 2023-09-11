# Architecture Design Record for TableV2

## Title: Implementing grants for TableV2

### Status

Accepted.

### Context

By default, TableV2 will create a table in the region that its parent stack is deployed to. This table can be referred to as the primary table. The API design for the TableV2 construct allows a user to add and configure additional replica tables. As a result, grants for TableV2 could be implemented in two ways:<br>
1. Grants for TableV2 will propagate and be applied to the primary table and all replica tables.
2. Grants for TableV2 will only apply to the primary table.

### Decision

After considering the two choices for implementing grants for TableV2, it was decided that a grant should only apply to the primary table.

### Considerations

We have decided to implement grants for TableV2 such that they only apply to the primary table for the following reasons:<br>
1. Implementing grants to apply to all replica tables would contradict the implementation of metrics which only apply to the primary table. This would result in a confusing user experience due to behavioral differences between metrics and grants which are both defined on the ITable interface.
2. Applying grants to all replica tables and all associated customer-managed KMS keys is counter to the principal of least privilege. Permissions may be given for keys and replica tables that a user is not intending permissions to be given for.
3. The TableV2 API offers users a replica method that can be used to work with an individual instance of a replica table. This can be used to apply grants on a per-replica basis if needed, but this decision should be made by the user.

### Consequences

Some users may expect grants to apply to all replica tables (see: https://github.com/aws/aws-cdk/issues/7362). However, unlike the Table L2 that is replaced by the TableV2 L2, the TableV2 API offers users the replica method as a way to work with individual replica tables. Additionally, the TableV2 API design can support the future implementation of a method allowing a user to retrieve a list of all replica tables. A user could then iterate over each replica table and apply grants each one individually. This design decision supports both use cases while upholding the principle of least privilege.
