import ec2 = require('@aws-cdk/aws-ec2');
import ecr = require('@aws-cdk/aws-ecr');
import ecs = require('@aws-cdk/aws-ecs');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-ecs-deploy');

// setup ecs, ecr and service
const vpc = new ec2.VpcNetwork(stack, 'VPC');

const cluster = new ecs.Cluster(stack, "EcsCluster", {
    vpc
});

cluster.addCapacity("DefaultCapacity", {
    instanceType: new ec2.InstanceType('t3.micro')
});

const repository = new ecr.Repository(stack, 'MyEcrRepo');

const taskDefinition = new ecs.TaskDefinition(stack, "TaskDef", {
    compatibility: ecs.Compatibility.Ec2,
});

taskDefinition.addContainer("Container", {
    image: ecs.ContainerImage.fromEcrRepository(repository, "latest"),
    memoryReservationMiB: 128
});

const service = new ecs.Ec2Service(stack, "Ec2Service", {
    cluster,
    taskDefinition
});

// setup codepipeline, artifact bucket and stages
const bucket = new s3.Bucket(stack, 'MyBucket', {
    versioned: true,
    removalPolicy: cdk.RemovalPolicy.Destroy,
});
const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
    artifactBucket: bucket,
});

const sourceStage = pipeline.addStage({ name: 'Source' });

const sourceAction = new s3.PipelineSourceAction({
    actionName: 'Source',
    outputArtifactName: 'SourceArtifact',
    bucket,
    bucketKey: 'image.zip',
});

sourceStage.addAction(sourceAction);

const deployStage = pipeline.addStage({ name: "Deploy" });
deployStage.addAction(
    new ecs.EcsDeployAction({
        actionName: 'DeployAction',
        inputArtifact: sourceAction.outputArtifact,
        fileName: 'imageDefinition.json',
        service,
        repository
    })
);

pipeline.addToRolePolicy(
    new iam.PolicyStatement()
        .addActions("sts:AssumeRole", "iam:PassRole")
        .addAllResources()
);

app.run();
