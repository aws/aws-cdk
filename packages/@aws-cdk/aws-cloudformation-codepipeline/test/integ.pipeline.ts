import codepipeline = require('@aws-cdk/aws-codepipeline');
import { ArtifactPath } from '@aws-cdk/aws-codepipeline';
import { Role } from '@aws-cdk/aws-iam';
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { ServicePrincipal } from '@aws-cdk/cdk';

import cfn_codepipeline = require('../lib');

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-cloudformation');

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

const sourceStage = new codepipeline.Stage(pipeline, 'Source');
const bucket = new s3.Bucket(stack, 'PipelineBucket', {
    versioned: true,
});
const source = new codepipeline.AmazonS3Source(sourceStage, 'Source', {
    artifactName: 'SourceArtifact',
    bucket,
    bucketKey: 'key',
});

const cfnStage = new codepipeline.Stage(pipeline, 'CFN');

const changeSetName = "ChangeSetIntegTest";
const stackName = "IntegTest-TestActionStack";

const role = new Role(stack, 'CfnChangeSetRole', {
    assumedBy: new ServicePrincipal('cloudformation.amazonaws.com'),
});

new cfn_codepipeline.CreateReplaceChangeSet(cfnStage, 'DeployCFN', {
   changeSetName,
   stackName,
   roleArn: role.roleArn,
   templatePath: new ArtifactPath(source.artifact, 'test.yaml')
});

process.stdout.write(app.run());
