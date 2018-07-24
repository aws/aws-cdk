import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');
import codecommit = require('../lib');

const app = new cdk.App(process.argv);
const stack = new cdk.Stack(app, 'aws-cdk-codecommit-events');

const repo = new codecommit.Repository(stack, 'Repo', { repositoryName: 'aws-cdk-codecommit-events' });
const topic = new sns.Topic(stack, 'MyTopic');

repo.onReferenceCreated('OnReferenceCreated', topic);

process.stdout.write(app.run());
