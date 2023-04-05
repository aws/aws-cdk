"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const es = require("aws-cdk-lib/aws-elasticsearch");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const user = new aws_iam_1.User(this, 'User');
        new es.Domain(this, 'Domain', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            version: es.ElasticsearchVersion.V7_1,
            fineGrainedAccessControl: {
                masterUserArn: user.userArn,
            },
            encryptionAtRest: {
                enabled: true,
            },
            nodeToNodeEncryption: true,
            enforceHttps: true,
        });
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-integ-elasticsearch-advancedsecurity');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWxhc3RpY3NlYXJjaC5hZHZhbmNlZHNlY3VyaXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZWxhc3RpY3NlYXJjaC5hZHZhbmNlZHNlY3VyaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQTJDO0FBQzNDLDZDQUFvRTtBQUVwRSxvREFBb0Q7QUFFcEQsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFcEMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDNUIsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxPQUFPLEVBQUUsRUFBRSxDQUFDLG9CQUFvQixDQUFDLElBQUk7WUFDckMsd0JBQXdCLEVBQUU7Z0JBQ3hCLGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTzthQUM1QjtZQUNELGdCQUFnQixFQUFFO2dCQUNoQixPQUFPLEVBQUUsSUFBSTthQUNkO1lBQ0Qsb0JBQW9CLEVBQUUsSUFBSTtZQUMxQixZQUFZLEVBQUUsSUFBSTtTQUNuQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsMENBQTBDLENBQUMsQ0FBQztBQUMvRCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVc2VyIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBBcHAsIFJlbW92YWxQb2xpY3ksIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBlcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWxhc3RpY3NlYXJjaCc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIodGhpcywgJ1VzZXInKTtcblxuICAgIG5ldyBlcy5Eb21haW4odGhpcywgJ0RvbWFpbicsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIHZlcnNpb246IGVzLkVsYXN0aWNzZWFyY2hWZXJzaW9uLlY3XzEsXG4gICAgICBmaW5lR3JhaW5lZEFjY2Vzc0NvbnRyb2w6IHtcbiAgICAgICAgbWFzdGVyVXNlckFybjogdXNlci51c2VyQXJuLFxuICAgICAgfSxcbiAgICAgIGVuY3J5cHRpb25BdFJlc3Q6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBub2RlVG9Ob2RlRW5jcnlwdGlvbjogdHJ1ZSxcbiAgICAgIGVuZm9yY2VIdHRwczogdHJ1ZSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2Nkay1pbnRlZy1lbGFzdGljc2VhcmNoLWFkdmFuY2Vkc2VjdXJpdHknKTtcbmFwcC5zeW50aCgpO1xuIl19