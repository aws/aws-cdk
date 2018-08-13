import cdk = require('@aws-cdk/cdk');
import { Stack } from '@aws-cdk/cdk';
import s3 = require('../lib');
import { Topic } from './notification-targets';

const app = new cdk.App(process.argv);

const stack = new Stack(app, 'test-3');

const bucket = new s3.Bucket(stack, 'Bucket');
const topic = new Topic(stack, 'Topic');
const topic3 = new Topic(stack, 'Topic3');

bucket.onEvent(s3.EventType.ObjectCreatedPut, topic);
bucket.onEvent(s3.EventType.ObjectRemoved, topic3, 'home/myusername/*');

const bucket2 = new s3.Bucket(stack, 'Bucket2');
bucket2.onObjectRemoved(topic3, 'foo*', '*foo/bar');

process.stdout.write(app.run());