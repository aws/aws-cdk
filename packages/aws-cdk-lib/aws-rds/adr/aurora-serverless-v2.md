# Aurora Serverless V2

> **Note** recommended reading https://aws.amazon.com/blogs/database/evaluate-amazon-aurora-serverless-v2-for-your-provisioned-aurora-clusters/

## Status

accepted

## Context

Recently RDS Aurora clusters added support for [Aurora Serverless
V2](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html).
Prior to that there were two types of clusters that you could create.

1. A Serverless v1 cluster
2. A provisioned cluster

Each of these clusters only supported a single type of DB instance (serverless
or provisioned) and it was not possible to mix the two types of instances
together. With the addition of Serverless V2 it is now possible to create a
cluster which has _both_ provisioned instances and serverless v2 instances.

### Current API

With the current API you create a cluster and specify the number of instances to
create and the properties to apply to _all_ of the instances. You do not have
granular control over each individual instance.

```ts
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_08_1 }),
  instances: 3, // default is 2
  instanceProps: {
    // optional , defaults to t3.medium
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
    vpc,
  },
});
```

### Serverless v2

#### Capacity & Scaling

Some things to take into consideration with Aurora Serverless v2.

To create a cluster that can support serverless v2 instance you configure a
minimum and maximum capacity range. This looks something like

```json
{
  "MaxCapacity": 128, // max value
  "MinCapacity": 0.5 // min value
}
```

The capacity is defined as a number of Aurora capacity units (ACUs). You can
specify in half-step increments (40, 40.5, 41, etc).

The maximum capacity is mainly used for budget control since it allows you to
set a cap on how high your instance can scale.

