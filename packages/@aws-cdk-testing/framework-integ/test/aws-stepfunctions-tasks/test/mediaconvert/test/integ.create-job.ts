import * as iam from 'aws-cdk-lib/aws-iam';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { App, Stack } from 'aws-cdk-lib';
import { MediaConvertCreateJob } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IntegTest } from '@aws-cdk/integ-tests-alpha/lib';

/*
 * Creates a state machine that creates a MediaConvert Job.
 * https://docs.aws.amazon.com/step-functions/latest/dg/connect-mediaconvert.html
 *
 * Stack verification steps:
 *
 * Before we execute the state machine, we need to update the following fields in the state machine definition
 *   Role: https://docs.aws.amazon.com/mediaconvert/latest/apireference/jobs.html#jobs-prop-createjobrequest-role
 *   Settings: https://docs.aws.amazon.com/mediaconvert/latest/apireference/jobs.html#jobs-prop-createjobrequest-settings
 *
 * Once updated, the generated state machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded` & output contains the MediaConvert Job ARN
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <execution-arn> returns a status of `Succeeded`
 *
 * We can also check for the MediaConvert Job status from the CLI (or Media Convert console)
 *
 * -- aws mediaconvert get-job --id <job-id>
 *
 */
const app = new App();

const stack = new Stack(app, 'aws-cdk-mediaconvert-create-job-test-stack');

const mediaConvertRole = iam.Role.fromRoleArn(stack, 'MediaConvertRole', 'arn:aws:iam::123456789012:role/MediaConvertRole');

const step = new MediaConvertCreateJob(stack, 'MediaConvertCreateJob', {
  createJobRequest: {
    Role: mediaConvertRole.roleArn,
    Settings: {
      OutputGroups: [
        {
          Outputs: [
            {
              ContainerSettings: {
                Container: 'MP4',
              },
              VideoDescription: {
                CodecSettings: {
                  Codec: 'H_264',
                  H264Settings: {
                    MaxBitrate: 1000,
                    RateControlMode: 'QVBR',
                    SceneChangeDetect: 'TRANSITION_DETECTION',
                  },
                },
              },
              AudioDescriptions: [
                {
                  CodecSettings: {
                    Codec: 'AAC',
                    AacSettings: {
                      Bitrate: 96000,
                      CodingMode: 'CODING_MODE_2_0',
                      SampleRate: 48000,
                    },
                  },
                },
              ],
            },
          ],
          OutputGroupSettings: {
            Type: 'FILE_GROUP_SETTINGS',
            FileGroupSettings: {
              Destination: 's3://EXAMPLE-DESTINATION-BUCKET/',
            },
          },
        },
      ],
      Inputs: [
        {
          AudioSelectors: {
            'Audio Selector 1': {
              DefaultSelection: 'DEFAULT',
            },
          },
          FileInput: 's3://EXAMPLE-SOURCE-BUCKET/EXAMPLE-SOURCE_FILE',
        },
      ],
    },
  },
});

new sfn.StateMachine(stack, 'StateMachine', {
  definition: step,
});

new IntegTest(app, 'MediaConvertCreateJobTest', {
  testCases: [stack],
});

app.synth();
