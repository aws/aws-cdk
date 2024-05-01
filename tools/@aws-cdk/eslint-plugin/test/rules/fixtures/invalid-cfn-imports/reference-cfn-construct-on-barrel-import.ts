import * as firehose from '@aws-cdk/aws-kinesisfirehose-alpha';
import * as glue from '../lib';

let x: firehose.CfnDeliveryStream.CloudWatchLoggingOptionsProperty;
let y: glue.CfnTable;