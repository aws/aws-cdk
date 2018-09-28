import cdk = require('@aws-cdk/cdk');
import ecr = require('../lib');

const app = new cdk.App(process.argv);
const stack = new cdk.Stack(app, 'aws-ecr-integ-stack');

const repo = new ecr.Repository(stack, 'Repo');
repo.addLifecycleRule({ maxImageCount: 5 });

new cdk.Output(stack, 'RepositoryURI', {
  value: repo.repositoryUri
});

process.stdout.write(app.run());
