"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:enable-lookups
const ec2 = require("@aws-cdk/aws-ec2");
const cdk = require("@aws-cdk/core");
const eks = require("../lib");
const util_1 = require("./util");
class EksClusterStack extends util_1.TestStack {
    constructor(scope, id) {
        super(scope, id);
        /// !show
        const vpc = new ec2.Vpc(this, 'VPC');
        const cluster = new eks.Cluster(this, 'EKSCluster', {
            vpc,
            kubectlEnabled: false,
            defaultCapacity: 0,
        });
        cluster.addCapacity('Nodes', {
            instanceType: new ec2.InstanceType('t2.medium'),
            desiredCapacity: 1,
        });
    }
}
const app = new cdk.App();
// since the EKS optimized AMI is hard-coded here based on the region,
// we need to actually pass in a specific region.
new EksClusterStack(app, 'eks-integ-kubectl-disabled');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWNsdXN0ZXIua3ViZWN0bC1kaXNhYmxlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmVrcy1jbHVzdGVyLmt1YmVjdGwtZGlzYWJsZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvQ0FBb0M7QUFDcEMsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFDOUIsaUNBQW1DO0FBRW5DLE1BQU0sZUFBZ0IsU0FBUSxnQkFBUztJQUNyQyxZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsU0FBUztRQUNULE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFckMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDbEQsR0FBRztZQUNILGNBQWMsRUFBRSxLQUFLO1lBQ3JCLGVBQWUsRUFBRSxDQUFDO1NBQ25CLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO1lBQzNCLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO1lBQy9DLGVBQWUsRUFBRSxDQUFDO1NBQ25CLENBQUMsQ0FBQztLQUVKO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixzRUFBc0U7QUFDdEUsaURBQWlEO0FBQ2pELElBQUksZUFBZSxDQUFDLEdBQUcsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0FBRXZELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnIHByYWdtYTplbmFibGUtbG9va3Vwc1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBUZXN0U3RhY2sgfSBmcm9tICcuL3V0aWwnO1xuXG5jbGFzcyBFa3NDbHVzdGVyU3RhY2sgZXh0ZW5kcyBUZXN0U3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLy8gIXNob3dcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVlBDJyk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHRoaXMsICdFS1NDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAga3ViZWN0bEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgIH0pO1xuXG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnTm9kZXMnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5tZWRpdW0nKSxcbiAgICAgIGRlc2lyZWRDYXBhY2l0eTogMSwgLy8gUmFpc2UgdGhpcyBudW1iZXIgdG8gYWRkIG1vcmUgbm9kZXNcbiAgICB9KTtcbiAgICAvLy8gIWhpZGVcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG4vLyBzaW5jZSB0aGUgRUtTIG9wdGltaXplZCBBTUkgaXMgaGFyZC1jb2RlZCBoZXJlIGJhc2VkIG9uIHRoZSByZWdpb24sXG4vLyB3ZSBuZWVkIHRvIGFjdHVhbGx5IHBhc3MgaW4gYSBzcGVjaWZpYyByZWdpb24uXG5uZXcgRWtzQ2x1c3RlclN0YWNrKGFwcCwgJ2Vrcy1pbnRlZy1rdWJlY3RsLWRpc2FibGVkJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19