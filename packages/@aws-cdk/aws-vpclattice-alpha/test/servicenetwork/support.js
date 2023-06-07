"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportResources = void 0;
const path = require("path");
const core = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const constructs_1 = require("constructs");
class SupportResources extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        this.vpc1 = new aws_cdk_lib_1.aws_ec2.Vpc(this, 'VPC1', {
            ipAddresses: aws_cdk_lib_1.aws_ec2.IpAddresses.cidr('10.10.10.0/16'),
            maxAzs: 2,
            natGateways: 0,
        });
        this.vpc2 = new aws_cdk_lib_1.aws_ec2.Vpc(this, 'VPC1', {
            ipAddresses: aws_cdk_lib_1.aws_ec2.IpAddresses.cidr('10.10.20.0/16'),
            maxAzs: 2,
            natGateways: 0,
        });
        const helloRole = new aws_cdk_lib_1.aws_iam.Role(this, 'helloRole', {
            assumedBy: new aws_cdk_lib_1.aws_iam.ServicePrincipal('lambda.amazonaws.com'),
        });
        const checkRole = new aws_cdk_lib_1.aws_iam.Role(this, 'checkRole', {
            assumedBy: new aws_cdk_lib_1.aws_iam.ServicePrincipal('lambda.amazonaws.com'),
        });
        this.helloWorld = new aws_cdk_lib_1.aws_lambda.Function(this, 'helloworld', {
            runtime: aws_cdk_lib_1.aws_lambda.Runtime.PYTHON_3_10,
            handler: 'helloworld.lambda_handler',
            code: aws_cdk_lib_1.aws_lambda.Code.fromAsset(path.join(__dirname, './lambda')),
            timeout: core.Duration.seconds(15),
            vpc: this.vpc1,
            vpcSubnets: { subnetType: aws_cdk_lib_1.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS },
            role: helloRole,
        });
        this.checkHelloWorld = new aws_cdk_lib_1.aws_lambda.Function(this, 'checkhelloworld', {
            runtime: aws_cdk_lib_1.aws_lambda.Runtime.PYTHON_3_10,
            handler: 'checkhelloworld.lambda_handler',
            code: aws_cdk_lib_1.aws_lambda.Code.fromAsset(path.join(__dirname, './lambda')),
            timeout: core.Duration.seconds(15),
            vpc: this.vpc2,
            vpcSubnets: { subnetType: aws_cdk_lib_1.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS },
            role: checkRole,
        });
    }
}
exports.SupportResources = SupportResources;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwcG9ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN1cHBvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBQzdCLG9DQUFvQztBQUVwQyw2Q0FNcUI7QUFDckIsMkNBQXVDO0FBR3ZDLE1BQWEsZ0JBQWlCLFNBQVEsc0JBQVM7SUFPN0MsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUkscUJBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNwQyxXQUFXLEVBQUUscUJBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUNsRCxNQUFNLEVBQUUsQ0FBQztZQUNULFdBQVcsRUFBRSxDQUFDO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLHFCQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDcEMsV0FBVyxFQUFFLHFCQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7WUFDbEQsTUFBTSxFQUFFLENBQUM7WUFDVCxXQUFXLEVBQUUsQ0FBQztTQUNmLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLElBQUkscUJBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNoRCxTQUFTLEVBQUUsSUFBSSxxQkFBRyxDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDO1NBQzVELENBQUMsQ0FBQztRQUNILE1BQU0sU0FBUyxHQUFHLElBQUkscUJBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNoRCxTQUFTLEVBQUUsSUFBSSxxQkFBRyxDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDO1NBQzVELENBQUMsQ0FBQztRQUdILElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSx3QkFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzVELE9BQU8sRUFBRSx3QkFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ3ZDLE9BQU8sRUFBRSwyQkFBMkI7WUFDcEMsSUFBSSxFQUFFLHdCQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUUsQ0FBQztZQUNsRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ2xDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNkLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxxQkFBRyxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRTtZQUM5RCxJQUFJLEVBQUUsU0FBUztTQUNoQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksd0JBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3RFLE9BQU8sRUFBRSx3QkFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ3ZDLE9BQU8sRUFBRSxnQ0FBZ0M7WUFDekMsSUFBSSxFQUFFLHdCQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUUsQ0FBQztZQUNsRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ2xDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNkLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxxQkFBRyxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRTtZQUM5RCxJQUFJLEVBQUUsU0FBUztTQUNoQixDQUFDLENBQUM7S0FFSjtDQUNGO0FBbkRELDRDQW1EQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBjb3JlIGZyb20gJ2F3cy1jZGstbGliJztcblxuaW1wb3J0IHtcbiAgLy9hd3Nfa2luZXNpcyBhcyBraW5lc2lzLFxuICBhd3NfaWFtIGFzIGlhbSxcbiAgYXdzX2VjMiBhcyBlYzIsXG4gIGF3c19sYW1iZGEsXG59XG4gIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5cbmV4cG9ydCBjbGFzcyBTdXBwb3J0UmVzb3VyY2VzIGV4dGVuZHMgQ29uc3RydWN0IHtcblxuICBwdWJsaWMgaGVsbG9Xb3JsZDogY29yZS5hd3NfbGFtYmRhLkZ1bmN0aW9uO1xuICBwdWJsaWMgY2hlY2tIZWxsb1dvcmxkOiBjb3JlLmF3c19sYW1iZGEuRnVuY3Rpb247XG4gIHB1YmxpYyB2cGMxOiBlYzIuVnBjO1xuICBwdWJsaWMgdnBjMjogZWMyLlZwYztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMudnBjMSA9IG5ldyBlYzIuVnBjKHRoaXMsICdWUEMxJywge1xuICAgICAgaXBBZGRyZXNzZXM6IGVjMi5JcEFkZHJlc3Nlcy5jaWRyKCcxMC4xMC4xMC4wLzE2JyksXG4gICAgICBtYXhBenM6IDIsXG4gICAgICBuYXRHYXRld2F5czogMCxcbiAgICB9KTtcblxuICAgIHRoaXMudnBjMiA9IG5ldyBlYzIuVnBjKHRoaXMsICdWUEMxJywge1xuICAgICAgaXBBZGRyZXNzZXM6IGVjMi5JcEFkZHJlc3Nlcy5jaWRyKCcxMC4xMC4yMC4wLzE2JyksXG4gICAgICBtYXhBenM6IDIsXG4gICAgICBuYXRHYXRld2F5czogMCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhlbGxvUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnaGVsbG9Sb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG4gICAgY29uc3QgY2hlY2tSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdjaGVja1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuXG4gICAgdGhpcy5oZWxsb1dvcmxkID0gbmV3IGF3c19sYW1iZGEuRnVuY3Rpb24odGhpcywgJ2hlbGxvd29ybGQnLCB7XG4gICAgICBydW50aW1lOiBhd3NfbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfMTAsXG4gICAgICBoYW5kbGVyOiAnaGVsbG93b3JsZC5sYW1iZGFfaGFuZGxlcicsXG4gICAgICBjb2RlOiBhd3NfbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICcuL2xhbWJkYScgKSksXG4gICAgICB0aW1lb3V0OiBjb3JlLkR1cmF0aW9uLnNlY29uZHMoMTUpLFxuICAgICAgdnBjOiB0aGlzLnZwYzEsXG4gICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MgfSxcbiAgICAgIHJvbGU6IGhlbGxvUm9sZSxcbiAgICB9KTtcblxuICAgIHRoaXMuY2hlY2tIZWxsb1dvcmxkID0gbmV3IGF3c19sYW1iZGEuRnVuY3Rpb24odGhpcywgJ2NoZWNraGVsbG93b3JsZCcsIHtcbiAgICAgIHJ1bnRpbWU6IGF3c19sYW1iZGEuUnVudGltZS5QWVRIT05fM18xMCxcbiAgICAgIGhhbmRsZXI6ICdjaGVja2hlbGxvd29ybGQubGFtYmRhX2hhbmRsZXInLFxuICAgICAgY29kZTogYXdzX2xhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9sYW1iZGEnICkpLFxuICAgICAgdGltZW91dDogY29yZS5EdXJhdGlvbi5zZWNvbmRzKDE1KSxcbiAgICAgIHZwYzogdGhpcy52cGMyLFxuICAgICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTIH0sXG4gICAgICByb2xlOiBjaGVja1JvbGUsXG4gICAgfSk7XG5cbiAgfVxufSJdfQ==