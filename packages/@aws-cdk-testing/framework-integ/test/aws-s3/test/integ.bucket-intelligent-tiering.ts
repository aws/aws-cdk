import { App, Duration, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

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

new IntegTest(app, 'cdk-integ-intelligent-tiering', {
  testCases: [stack],
});