The minimum capacity is a little more involved. This controls a couple different
things. More complete details can be found [in the docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.setting-capacity.html#aurora-serverless-v2-examples-setting-capacity-range-for-cluster)

1. How low can the instance scale down. If there is no traffic to the cluster
   this is the minimum capacity that is allowed.
2. How fast can the instance scale up. The scaling rate of an Aurora Serverless
   v2 instance depends on its current capacity. The higher the current capacity,
   the faster it can scale up. So for example, if you need to very quickly scale
   up to high capacity, you might have to set the minimum higher to allow for
   faster scaling.
3. If you have a higher amount of data in the buffer cache you may have to set
   the minimum higher so that data is not evicted from the buffer cache when
   then instances scale down.
4. Some features require certain minimums
    - Performance insights - 2 ACUs
    - Aurora global databases - 8 ACUs (in primary region)
5. For high write workloads with serverless v2 readers in tiers 2-15 (more on
   tiers below), you may need to provision a higher minimum capacity to reduce
   replica lag.
     - When using a provisioned writer, you should set the minimum capacity to a
       value that represents a comparable amount of memory and CPU to the
       writer. (this is only if you notice replication lag)


Another way that you control the capacity/scaling of your serverless v2 reader
instances is based on the [promotion tier](https://aws.amazon.com/blogs/aws/additional-failover-control-for-amazon-aurora/)
which can be between 0-15. Previously with all provisioned clusters this didn't
matter too much (we set everything to 1), but with serverless v2 it starts to
matter. Any serverless v2 instance in the 0-1 tiers will scale alongside the
writer even if the current read load does not require the capacity. This is
because instances in the 0-1 tier are first priority for failover and Aurora
wants to ensure that in the event of a failover the reader that gets promoted is
scaled to handle the write load.

- Serverless v2 readers in tier 0-1 scale with the writer
- Serverless v2 readers in tier 2-15 scale with the read load on itself.

### Serverless v2 vs Provisioned

Serverless v2 can go up to 256GB memory. Anything above that needs to be provisioned.
   - For example, if the CPU utilization for a db.r6g.4xlarge (128 GB)
     instance stays at 10% most times, then the minimum ACUs may be set
     at 6.5 ACUs (10% of 128 GB) and maximum may be set at 64 ACUs (64x2GB=128GB).
   - But if using a db.r6g.16xlarge (512 GB) a serverles v2 instance can't scale
     to match

Out of the 4 common usage patters (peaks & valleys, outliers, random, and
consistent), provisioned should be preferred for the consistent pattern. With
mixed use cluster you may have writers/readers that follow different patters.
For example, you may have a writer that follows the `consistent` pattern, but a
reader that follows the `outliers` pattern. In this case you may want to have a
provisioned instance as the writer along with a provisioned reader in tier 0-1
(for failover) and then a serverless v2 reader in tier 2-15 (so it scales with the spotty reader)
writer).

If you are currently using auto scaling with provisioned instances, you should
instead switch to instance scaling with serverless v2. This allows for a larger
pool of serverless readers with the appropriate cluster capacity range. Vertical
scaling at the serverless instance level is much faster compared to launching
new instances. For example, using the case above, using a single `db.r6g.4xlarge`
reader instance with auto scaling configured would add new `db.r6g.4xlarge` instances
when the cluster auto scaled. Alternatively you could provision a couple serverless reader instances
with min=6.5/max=64. These serverless instances would scale up faster (with the read load split between them)
than adding new provisioned instances.

## Constraints

Some of these are discussed in more detail above, but reposting here for
clarity.

1. Max `MaxCapacity` of 128 (256GB)
2. Min `MinCapacity` of 0.5 (1GB) (*with some exceptions)
3. Supports engine version MySQL 8+ & PostgreSQL 13+
4. Scaling rate depends on capacity and promotion tier

## Decision

The major decision is whether we should update the existing
`rds.DatabaseCluster` API to take into account all these new constraints or
create an entirely new API (i.e. `rds.DatabaseClusterV2`). I am proposing that
we update the existing API since this will allow existing users to migrate.

The changes we would need to make is to switch the `instanceProps` property from
required to optional and deprecate it. Add a new property `clusterInstances`
which would look something like:

_updates to core_
```ts
interface DatabaseClusterBaseProps {
  ...
  /**
   * @deprecated - use clusterInstances instead
   */
  readonly instances?: number;
  /**
   * @deprecated - use clusterInstances instead
   */
  readonly instanceProps?: InstanceProps;
  readonly clusterInstances?: ClusterInstances;
}

interface ClusterInstances {
  readonly writer: IClusterInstance;
  readonly readers?: IClusterInstance[];
}

class ClusterInstance implements IClusterInstance {
  public static provisioned(id: string, props: ProvisionedClusterInstanceProps = {}): IClusterInstance {
    return new ClusterInstance(id, {
      ...props,
      instanceType: ClusterInstanceType.provisioned(props.instanceType),
    });
  }

  public static serverlessV2(id: string, props: ServerlessV2ClusterInstanceProps = {}): IClusterInstance {
    return new ClusterInstance(id, {
      ...props,
      instanceType: ClusterInstanceType.serverlessV2(),
    });
  }
  private constructor(private id: string, private readonly props: ClusterInstanceProps = {}) { }

  public bind(scope: Construct, cluster: DatabaseCluster, props: ClusterInstanceBindOptions): IAuroraClusterInstance {
    // new class to represent this concept
    return new AuroraClusterInstance(scope, this.id, {
      cluster,
      ...this.props,
      ...props,
    });
  }
}
```

_user configuration_ (properties are not shown to focus on the API)
```ts
new rds.DatabaseCluster(this, 'Cluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_03_0 }),
  // capacity applies to all serverless instances in the cluster
  serverlessV2MaxCapacity: 1,
  serverlessV2MinCapacity: 0.5,
  writer: ClusterInstance.provisioned('writer', { ...props }),
  readers: [
    // puts it in promition tier 0-1
    ClusterInstance.serverlessV2('reader1', { scaleWithWriter: true, ...additionalProps }),
    ClusterInstance.serverlessV2('reader2'),
    ClusterInstance.serverlessV2('reader3'),
    // illustrating how it might be possible to add support for groups in the future.
    // currently not supported by CFN
    ClusterInstance.fromReaderGroup('analytics', { ...readerProps }),
  },
});
```

We can also provide instructions on how to migrate from `instanceProps` to
`clusterInstances` which would just entail overwriting the logicalId of the
instances. We could also add something like `ClusterInstance.fromInstanceProps(props: InstanceProps)`
that allows customers to more easily migrate their existing configuration.

## Alternatives

The other alternative that was considered was to create an entirely new API
(i.e. `rds.DatabaseClusterV2`). This was considered because it would allow us to
create an API that was more tailored to the new functionality. Given all the
context above, it was also originally unclear whether or not it would be possible
to update the existing API while accounting for all the nuances with Serverless
V2.

Ultimately this was discarded because it looks like we will be able to account
for the nuances and the benefit of allowing users to continue to use the
existing API outweigh any ergonomic benefits of a completely new API.

## Consequences

The main consequence of this decision is maybe just some confusion on how
to use the new properties vs the old ones and changing some property validation
from linter to runtime validation (`instanceProps` was required and would show
in the IDE if not provided. Now you will get a runtime error if you don't
provide `clusterInstances` or `instanceProps`). This would essentially make the
TypeScript experience match the experience of other languages.
