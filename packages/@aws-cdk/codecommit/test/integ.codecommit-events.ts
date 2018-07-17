import { App, Stack } from '@aws-cdk/cdk';
import { Topic } from '@aws-cdk/sns';
import { Repository } from '../lib';

const app = new App(process.argv);
const stack = new Stack(app, 'aws-cdk-codecommit-events');

const repo = new Repository(stack, 'Repo', { repositoryName: 'aws-cdk-codecommit-events' });
const topic = new Topic(stack, 'MyTopic');

repo.onReferenceCreated('OnReferenceCreated', topic);

process.stdout.write(app.run());
