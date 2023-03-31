"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const kms = require("aws-cdk-lib/aws-kms");
const s3 = require("aws-cdk-lib/aws-s3");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const cdk = require("aws-cdk-lib");
const tasks = require("aws-cdk-lib/aws-stepfunctions-tasks");
/*
 * Creates a state machine with a task states needed to deploy the SageMaker Endpoint
 *
 * SageMaker jobs need training algorithms. These can be found in the AWS marketplace
 * or created.
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <state-machine-arn-from-output> returns a status of `Succeeded`
 */
class CallSageMakerStack extends cdk.Stack {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        const encryptionKey = new kms.Key(this, 'EncryptionKey', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        const trainingData = new s3.Bucket(this, 'TrainingData', {
            encryption: s3.BucketEncryption.KMS,
            encryptionKey,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        const trainingJob = new tasks.SageMakerCreateTrainingJob(this, 'Train Task', {
            algorithmSpecification: {
                algorithmName: 'arn:aws:sagemaker:us-east-1:865070037744:algorithm/scikit-decision-trees-15423055-57b73412d2e93e9239e4e16f83298b8f',
            },
            inputDataConfig: [{
                    channelName: 'InputData',
                    dataSource: {
                        s3DataSource: {
                            s3Location: tasks.S3Location.fromBucket(trainingData, 'data/'),
                        },
                    },
                }],
            outputDataConfig: { s3OutputLocation: tasks.S3Location.fromBucket(trainingData, 'result/') },
            trainingJobName: 'mytrainingjob',
            resultPath: '$.TrainingJob',
        });
        const createModelTask = new tasks.SageMakerCreateModel(this, 'Create Model', {
            modelName: sfn.JsonPath.stringAt('$.Endpoint.Model'),
            primaryContainer: new tasks.ContainerDefinition({
                image: tasks.DockerImage.fromJsonExpression(sfn.JsonPath.stringAt('$.Endpoint.Image')),
                mode: tasks.Mode.SINGLE_MODEL,
                modelS3Location: tasks.S3Location.fromJsonExpression('$.TrainingJob.ModelArtifacts.S3ModelArtifacts'),
            }),
            resultPath: '$.Model',
        });
        const createEndpointConfigTask = new tasks.SageMakerCreateEndpointConfig(this, 'Create enpoint config', {
            endpointConfigName: sfn.JsonPath.stringAt('$.Endpoint.Config'),
            productionVariants: [{
                    initialInstanceCount: 1,
                    instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE),
                    variantName: 'awesome-variant',
                    modelName: sfn.JsonPath.stringAt('$.Endpoint.Model'),
                }],
            resultPath: '$.EndpointConfig',
        });
        const createEndpointTask = new tasks.SageMakerCreateEndpoint(this, 'Create endpoint', {
            endpointConfigName: sfn.JsonPath.stringAt('$.Endpoint.Config'),
            endpointName: sfn.JsonPath.stringAt('$.Endpoint.Name'),
            tags: sfn.TaskInput.fromObject([{
                    Key: 'Endpoint',
                    Value: 'New',
                }]),
            resultPath: '$.EndpointDeployed',
        });
        const updateEndpointTask = new tasks.SageMakerUpdateEndpoint(this, 'Update endpoint', {
            endpointConfigName: sfn.JsonPath.stringAt('$.Endpoint.Config'),
            endpointName: sfn.JsonPath.stringAt('$.Endpoint.Name'),
        });
        createEndpointTask.addCatch(updateEndpointTask, {
            errors: ['States.TaskFailed'],
            resultPath: '$.EndpointDeployed',
        });
        const definition = new sfn.Pass(this, 'Start', {
            result: sfn.Result.fromObject({
                Endpoint: {
                    // Change to real parameters for the actual run & put the testing data in the training bucket
                    Image: 'ImageArn',
                    Config: 'MyEndpointConfig',
                    Name: 'MyEndpointName',
                    Model: 'MyEndpointModelName',
                },
            }),
        })
            .next(trainingJob)
            .next(createModelTask)
            .next(createEndpointConfigTask)
            .next(createEndpointTask);
        const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
            definition,
        });
        new cdk.CfnOutput(this, 'StateMachineArn', {
            value: stateMachine.stateMachineArn,
        });
    }
}
const app = new cdk.App();
new CallSageMakerStack(app, 'aws-stepfunctions-integ-sagemaker');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2FsbC1zYWdlbWFrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5jYWxsLXNhZ2VtYWtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MseUNBQXlDO0FBQ3pDLHFEQUFxRDtBQUNyRCxtQ0FBbUM7QUFDbkMsNkRBQTZEO0FBRzdEOzs7Ozs7Ozs7Ozs7R0FZRztBQUdILE1BQU0sa0JBQW1CLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDeEMsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLFFBQXdCLEVBQUU7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDdkQsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztTQUN6QyxDQUFDLENBQUM7UUFDSCxNQUFNLFlBQVksR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN2RCxVQUFVLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEdBQUc7WUFDbkMsYUFBYTtZQUNiLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87U0FDekMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxXQUFXLEdBQUcsSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUMzRSxzQkFBc0IsRUFBRTtnQkFDdEIsYUFBYSxFQUFFLG9IQUFvSDthQUNwSTtZQUNELGVBQWUsRUFBRSxDQUFDO29CQUNoQixXQUFXLEVBQUUsV0FBVztvQkFDeEIsVUFBVSxFQUFFO3dCQUNWLFlBQVksRUFBRTs0QkFDWixVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLE9B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NkZBQTZGO29CQUM3RixLQUFLLEVBQUUsVUFBVTtvQkFDakIsTUFBTSxFQUFFLGtCQUFrQjtvQkFDMUIsSUFBSSxFQUFFLGdCQUFnQjtvQkFDdEIsS0FBSyxFQUFFLHFCQUFxQjtpQkFDN0I7YUFDRixDQUFDO1NBQ0wsQ0FBQzthQUNDLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDakIsSUFBSSxDQUFDLGVBQWUsQ0FBQzthQUNyQixJQUFJLENBQUMsd0JBQXdCLENBQUM7YUFDOUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFNUIsTUFBTSxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDOUQsVUFBVTtTQUNYLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDekMsS0FBSyxFQUFFLFlBQVksQ0FBQyxlQUFlO1NBQ3BDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksa0JBQWtCLENBQUMsR0FBRyxFQUFFLG1DQUFtQyxDQUFDLENBQUM7QUFDakUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1rbXMnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIHNmbiBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgdGFza3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnMtdGFza3MnO1xuXG5cbi8qXG4gKiBDcmVhdGVzIGEgc3RhdGUgbWFjaGluZSB3aXRoIGEgdGFzayBzdGF0ZXMgbmVlZGVkIHRvIGRlcGxveSB0aGUgU2FnZU1ha2VyIEVuZHBvaW50XG4gKlxuICogU2FnZU1ha2VyIGpvYnMgbmVlZCB0cmFpbmluZyBhbGdvcml0aG1zLiBUaGVzZSBjYW4gYmUgZm91bmQgaW4gdGhlIEFXUyBtYXJrZXRwbGFjZVxuICogb3IgY3JlYXRlZC5cbiAqXG4gKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHM6XG4gKiBUaGUgZ2VuZXJhdGVkIFN0YXRlIE1hY2hpbmUgY2FuIGJlIGV4ZWN1dGVkIGZyb20gdGhlIENMSSAob3IgU3RlcCBGdW5jdGlvbnMgY29uc29sZSlcbiAqIGFuZCBydW5zIHdpdGggYW4gZXhlY3V0aW9uIHN0YXR1cyBvZiBgU3VjY2VlZGVkYC5cbiAqXG4gKiAtLSBhd3Mgc3RlcGZ1bmN0aW9ucyBzdGFydC1leGVjdXRpb24gLS1zdGF0ZS1tYWNoaW5lLWFybiA8c3RhdGUtbWFjaGluZS1hcm4tZnJvbS1vdXRwdXQ+IHByb3ZpZGVzIGV4ZWN1dGlvbiBhcm5cbiAqIC0tIGF3cyBzdGVwZnVuY3Rpb25zIGRlc2NyaWJlLWV4ZWN1dGlvbiAtLWV4ZWN1dGlvbi1hcm4gPHN0YXRlLW1hY2hpbmUtYXJuLWZyb20tb3V0cHV0PiByZXR1cm5zIGEgc3RhdHVzIG9mIGBTdWNjZWVkZWRgXG4gKi9cblxuXG5jbGFzcyBDYWxsU2FnZU1ha2VyU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM6IGNkay5TdGFja1Byb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGVuY3J5cHRpb25LZXkgPSBuZXcga21zLktleSh0aGlzLCAnRW5jcnlwdGlvbktleScsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG4gICAgY29uc3QgdHJhaW5pbmdEYXRhID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnVHJhaW5pbmdEYXRhJywge1xuICAgICAgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5LTVMsXG4gICAgICBlbmNyeXB0aW9uS2V5LFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHRyYWluaW5nSm9iID0gbmV3IHRhc2tzLlNhZ2VNYWtlckNyZWF0ZVRyYWluaW5nSm9iKHRoaXMsICdUcmFpbiBUYXNrJywge1xuICAgICAgYWxnb3JpdGhtU3BlY2lmaWNhdGlvbjoge1xuICAgICAgICBhbGdvcml0aG1OYW1lOiAnYXJuOmF3czpzYWdlbWFrZXI6dXMtZWFzdC0xOjg2NTA3MDAzNzc0NDphbGdvcml0aG0vc2Npa2l0LWRlY2lzaW9uLXRyZWVzLTE1NDIzMDU1LTU3YjczNDEyZDJlOTNlOTIzOWU0ZTE2ZjgzMjk4YjhmJyxcbiAgICAgIH0sXG4gICAgICBpbnB1dERhdGFDb25maWc6IFt7XG4gICAgICAgIGNoYW5uZWxOYW1lOiAnSW5wdXREYXRhJyxcbiAgICAgICAgZGF0YVNvdXJjZToge1xuICAgICAgICAgIHMzRGF0YVNvdXJjZToge1xuICAgICAgICAgICAgczNMb2NhdGlvbjogdGFza3MuUzNMb2NhdGlvbi5mcm9tQnVja2V0KHRyYWluaW5nRGF0YSwgJ2RhdGEvJyksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH1dLFxuICAgICAgb3V0cHV0RGF0YUNvbmZpZzogeyBzM091dHB1dExvY2F0aW9uOiB0YXNrcy5TM0xvY2F0aW9uLmZyb21CdWNrZXQodHJhaW5pbmdEYXRhLCAncmVzdWx0LycpIH0sXG4gICAgICB0cmFpbmluZ0pvYk5hbWU6ICdteXRyYWluaW5nam9iJyxcbiAgICAgIHJlc3VsdFBhdGg6ICckLlRyYWluaW5nSm9iJyxcbiAgICB9KTtcbiAgICBjb25zdCBjcmVhdGVNb2RlbFRhc2sgPSBuZXcgdGFza3MuU2FnZU1ha2VyQ3JlYXRlTW9kZWwodGhpcywgJ0NyZWF0ZSBNb2RlbCcsIHtcbiAgICAgIG1vZGVsTmFtZTogc2ZuLkpzb25QYXRoLnN0cmluZ0F0KCckLkVuZHBvaW50Lk1vZGVsJyksXG4gICAgICBwcmltYXJ5Q29udGFpbmVyOiBuZXcgdGFza3MuQ29udGFpbmVyRGVmaW5pdGlvbih7XG4gICAgICAgIGltYWdlOiB0YXNrcy5Eb2NrZXJJbWFnZS5mcm9tSnNvbkV4cHJlc3Npb24oc2ZuLkpzb25QYXRoLnN0cmluZ0F0KCckLkVuZHBvaW50LkltYWdlJykpLFxuICAgICAgICBtb2RlOiB0YXNrcy5Nb2RlLlNJTkdMRV9NT0RFTCxcbiAgICAgICAgbW9kZWxTM0xvY2F0aW9uOiB0YXNrcy5TM0xvY2F0aW9uLmZyb21Kc29uRXhwcmVzc2lvbignJC5UcmFpbmluZ0pvYi5Nb2RlbEFydGlmYWN0cy5TM01vZGVsQXJ0aWZhY3RzJyksXG4gICAgICB9KSxcbiAgICAgIHJlc3VsdFBhdGg6ICckLk1vZGVsJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNyZWF0ZUVuZHBvaW50Q29uZmlnVGFzayA9IG5ldyB0YXNrcy5TYWdlTWFrZXJDcmVhdGVFbmRwb2ludENvbmZpZyh0aGlzLCAnQ3JlYXRlIGVucG9pbnQgY29uZmlnJywge1xuICAgICAgZW5kcG9pbnRDb25maWdOYW1lOiBzZm4uSnNvblBhdGguc3RyaW5nQXQoJyQuRW5kcG9pbnQuQ29uZmlnJyksXG4gICAgICBwcm9kdWN0aW9uVmFyaWFudHM6IFt7XG4gICAgICAgIGluaXRpYWxJbnN0YW5jZUNvdW50OiAxLFxuICAgICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTUsIGVjMi5JbnN0YW5jZVNpemUuWExBUkdFKSxcbiAgICAgICAgdmFyaWFudE5hbWU6ICdhd2Vzb21lLXZhcmlhbnQnLFxuICAgICAgICBtb2RlbE5hbWU6IHNmbi5Kc29uUGF0aC5zdHJpbmdBdCgnJC5FbmRwb2ludC5Nb2RlbCcpLFxuICAgICAgfV0sXG4gICAgICByZXN1bHRQYXRoOiAnJC5FbmRwb2ludENvbmZpZycsXG4gICAgfSk7XG5cbiAgICBjb25zdCBjcmVhdGVFbmRwb2ludFRhc2sgPSBuZXcgdGFza3MuU2FnZU1ha2VyQ3JlYXRlRW5kcG9pbnQodGhpcywgJ0NyZWF0ZSBlbmRwb2ludCcsIHtcbiAgICAgIGVuZHBvaW50Q29uZmlnTmFtZTogc2ZuLkpzb25QYXRoLnN0cmluZ0F0KCckLkVuZHBvaW50LkNvbmZpZycpLFxuICAgICAgZW5kcG9pbnROYW1lOiBzZm4uSnNvblBhdGguc3RyaW5nQXQoJyQuRW5kcG9pbnQuTmFtZScpLFxuICAgICAgdGFnczogc2ZuLlRhc2tJbnB1dC5mcm9tT2JqZWN0KFt7XG4gICAgICAgIEtleTogJ0VuZHBvaW50JyxcbiAgICAgICAgVmFsdWU6ICdOZXcnLFxuICAgICAgfV0pLFxuICAgICAgcmVzdWx0UGF0aDogJyQuRW5kcG9pbnREZXBsb3llZCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCB1cGRhdGVFbmRwb2ludFRhc2sgPSBuZXcgdGFza3MuU2FnZU1ha2VyVXBkYXRlRW5kcG9pbnQodGhpcywgJ1VwZGF0ZSBlbmRwb2ludCcsIHtcbiAgICAgIGVuZHBvaW50Q29uZmlnTmFtZTogc2ZuLkpzb25QYXRoLnN0cmluZ0F0KCckLkVuZHBvaW50LkNvbmZpZycpLFxuICAgICAgZW5kcG9pbnROYW1lOiBzZm4uSnNvblBhdGguc3RyaW5nQXQoJyQuRW5kcG9pbnQuTmFtZScpLFxuICAgIH0pO1xuXG4gICAgY3JlYXRlRW5kcG9pbnRUYXNrLmFkZENhdGNoKHVwZGF0ZUVuZHBvaW50VGFzaywge1xuICAgICAgZXJyb3JzOiBbJ1N0YXRlcy5UYXNrRmFpbGVkJ10sXG4gICAgICByZXN1bHRQYXRoOiAnJC5FbmRwb2ludERlcGxveWVkJyxcbiAgICB9KTtcbiAgICBjb25zdCBkZWZpbml0aW9uID0gbmV3IHNmbi5QYXNzKHRoaXMsICdTdGFydCcsIHtcbiAgICAgIHJlc3VsdDogc2ZuLlJlc3VsdC5mcm9tT2JqZWN0KFxuICAgICAgICB7XG4gICAgICAgICAgRW5kcG9pbnQ6IHtcbiAgICAgICAgICAgIC8vIENoYW5nZSB0byByZWFsIHBhcmFtZXRlcnMgZm9yIHRoZSBhY3R1YWwgcnVuICYgcHV0IHRoZSB0ZXN0aW5nIGRhdGEgaW4gdGhlIHRyYWluaW5nIGJ1Y2tldFxuICAgICAgICAgICAgSW1hZ2U6ICdJbWFnZUFybicsXG4gICAgICAgICAgICBDb25maWc6ICdNeUVuZHBvaW50Q29uZmlnJyxcbiAgICAgICAgICAgIE5hbWU6ICdNeUVuZHBvaW50TmFtZScsXG4gICAgICAgICAgICBNb2RlbDogJ015RW5kcG9pbnRNb2RlbE5hbWUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgIH0pXG4gICAgICAubmV4dCh0cmFpbmluZ0pvYilcbiAgICAgIC5uZXh0KGNyZWF0ZU1vZGVsVGFzaylcbiAgICAgIC5uZXh0KGNyZWF0ZUVuZHBvaW50Q29uZmlnVGFzaylcbiAgICAgIC5uZXh0KGNyZWF0ZUVuZHBvaW50VGFzayk7XG5cbiAgICBjb25zdCBzdGF0ZU1hY2hpbmUgPSBuZXcgc2ZuLlN0YXRlTWFjaGluZSh0aGlzLCAnU3RhdGVNYWNoaW5lJywge1xuICAgICAgZGVmaW5pdGlvbixcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdTdGF0ZU1hY2hpbmVBcm4nLCB7XG4gICAgICB2YWx1ZTogc3RhdGVNYWNoaW5lLnN0YXRlTWFjaGluZUFybixcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IENhbGxTYWdlTWFrZXJTdGFjayhhcHAsICdhd3Mtc3RlcGZ1bmN0aW9ucy1pbnRlZy1zYWdlbWFrZXInKTtcbmFwcC5zeW50aCgpO1xuXG4iXX0=