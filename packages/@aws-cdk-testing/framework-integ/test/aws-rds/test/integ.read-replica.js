"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const rds = require("aws-cdk-lib/aws-rds");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new aws_ec2_1.Vpc(this, 'Vpc', {
            maxAzs: 2,
            subnetConfiguration: [
                {
                    name: 'isolated',
                    subnetType: aws_ec2_1.SubnetType.PRIVATE_ISOLATED,
                },
            ],
        });
        const instanceType = aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.T3, aws_ec2_1.InstanceSize.SMALL);
        const vpcSubnets = { subnetType: aws_ec2_1.SubnetType.PRIVATE_ISOLATED };
        const postgresSource = new rds.DatabaseInstance(this, 'PostgresSource', {
            engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15_2 }),
            backupRetention: aws_cdk_lib_1.Duration.days(5),
            instanceType,
            vpc,
            vpcSubnets,
        });
        new rds.DatabaseInstanceReadReplica(this, 'PostgresReplica', {
            sourceDatabaseInstance: postgresSource,
            instanceType,
            vpc,
            vpcSubnets,
        });
        const mysqlSource = new rds.DatabaseInstance(this, 'MysqlSource', {
            engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0 }),
            backupRetention: aws_cdk_lib_1.Duration.days(5),
            instanceType,
            vpc,
            vpcSubnets,
        });
        const parameterGroup = new rds.ParameterGroup(this, 'ReplicaParameterGroup', {
            engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0 }),
            parameters: {
                wait_timeout: '86400',
            },
        });
        new rds.DatabaseInstanceReadReplica(this, 'MysqlReplica', {
            sourceDatabaseInstance: mysqlSource,
            backupRetention: aws_cdk_lib_1.Duration.days(3),
            instanceType,
            vpc,
            vpcSubnets,
            parameterGroup,
        });
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-rds-read-replica');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucmVhZC1yZXBsaWNhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucmVhZC1yZXBsaWNhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQWtIO0FBQ2xILDZDQUErRDtBQUUvRCwyQ0FBMkM7QUFFM0MsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQy9CLE1BQU0sRUFBRSxDQUFDO1lBQ1QsbUJBQW1CLEVBQUU7Z0JBQ25CO29CQUNFLElBQUksRUFBRSxVQUFVO29CQUNoQixVQUFVLEVBQUUsb0JBQVUsQ0FBQyxnQkFBZ0I7aUJBQ3hDO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxzQkFBWSxDQUFDLEVBQUUsQ0FBQyx1QkFBYSxDQUFDLEVBQUUsRUFBRSxzQkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTNFLE1BQU0sVUFBVSxHQUFvQixFQUFFLFVBQVUsRUFBRSxvQkFBVSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFaEYsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ3RFLE1BQU0sRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUM1RixlQUFlLEVBQUUsc0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLFlBQVk7WUFDWixHQUFHO1lBQ0gsVUFBVTtTQUNYLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLDJCQUEyQixDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUMzRCxzQkFBc0IsRUFBRSxjQUFjO1lBQ3RDLFlBQVk7WUFDWixHQUFHO1lBQ0gsVUFBVTtTQUNYLENBQUMsQ0FBQztRQUVILE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDaEUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JGLGVBQWUsRUFBRSxzQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakMsWUFBWTtZQUNaLEdBQUc7WUFDSCxVQUFVO1NBQ1gsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRTtZQUMzRSxNQUFNLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckYsVUFBVSxFQUFFO2dCQUNWLFlBQVksRUFBRSxPQUFPO2FBQ3RCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsMkJBQTJCLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN4RCxzQkFBc0IsRUFBRSxXQUFXO1lBQ25DLGVBQWUsRUFBRSxzQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakMsWUFBWTtZQUNaLEdBQUc7WUFDSCxVQUFVO1lBQ1YsY0FBYztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBQzNDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluc3RhbmNlQ2xhc3MsIEluc3RhbmNlU2l6ZSwgSW5zdGFuY2VUeXBlLCBTdWJuZXRTZWxlY3Rpb24sIFN1Ym5ldFR5cGUsIFZwYyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0IHsgQXBwLCBEdXJhdGlvbiwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIHJkcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtcmRzJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGModGhpcywgJ1ZwYycsIHtcbiAgICAgIG1heEF6czogMixcbiAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdpc29sYXRlZCcsXG4gICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGluc3RhbmNlVHlwZSA9IEluc3RhbmNlVHlwZS5vZihJbnN0YW5jZUNsYXNzLlQzLCBJbnN0YW5jZVNpemUuU01BTEwpO1xuXG4gICAgY29uc3QgdnBjU3VibmV0czogU3VibmV0U2VsZWN0aW9uID0geyBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQgfTtcblxuICAgIGNvbnN0IHBvc3RncmVzU291cmNlID0gbmV3IHJkcy5EYXRhYmFzZUluc3RhbmNlKHRoaXMsICdQb3N0Z3Jlc1NvdXJjZScsIHtcbiAgICAgIGVuZ2luZTogcmRzLkRhdGFiYXNlSW5zdGFuY2VFbmdpbmUucG9zdGdyZXMoeyB2ZXJzaW9uOiByZHMuUG9zdGdyZXNFbmdpbmVWZXJzaW9uLlZFUl8xNV8yIH0pLFxuICAgICAgYmFja3VwUmV0ZW50aW9uOiBEdXJhdGlvbi5kYXlzKDUpLFxuICAgICAgaW5zdGFuY2VUeXBlLFxuICAgICAgdnBjLFxuICAgICAgdnBjU3VibmV0cyxcbiAgICB9KTtcblxuICAgIG5ldyByZHMuRGF0YWJhc2VJbnN0YW5jZVJlYWRSZXBsaWNhKHRoaXMsICdQb3N0Z3Jlc1JlcGxpY2EnLCB7XG4gICAgICBzb3VyY2VEYXRhYmFzZUluc3RhbmNlOiBwb3N0Z3Jlc1NvdXJjZSxcbiAgICAgIGluc3RhbmNlVHlwZSxcbiAgICAgIHZwYyxcbiAgICAgIHZwY1N1Ym5ldHMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBteXNxbFNvdXJjZSA9IG5ldyByZHMuRGF0YWJhc2VJbnN0YW5jZSh0aGlzLCAnTXlzcWxTb3VyY2UnLCB7XG4gICAgICBlbmdpbmU6IHJkcy5EYXRhYmFzZUluc3RhbmNlRW5naW5lLm15c3FsKHsgdmVyc2lvbjogcmRzLk15c3FsRW5naW5lVmVyc2lvbi5WRVJfOF8wIH0pLFxuICAgICAgYmFja3VwUmV0ZW50aW9uOiBEdXJhdGlvbi5kYXlzKDUpLFxuICAgICAgaW5zdGFuY2VUeXBlLFxuICAgICAgdnBjLFxuICAgICAgdnBjU3VibmV0cyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBhcmFtZXRlckdyb3VwID0gbmV3IHJkcy5QYXJhbWV0ZXJHcm91cCh0aGlzLCAnUmVwbGljYVBhcmFtZXRlckdyb3VwJywge1xuICAgICAgZW5naW5lOiByZHMuRGF0YWJhc2VJbnN0YW5jZUVuZ2luZS5teXNxbCh7IHZlcnNpb246IHJkcy5NeXNxbEVuZ2luZVZlcnNpb24uVkVSXzhfMCB9KSxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgd2FpdF90aW1lb3V0OiAnODY0MDAnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyByZHMuRGF0YWJhc2VJbnN0YW5jZVJlYWRSZXBsaWNhKHRoaXMsICdNeXNxbFJlcGxpY2EnLCB7XG4gICAgICBzb3VyY2VEYXRhYmFzZUluc3RhbmNlOiBteXNxbFNvdXJjZSxcbiAgICAgIGJhY2t1cFJldGVudGlvbjogRHVyYXRpb24uZGF5cygzKSxcbiAgICAgIGluc3RhbmNlVHlwZSxcbiAgICAgIHZwYyxcbiAgICAgIHZwY1N1Ym5ldHMsXG4gICAgICBwYXJhbWV0ZXJHcm91cCxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2Nkay1yZHMtcmVhZC1yZXBsaWNhJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==