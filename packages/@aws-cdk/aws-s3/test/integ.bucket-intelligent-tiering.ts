import { App, Duration, Stack } from '@aws-cdk/core';
import * as s3 from '../lib/index';

const app = new App();

const stack = new Stack(app, 'aws-cdk-s3');

new s3.Bucket(stack, 'MyBucket', {
  intelligentTieringConfigurations: [{
    name: 'foo',
    prefix: 'bar',
    archiveAccessTierTime: Duration.days(90),
    deepArchiveAccessTierTime: Duration.days(180),
    tags: [{ key: 'test', value: 'bazz' }],
  }],
});


app.synth();
