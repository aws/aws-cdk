"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
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
        /// !hide
    }
}
new VpcReservedPrivateSubnetStack(app, 'aws-cdk-ec2-vpc-endpoint');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucmVzZXJ2ZWQtcHJpdmF0ZS1zdWJuZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5yZXNlcnZlZC1wcml2YXRlLXN1Ym5ldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQywyQ0FBMkM7QUFFM0M7Ozs7Ozs7R0FPRztBQUVILE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sNkJBQThCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDbkQsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLFNBQVM7UUFDVCx5REFBeUQ7UUFDekQsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDdkIsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUNoRCxtQkFBbUIsRUFBRTtnQkFDbkI7b0JBQ0UsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTTtpQkFDbEM7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsbUJBQW1CO29CQUM5QyxRQUFRLEVBQUUsSUFBSTtpQkFDZjthQUNGO1lBQ0QsV0FBVyxFQUFFLENBQUM7U0FDZixDQUFDLENBQUM7UUFDSCxTQUFTO0lBQ1gsQ0FBQztDQUNGO0FBQ0QsSUFBSSw2QkFBNkIsQ0FBQyxHQUFHLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztBQUNuRSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuXG4vKlxuICogQ3JlYXRlcyBhIHNpbXBsZSB2cGMgd2l0aCBhIHB1YmxpYyBzdWJuZXQgYW5kIGEgcHJpdmF0ZSByZXNlcnZlZCBzdWJuZXQuXG4gKiBQdWJsaWMgc3VibmV0IHNob3VsZCBiZSB2aXNpYmxlIGJ1dCBhIHByaXZhdGUgcmVzZXJ2ZWQgc3VibmV0IG9ubHkgaGFzIElQIHNwYWNlIHJlc2VydmVkLlxuICogTm8gcmVzb3VyY2VzIGFyZSBwcm92aXNpb25lZCBpbiBhIHJlc2VydmVkIHN1Ym5ldC5cbiAqXG4gKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHM6XG4gKiAtLSBhd3MgZWMyIGRlc2NyaWJlLW5hdC1nYXRld2F5cyByZXR1cm5zIHsgXCJuYXRHYXRld2F5c1wiOiBbXX1cbiAqL1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jbGFzcyBWcGNSZXNlcnZlZFByaXZhdGVTdWJuZXRTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLy8gIXNob3dcbiAgICAvLyBTcGVjaWZ5IG5vIE5BVCBnYXRld2F5cyB3aXRoIGEgcmVzZXJ2ZWQgcHJpdmF0ZSBzdWJuZXRcbiAgICBuZXcgZWMyLlZwYyh0aGlzLCAnVlBDJywge1xuICAgICAgaXBBZGRyZXNzZXM6IGVjMi5JcEFkZHJlc3Nlcy5jaWRyKCcxMC4wLjAuMC8xNicpLFxuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ2luZ3Jlc3MnLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdwcml2YXRlJyxcbiAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxuICAgICAgICAgIHJlc2VydmVkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIG5hdEdhdGV3YXlzOiAwLFxuICAgIH0pO1xuICAgIC8vLyAhaGlkZVxuICB9XG59XG5uZXcgVnBjUmVzZXJ2ZWRQcml2YXRlU3VibmV0U3RhY2soYXBwLCAnYXdzLWNkay1lYzItdnBjLWVuZHBvaW50Jyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==