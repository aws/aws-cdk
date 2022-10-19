import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as glue from '../lib';

let x: firehose.CfnDeliveryStream.CloudWatchLoggingOptionsProperty;
let y: glue.CfnTable;