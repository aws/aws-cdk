"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const integ_tests_kubernetes_version_1 = require("./integ-tests-kubernetes-version");
const eks = require("../lib");
const lib_1 = require("../lib");
class EksClusterStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        // allow all account users to assume this role in order to admin the cluster
        const mastersRole = new iam.Role(this, 'AdminRole', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        // just need one nat gateway to simplify the test
        this.vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });
        // create the cluster with a default nodegroup capacity
        this.cluster = new eks.Cluster(this, 'Cluster', {
            vpc: this.vpc,
            mastersRole,
            defaultCapacity: 0,
            ...integ_tests_kubernetes_version_1.getClusterVersionConfig(this),
        });
        this.cluster.addNodegroupCapacity('BottlerocketNG1', {
            amiType: lib_1.NodegroupAmiType.BOTTLEROCKET_X86_64,
        });
        this.cluster.addNodegroupCapacity('BottlerocketNG2', {
            amiType: lib_1.NodegroupAmiType.BOTTLEROCKET_ARM_64,
        });
    }
}
const app = new core_1.App();
const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-bottlerocket-ng-test');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-bottlerocket-ng', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWJvdHRsZXJvY2tldC1uZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmVrcy1ib3R0bGVyb2NrZXQtbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBNkM7QUFDN0Msd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyx3Q0FBMkM7QUFDM0MsOENBQThDO0FBQzlDLHFGQUEyRTtBQUMzRSw4QkFBOEI7QUFDOUIsZ0NBQTBDO0FBRTFDLE1BQU0sZUFBZ0IsU0FBUSxZQUFLO0lBS2pDLFlBQVksS0FBVSxFQUFFLEVBQVU7UUFDaEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQiw0RUFBNEU7UUFDNUUsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDbEQsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLG9CQUFvQixFQUFFO1NBQzFDLENBQUMsQ0FBQztRQUVILGlEQUFpRDtRQUNqRCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFeEQsdURBQXVEO1FBQ3ZELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDOUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsV0FBVztZQUNYLGVBQWUsRUFBRSxDQUFDO1lBQ2xCLEdBQUcsd0RBQXVCLENBQUMsSUFBSSxDQUFDO1NBQ2pDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsaUJBQWlCLEVBQUU7WUFDbkQsT0FBTyxFQUFFLHNCQUFnQixDQUFDLG1CQUFtQjtTQUM5QyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLGlCQUFpQixFQUFFO1lBQ25ELE9BQU8sRUFBRSxzQkFBZ0IsQ0FBQyxtQkFBbUI7U0FDOUMsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFFdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFlLENBQUMsR0FBRyxFQUFFLDBDQUEwQyxDQUFDLENBQUM7QUFDbkYsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxxQ0FBcUMsRUFBRTtJQUM5RCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgcHJhZ21hOmRpc2FibGUtdXBkYXRlLXdvcmtmbG93XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgeyBnZXRDbHVzdGVyVmVyc2lvbkNvbmZpZyB9IGZyb20gJy4vaW50ZWctdGVzdHMta3ViZXJuZXRlcy12ZXJzaW9uJztcbmltcG9ydCAqIGFzIGVrcyBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgTm9kZWdyb3VwQW1pVHlwZSB9IGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIEVrc0NsdXN0ZXJTdGFjayBleHRlbmRzIFN0YWNrIHtcblxuICBwcml2YXRlIGNsdXN0ZXI6IGVrcy5DbHVzdGVyO1xuICBwcml2YXRlIHZwYzogZWMyLklWcGM7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBhbGxvdyBhbGwgYWNjb3VudCB1c2VycyB0byBhc3N1bWUgdGhpcyByb2xlIGluIG9yZGVyIHRvIGFkbWluIHRoZSBjbHVzdGVyXG4gICAgY29uc3QgbWFzdGVyc1JvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0FkbWluUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpLFxuICAgIH0pO1xuXG4gICAgLy8ganVzdCBuZWVkIG9uZSBuYXQgZ2F0ZXdheSB0byBzaW1wbGlmeSB0aGUgdGVzdFxuICAgIHRoaXMudnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHsgbmF0R2F0ZXdheXM6IDEgfSk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIGNsdXN0ZXIgd2l0aCBhIGRlZmF1bHQgbm9kZWdyb3VwIGNhcGFjaXR5XG4gICAgdGhpcy5jbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHRoaXMsICdDbHVzdGVyJywge1xuICAgICAgdnBjOiB0aGlzLnZwYyxcbiAgICAgIG1hc3RlcnNSb2xlLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgLi4uZ2V0Q2x1c3RlclZlcnNpb25Db25maWcodGhpcyksXG4gICAgfSk7XG5cbiAgICB0aGlzLmNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ0JvdHRsZXJvY2tldE5HMScsIHtcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuQk9UVExFUk9DS0VUX1g4Nl82NCxcbiAgICB9KTtcbiAgICB0aGlzLmNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ0JvdHRsZXJvY2tldE5HMicsIHtcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuQk9UVExFUk9DS0VUX0FSTV82NCxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IEVrc0NsdXN0ZXJTdGFjayhhcHAsICdhd3MtY2RrLWVrcy1jbHVzdGVyLWJvdHRsZXJvY2tldC1uZy10ZXN0Jyk7XG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ2F3cy1jZGstZWtzLWNsdXN0ZXItYm90dGxlcm9ja2V0LW5nJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcbmFwcC5zeW50aCgpO1xuIl19