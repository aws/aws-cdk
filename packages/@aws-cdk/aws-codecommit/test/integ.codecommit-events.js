"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sns = require("@aws-cdk/aws-sns");
const cdk = require("@aws-cdk/core");
const codecommit = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codecommit-events');
const repo = new codecommit.Repository(stack, 'Repo', {
    repositoryName: 'aws-cdk-codecommit-events',
});
const topic = new sns.Topic(stack, 'MyTopic');
// we can't use @aws-cdk/aws-events-targets.SnsTopic here because it will
// create a cyclic dependency with codebuild, so we just fake it
repo.onReferenceCreated('OnReferenceCreated', {
    target: {
        bind: () => ({
            arn: topic.topicArn,
            id: '',
        }),
    },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29kZWNvbW1pdC1ldmVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5jb2RlY29tbWl0LWV2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFDckMscUNBQXFDO0FBRXJDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztBQUU5RCxNQUFNLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtJQUNwRCxjQUFjLEVBQUUsMkJBQTJCO0NBQzVDLENBQUMsQ0FBQztBQUNILE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFFOUMseUVBQXlFO0FBQ3pFLGdFQUFnRTtBQUNoRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLEVBQUU7SUFDNUMsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDWCxHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDbkIsRUFBRSxFQUFFLEVBQUU7U0FDUCxDQUFDO0tBQ0g7Q0FDRixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzbnMgZnJvbSAnQGF3cy1jZGsvYXdzLXNucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjb2RlY29tbWl0IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWNkay1jb2RlY29tbWl0LWV2ZW50cycpO1xuXG5jb25zdCByZXBvID0gbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nLCB7XG4gIHJlcG9zaXRvcnlOYW1lOiAnYXdzLWNkay1jb2RlY29tbWl0LWV2ZW50cycsXG59KTtcbmNvbnN0IHRvcGljID0gbmV3IHNucy5Ub3BpYyhzdGFjaywgJ015VG9waWMnKTtcblxuLy8gd2UgY2FuJ3QgdXNlIEBhd3MtY2RrL2F3cy1ldmVudHMtdGFyZ2V0cy5TbnNUb3BpYyBoZXJlIGJlY2F1c2UgaXQgd2lsbFxuLy8gY3JlYXRlIGEgY3ljbGljIGRlcGVuZGVuY3kgd2l0aCBjb2RlYnVpbGQsIHNvIHdlIGp1c3QgZmFrZSBpdFxucmVwby5vblJlZmVyZW5jZUNyZWF0ZWQoJ09uUmVmZXJlbmNlQ3JlYXRlZCcsIHtcbiAgdGFyZ2V0OiB7XG4gICAgYmluZDogKCkgPT4gKHtcbiAgICAgIGFybjogdG9waWMudG9waWNBcm4sXG4gICAgICBpZDogJycsXG4gICAgfSksXG4gIH0sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=