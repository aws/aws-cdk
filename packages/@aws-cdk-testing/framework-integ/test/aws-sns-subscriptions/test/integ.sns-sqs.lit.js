"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kms = require("aws-cdk-lib/aws-kms");
const sns = require("aws-cdk-lib/aws-sns");
const sqs = require("aws-cdk-lib/aws-sqs");
const cdk = require("aws-cdk-lib");
const cxapi = require("aws-cdk-lib/cx-api");
const subs = require("aws-cdk-lib/aws-sns-subscriptions");
const restrictSqsDescryption = { [cxapi.SNS_SUBSCRIPTIONS_SQS_DECRYPTION_POLICY]: true };
class SnsToSqs extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        /// !show
        const topic = new sns.Topic(this, 'MyTopic');
        const queue = new sqs.Queue(this, 'MyQueue', {
            encryptionMasterKey: new kms.Key(this, 'EncryptionMasterKey'),
        });
        topic.addSubscription(new subs.SqsSubscription(queue, {
            deadLetterQueue: new sqs.Queue(this, 'DeadLetterQueue'),
        }));
        /// !hide
    }
}
const app = new cdk.App({
    context: restrictSqsDescryption,
});
new SnsToSqs(app, 'aws-cdk-sns-sqs');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc25zLXNxcy5saXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5zbnMtc3FzLmxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLG1DQUFtQztBQUNuQyw0Q0FBNEM7QUFDNUMsMERBQTBEO0FBRTFELE1BQU0sc0JBQXNCLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO0FBRXpGLE1BQU0sUUFBUyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzlCLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixTQUFTO1FBQ1QsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3QyxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUMzQyxtQkFBbUIsRUFBRSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLHFCQUFxQixDQUFDO1NBQzlELENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRTtZQUNwRCxlQUFlLEVBQUUsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxpQkFBaUIsQ0FBQztTQUN4RCxDQUFDLENBQUMsQ0FBQztRQUNKLFNBQVM7SUFDWCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDdEIsT0FBTyxFQUFFLHNCQUFzQjtDQUNoQyxDQUFDLENBQUM7QUFFSCxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUVyQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBrbXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBzbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNucyc7XG5pbXBvcnQgKiBhcyBzcXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNxcyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnYXdzLWNkay1saWIvY3gtYXBpJztcbmltcG9ydCAqIGFzIHN1YnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNucy1zdWJzY3JpcHRpb25zJztcblxuY29uc3QgcmVzdHJpY3RTcXNEZXNjcnlwdGlvbiA9IHsgW2N4YXBpLlNOU19TVUJTQ1JJUFRJT05TX1NRU19ERUNSWVBUSU9OX1BPTElDWV06IHRydWUgfTtcblxuY2xhc3MgU25zVG9TcXMgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8vICFzaG93XG4gICAgY29uc3QgdG9waWMgPSBuZXcgc25zLlRvcGljKHRoaXMsICdNeVRvcGljJyk7XG4gICAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHRoaXMsICdNeVF1ZXVlJywge1xuICAgICAgZW5jcnlwdGlvbk1hc3RlcktleTogbmV3IGttcy5LZXkodGhpcywgJ0VuY3J5cHRpb25NYXN0ZXJLZXknKSxcbiAgICB9KTtcblxuICAgIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5TcXNTdWJzY3JpcHRpb24ocXVldWUsIHtcbiAgICAgIGRlYWRMZXR0ZXJRdWV1ZTogbmV3IHNxcy5RdWV1ZSh0aGlzLCAnRGVhZExldHRlclF1ZXVlJyksXG4gICAgfSkpO1xuICAgIC8vLyAhaGlkZVxuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHtcbiAgY29udGV4dDogcmVzdHJpY3RTcXNEZXNjcnlwdGlvbixcbn0pO1xuXG5uZXcgU25zVG9TcXMoYXBwLCAnYXdzLWNkay1zbnMtc3FzJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19