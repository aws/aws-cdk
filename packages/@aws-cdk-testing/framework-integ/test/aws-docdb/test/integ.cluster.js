"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const kms = require("aws-cdk-lib/aws-kms");
const cdk = require("aws-cdk-lib");
const aws_docdb_1 = require("aws-cdk-lib/aws-docdb");
/*
 * Stack verification steps:
 * * aws docdb describe-db-clusters --db-cluster-identifier <deployed db cluster identifier>
 */
class TestStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2 });
        const params = new aws_docdb_1.ClusterParameterGroup(this, 'Params', {
            family: 'docdb3.6',
            description: 'A nice parameter group',
            parameters: {
                audit_logs: 'disabled',
                tls: 'enabled',
                ttl_monitor: 'enabled',
            },
        });
        const kmsKey = new kms.Key(this, 'DbSecurity', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        const cluster = new aws_docdb_1.DatabaseCluster(this, 'Database', {
            engineVersion: '3.6.0',
            masterUser: {
                username: 'docdb',
                password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6'),
            },
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE),
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
            vpc,
            parameterGroup: params,
            kmsKey,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            enablePerformanceInsights: true,
        });
        cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');
    }
}
const app = new cdk.App();
new TestStack(app, 'aws-cdk-docdb-integ');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLG1DQUFtQztBQUVuQyxxREFBK0U7QUFFL0U7OztHQUdHO0FBRUgsTUFBTSxTQUFVLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDL0IsWUFBWSxLQUEyQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUN6RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXBELE1BQU0sTUFBTSxHQUFHLElBQUksaUNBQXFCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUN2RCxNQUFNLEVBQUUsVUFBVTtZQUNsQixXQUFXLEVBQUUsd0JBQXdCO1lBQ3JDLFVBQVUsRUFBRTtnQkFDVixVQUFVLEVBQUUsVUFBVTtnQkFDdEIsR0FBRyxFQUFFLFNBQVM7Z0JBQ2QsV0FBVyxFQUFFLFNBQVM7YUFDdkI7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUM3QyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1NBQ3pDLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUFHLElBQUksMkJBQWUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BELGFBQWEsRUFBRSxPQUFPO1lBQ3RCLFVBQVUsRUFBRTtnQkFDVixRQUFRLEVBQUUsT0FBTztnQkFDakIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtDQUFrQyxDQUFDO2FBQzlFO1lBQ0QsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO1lBQy9FLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUNqRCxHQUFHO1lBQ0gsY0FBYyxFQUFFLE1BQU07WUFDdEIsTUFBTTtZQUNOLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMseUJBQXlCLEVBQUUsSUFBSTtTQUNoQyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsV0FBVyxDQUFDLDJCQUEyQixDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDdkUsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLHFCQUFxQixDQUFDLENBQUM7QUFFMUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1rbXMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGNvbnN0cnVjdHMgZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBEYXRhYmFzZUNsdXN0ZXIsIENsdXN0ZXJQYXJhbWV0ZXJHcm91cCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1kb2NkYic7XG5cbi8qXG4gKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHM6XG4gKiAqIGF3cyBkb2NkYiBkZXNjcmliZS1kYi1jbHVzdGVycyAtLWRiLWNsdXN0ZXItaWRlbnRpZmllciA8ZGVwbG95ZWQgZGIgY2x1c3RlciBpZGVudGlmaWVyPlxuICovXG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZQQycsIHsgbWF4QXpzOiAyIH0pO1xuXG4gICAgY29uc3QgcGFyYW1zID0gbmV3IENsdXN0ZXJQYXJhbWV0ZXJHcm91cCh0aGlzLCAnUGFyYW1zJywge1xuICAgICAgZmFtaWx5OiAnZG9jZGIzLjYnLFxuICAgICAgZGVzY3JpcHRpb246ICdBIG5pY2UgcGFyYW1ldGVyIGdyb3VwJyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgYXVkaXRfbG9nczogJ2Rpc2FibGVkJyxcbiAgICAgICAgdGxzOiAnZW5hYmxlZCcsXG4gICAgICAgIHR0bF9tb25pdG9yOiAnZW5hYmxlZCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3Qga21zS2V5ID0gbmV3IGttcy5LZXkodGhpcywgJ0RiU2VjdXJpdHknLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBEYXRhYmFzZUNsdXN0ZXIodGhpcywgJ0RhdGFiYXNlJywge1xuICAgICAgZW5naW5lVmVyc2lvbjogJzMuNi4wJyxcbiAgICAgIG1hc3RlclVzZXI6IHtcbiAgICAgICAgdXNlcm5hbWU6ICdkb2NkYicsXG4gICAgICAgIHBhc3N3b3JkOiBjZGsuU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KCc3OTU5ODY2Y2FjYzAyYzJkMjQzZWNmZTE3NzQ2NGZlNicpLFxuICAgICAgfSxcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5SNSwgZWMyLkluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9LFxuICAgICAgdnBjLFxuICAgICAgcGFyYW1ldGVyR3JvdXA6IHBhcmFtcyxcbiAgICAgIGttc0tleSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBlbmFibGVQZXJmb3JtYW5jZUluc2lnaHRzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY2x1c3Rlci5jb25uZWN0aW9ucy5hbGxvd0RlZmF1bHRQb3J0RnJvbUFueUlwdjQoJ09wZW4gdG8gdGhlIHdvcmxkJyk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxubmV3IFRlc3RTdGFjayhhcHAsICdhd3MtY2RrLWRvY2RiLWludGVnJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19