"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const ec2 = require("../lib");
/*
 * Creates a simple vpc with a public subnet and a private reserved subnet.
 * Public subnet should be visible but a private reserved subnet only has IP space reserved.
 * No resources are provisioned in a reserved subnet.
 *
 * Stack verification steps:
 * -- aws ec2 describe-nat-gateways returns { "natGateways": []}
 */
const app = new cdk.App();
class VpcReservedPrivateSubnetStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        /// !show
        // Specify no NAT gateways with a reserved private subnet
        new ec2.Vpc(this, 'VPC', {
            ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
            subnetConfiguration: [
                {
                    name: 'ingress',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    name: 'private',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                    reserved: true,
                },
            ],
            natGateways: 0,
        });
    }
}
new VpcReservedPrivateSubnetStack(app, 'aws-cdk-ec2-vpc-endpoint');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucmVzZXJ2ZWQtcHJpdmF0ZS1zdWJuZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5yZXNlcnZlZC1wcml2YXRlLXN1Ym5ldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFFOUI7Ozs7Ozs7R0FPRztBQUVILE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sNkJBQThCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDbkQsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLFNBQVM7UUFDVCx5REFBeUQ7UUFDekQsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDdkIsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUNoRCxtQkFBbUIsRUFBRTtnQkFDbkI7b0JBQ0UsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTTtpQkFDbEM7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsbUJBQW1CO29CQUM5QyxRQUFRLEVBQUUsSUFBSTtpQkFDZjthQUNGO1lBQ0QsV0FBVyxFQUFFLENBQUM7U0FDZixDQUFDLENBQUM7S0FFSjtDQUNGO0FBQ0QsSUFBSSw2QkFBNkIsQ0FBQyxHQUFHLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztBQUNuRSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnLi4vbGliJztcblxuLypcbiAqIENyZWF0ZXMgYSBzaW1wbGUgdnBjIHdpdGggYSBwdWJsaWMgc3VibmV0IGFuZCBhIHByaXZhdGUgcmVzZXJ2ZWQgc3VibmV0LlxuICogUHVibGljIHN1Ym5ldCBzaG91bGQgYmUgdmlzaWJsZSBidXQgYSBwcml2YXRlIHJlc2VydmVkIHN1Ym5ldCBvbmx5IGhhcyBJUCBzcGFjZSByZXNlcnZlZC5cbiAqIE5vIHJlc291cmNlcyBhcmUgcHJvdmlzaW9uZWQgaW4gYSByZXNlcnZlZCBzdWJuZXQuXG4gKlxuICogU3RhY2sgdmVyaWZpY2F0aW9uIHN0ZXBzOlxuICogLS0gYXdzIGVjMiBkZXNjcmliZS1uYXQtZ2F0ZXdheXMgcmV0dXJucyB7IFwibmF0R2F0ZXdheXNcIjogW119XG4gKi9cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY2xhc3MgVnBjUmVzZXJ2ZWRQcml2YXRlU3VibmV0U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8vICFzaG93XG4gICAgLy8gU3BlY2lmeSBubyBOQVQgZ2F0ZXdheXMgd2l0aCBhIHJlc2VydmVkIHByaXZhdGUgc3VibmV0XG4gICAgbmV3IGVjMi5WcGModGhpcywgJ1ZQQycsIHtcbiAgICAgIGlwQWRkcmVzc2VzOiBlYzIuSXBBZGRyZXNzZXMuY2lkcignMTAuMC4wLjAvMTYnKSxcbiAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdpbmdyZXNzJyxcbiAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAncHJpdmF0ZScsXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcbiAgICAgICAgICByZXNlcnZlZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBuYXRHYXRld2F5czogMCxcbiAgICB9KTtcbiAgICAvLy8gIWhpZGVcbiAgfVxufVxubmV3IFZwY1Jlc2VydmVkUHJpdmF0ZVN1Ym5ldFN0YWNrKGFwcCwgJ2F3cy1jZGstZWMyLXZwYy1lbmRwb2ludCcpO1xuYXBwLnN5bnRoKCk7XG4iXX0=