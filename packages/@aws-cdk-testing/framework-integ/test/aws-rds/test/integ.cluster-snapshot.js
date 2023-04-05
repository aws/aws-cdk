"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const lambda = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const cr = require("aws-cdk-lib/custom-resources");
const constructs_1 = require("constructs");
const rds = require("aws-cdk-lib/aws-rds");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1 });
        const cluster = new rds.DatabaseCluster(this, 'Cluster', {
            engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_10_2 }),
            instanceProps: {
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
                vpc,
            },
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        const snapshoter = new Snapshoter(this, 'Snapshoter', {
            cluster,
            snapshotIdentifier: 'cdk-integ-cluster-snapshot',
        });
        const fromSnapshot = new rds.DatabaseClusterFromSnapshot(this, 'FromSnapshot', {
            snapshotIdentifier: snapshoter.snapshotArn,
            snapshotCredentials: rds.SnapshotCredentials.fromGeneratedSecret('admin'),
            engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_10_2 }),
            instanceProps: {
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
                vpc,
            },
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        fromSnapshot.addRotationSingleUser();
    }
}
class Snapshoter extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const clusterArn = aws_cdk_lib_1.Stack.of(this).formatArn({
            service: 'rds',
            resource: 'cluster',
            resourceName: props.cluster.clusterIdentifier,
            arnFormat: aws_cdk_lib_1.ArnFormat.COLON_RESOURCE_NAME,
        });
        const snapshotArn = aws_cdk_lib_1.Stack.of(this).formatArn({
            service: 'rds',
            resource: 'cluster-snapshot',
            resourceName: props.snapshotIdentifier,
            arnFormat: aws_cdk_lib_1.ArnFormat.COLON_RESOURCE_NAME,
        });
        const code = lambda.Code.fromAsset(path.join(__dirname, 'snapshot-handler'));
        const onEventHandler = new lambda.Function(this, 'OnEventHandler', {
            code,
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.onEventHandler',
        });
        onEventHandler.addToRolePolicy(new iam.PolicyStatement({
            actions: ['rds:CreateDBClusterSnapshot', 'rds:DeleteDBClusterSnapshot'],
            resources: [clusterArn, snapshotArn],
        }));
        const isCompleteHandler = new lambda.Function(this, 'IsCompleteHandler', {
            code,
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.isCompleteHandler',
        });
        isCompleteHandler.addToRolePolicy(new iam.PolicyStatement({
            actions: ['rds:DescribeDBClusterSnapshots'],
            resources: [clusterArn, snapshotArn],
        }));
        const provider = new cr.Provider(this, 'SnapshotProvider', {
            onEventHandler,
            isCompleteHandler,
        });
        const customResource = new aws_cdk_lib_1.CustomResource(this, 'Snapshot', {
            resourceType: 'Custom::Snapshoter',
            serviceToken: provider.serviceToken,
            properties: {
                DBClusterIdentifier: props.cluster.clusterIdentifier,
                DBClusterSnapshotIdentifier: props.snapshotIdentifier,
            },
        });
        this.snapshotArn = customResource.getAttString('DBClusterSnapshotArn');
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-integ-cluster-snapshot');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2x1c3Rlci1zbmFwc2hvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNsdXN0ZXItc25hcHNob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyxpREFBaUQ7QUFDakQsNkNBQStGO0FBQy9GLG1EQUFtRDtBQUNuRCwyQ0FBdUM7QUFDdkMsMkNBQTJDO0FBRTNDLE1BQU0sU0FBVSxTQUFRLG1CQUFLO0lBQzNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXBFLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ3ZELE1BQU0sRUFBRSxHQUFHLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNuRyxhQUFhLEVBQUU7Z0JBQ2IsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO2dCQUN2RixHQUFHO2FBQ0o7WUFDRCxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1NBQ3JDLENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDcEQsT0FBTztZQUNQLGtCQUFrQixF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QkFBa0IsRUFBRTtZQUN6RCxjQUFjO1lBQ2QsaUJBQWlCO1NBQ2xCLENBQUMsQ0FBQztRQUVILE1BQU0sY0FBYyxHQUFHLElBQUksNEJBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzFELFlBQVksRUFBRSxvQkFBb0I7WUFDbEMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZO1lBQ25DLFVBQVUsRUFBRTtnQkFDVixtQkFBbUIsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQjtnQkFDcEQsMkJBQTJCLEVBQUUsS0FBSyxDQUFDLGtCQUFrQjthQUN0RDtTQUNGLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0FBQ2pELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBBcHAsIEFybkZvcm1hdCwgQ3VzdG9tUmVzb3VyY2UsIFJlbW92YWxQb2xpY3ksIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgY3IgZnJvbSAnYXdzLWNkay1saWIvY3VzdG9tLXJlc291cmNlcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIHJkcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtcmRzJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG1heEF6czogMiwgbmF0R2F0ZXdheXM6IDEgfSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IHJkcy5EYXRhYmFzZUNsdXN0ZXIodGhpcywgJ0NsdXN0ZXInLCB7XG4gICAgICBlbmdpbmU6IHJkcy5EYXRhYmFzZUNsdXN0ZXJFbmdpbmUuYXVyb3JhTXlzcWwoeyB2ZXJzaW9uOiByZHMuQXVyb3JhTXlzcWxFbmdpbmVWZXJzaW9uLlZFUl8yXzEwXzIgfSksXG4gICAgICBpbnN0YW5jZVByb3BzOiB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5CVVJTVEFCTEUzLCBlYzIuSW5zdGFuY2VTaXplLlNNQUxMKSxcbiAgICAgICAgdnBjLFxuICAgICAgfSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNuYXBzaG90ZXIgPSBuZXcgU25hcHNob3Rlcih0aGlzLCAnU25hcHNob3RlcicsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBzbmFwc2hvdElkZW50aWZpZXI6ICdjZGstaW50ZWctY2x1c3Rlci1zbmFwc2hvdCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBmcm9tU25hcHNob3QgPSBuZXcgcmRzLkRhdGFiYXNlQ2x1c3RlckZyb21TbmFwc2hvdCh0aGlzLCAnRnJvbVNuYXBzaG90Jywge1xuICAgICAgc25hcHNob3RJZGVudGlmaWVyOiBzbmFwc2hvdGVyLnNuYXBzaG90QXJuLFxuICAgICAgc25hcHNob3RDcmVkZW50aWFsczogcmRzLlNuYXBzaG90Q3JlZGVudGlhbHMuZnJvbUdlbmVyYXRlZFNlY3JldCgnYWRtaW4nKSxcbiAgICAgIGVuZ2luZTogcmRzLkRhdGFiYXNlQ2x1c3RlckVuZ2luZS5hdXJvcmFNeXNxbCh7IHZlcnNpb246IHJkcy5BdXJvcmFNeXNxbEVuZ2luZVZlcnNpb24uVkVSXzJfMTBfMiB9KSxcbiAgICAgIGluc3RhbmNlUHJvcHM6IHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkJVUlNUQUJMRTMsIGVjMi5JbnN0YW5jZVNpemUuU01BTEwpLFxuICAgICAgICB2cGMsXG4gICAgICB9LFxuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgIH0pO1xuICAgIGZyb21TbmFwc2hvdC5hZGRSb3RhdGlvblNpbmdsZVVzZXIoKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgU25hcHNob3RlclByb3BzIHtcbiAgcmVhZG9ubHkgY2x1c3RlcjogcmRzLklEYXRhYmFzZUNsdXN0ZXI7XG4gIHJlYWRvbmx5IHNuYXBzaG90SWRlbnRpZmllcjogc3RyaW5nO1xufVxuXG5jbGFzcyBTbmFwc2hvdGVyIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHJlYWRvbmx5IHNuYXBzaG90QXJuOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFNuYXBzaG90ZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBjbHVzdGVyQXJuID0gU3RhY2sub2YodGhpcykuZm9ybWF0QXJuKHtcbiAgICAgIHNlcnZpY2U6ICdyZHMnLFxuICAgICAgcmVzb3VyY2U6ICdjbHVzdGVyJyxcbiAgICAgIHJlc291cmNlTmFtZTogcHJvcHMuY2x1c3Rlci5jbHVzdGVySWRlbnRpZmllcixcbiAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzbmFwc2hvdEFybiA9IFN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAncmRzJyxcbiAgICAgIHJlc291cmNlOiAnY2x1c3Rlci1zbmFwc2hvdCcsXG4gICAgICByZXNvdXJjZU5hbWU6IHByb3BzLnNuYXBzaG90SWRlbnRpZmllcixcbiAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBjb2RlID0gbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdzbmFwc2hvdC1oYW5kbGVyJykpO1xuICAgIGNvbnN0IG9uRXZlbnRIYW5kbGVyID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnT25FdmVudEhhbmRsZXInLCB7XG4gICAgICBjb2RlLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE2X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXgub25FdmVudEhhbmRsZXInLFxuICAgIH0pO1xuICAgIG9uRXZlbnRIYW5kbGVyLmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ3JkczpDcmVhdGVEQkNsdXN0ZXJTbmFwc2hvdCcsICdyZHM6RGVsZXRlREJDbHVzdGVyU25hcHNob3QnXSxcbiAgICAgIHJlc291cmNlczogW2NsdXN0ZXJBcm4sIHNuYXBzaG90QXJuXSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCBpc0NvbXBsZXRlSGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0lzQ29tcGxldGVIYW5kbGVyJywge1xuICAgICAgY29kZSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNl9YLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmlzQ29tcGxldGVIYW5kbGVyJyxcbiAgICB9KTtcbiAgICBpc0NvbXBsZXRlSGFuZGxlci5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydyZHM6RGVzY3JpYmVEQkNsdXN0ZXJTbmFwc2hvdHMnXSxcbiAgICAgIHJlc291cmNlczogW2NsdXN0ZXJBcm4sIHNuYXBzaG90QXJuXSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCBwcm92aWRlciA9IG5ldyBjci5Qcm92aWRlcih0aGlzLCAnU25hcHNob3RQcm92aWRlcicsIHtcbiAgICAgIG9uRXZlbnRIYW5kbGVyLFxuICAgICAgaXNDb21wbGV0ZUhhbmRsZXIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBjdXN0b21SZXNvdXJjZSA9IG5ldyBDdXN0b21SZXNvdXJjZSh0aGlzLCAnU25hcHNob3QnLCB7XG4gICAgICByZXNvdXJjZVR5cGU6ICdDdXN0b206OlNuYXBzaG90ZXInLFxuICAgICAgc2VydmljZVRva2VuOiBwcm92aWRlci5zZXJ2aWNlVG9rZW4sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIERCQ2x1c3RlcklkZW50aWZpZXI6IHByb3BzLmNsdXN0ZXIuY2x1c3RlcklkZW50aWZpZXIsXG4gICAgICAgIERCQ2x1c3RlclNuYXBzaG90SWRlbnRpZmllcjogcHJvcHMuc25hcHNob3RJZGVudGlmaWVyLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICB0aGlzLnNuYXBzaG90QXJuID0gY3VzdG9tUmVzb3VyY2UuZ2V0QXR0U3RyaW5nKCdEQkNsdXN0ZXJTbmFwc2hvdEFybicpO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbm5ldyBUZXN0U3RhY2soYXBwLCAnY2RrLWludGVnLWNsdXN0ZXItc25hcHNob3QnKTtcbmFwcC5zeW50aCgpO1xuIl19