# Architecture Design Record for Global Tables

## Title: Implementing grants for Global Tables

### Status

Accepted.

### Context

By default, a Global Table has one primary Replica Table in the region that its parent stack is deployed to. The API design for the Global Table L2 construct allows a user to add and configure additional Replica Tables. As a result, grants for a Global Table could be implemented in two ways:<br>
1. Grants for a Global Table will propagate and be applied to all of it's Replica Tables.
2. Grants for a Global Table will only apply to the primary Replica Table.

### Decision

After considering the two choices for implementing grants for a Global Table, it was decided that a grant should only apply to the Global Table's primary Replica Table.

### Considerations

We have decided to implement grants for Global Tables such that they only apply to the primary Replica Table for the following reasons:<br>
1. It is only possible to implement metrics for the primary Replica Table of a Global Table. Implementing grants to apply to all Replica Tables would result in a confusing user experience.
2. Applying grants to all Replica Tables and all associated customer-managed KMS keys is counter to the principal of least privilege. Permissions may be given for keys and Replica Tables that a user is not intending permissions to be given for.
3. The Global Table API offers users a replica method that can be used to work with an individual instance of a Replica Table. This can be used to apply grants on a per-replica basis if needed, but this decision should be made by the user.

### Consequences

Some users may expect grants to apply to all Replica Tables (see: https://github.com/aws/aws-cdk/issues/7362). However, unlike the Table L2 that will precede the Global Table L2, the Global Table API offers users the replica method as a way to work with individual Replica Tables. Additionally, the Global Table API design can support the future implementation of a method allowing a user to retrieve a list of all Replica Tables. A user could then iterate over each Replica Table and apply grants to all Replica Tables individually. This design decision supports both use cases while upholding the principle of least privilege.
