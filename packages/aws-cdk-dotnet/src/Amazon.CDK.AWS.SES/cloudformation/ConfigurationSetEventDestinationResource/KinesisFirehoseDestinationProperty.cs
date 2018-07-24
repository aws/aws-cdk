using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.ConfigurationSetEventDestinationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-kinesisfirehosedestination.html </remarks>
    public class KinesisFirehoseDestinationProperty : DeputyBase, IKinesisFirehoseDestinationProperty
    {
        /// <summary>``ConfigurationSetEventDestinationResource.KinesisFirehoseDestinationProperty.DeliveryStreamARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-kinesisfirehosedestination.html#cfn-ses-configurationseteventdestination-kinesisfirehosedestination-deliverystreamarn </remarks>
        [JsiiProperty("deliveryStreamArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object DeliveryStreamArn
        {
            get;
            set;
        }

        /// <summary>``ConfigurationSetEventDestinationResource.KinesisFirehoseDestinationProperty.IAMRoleARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-kinesisfirehosedestination.html#cfn-ses-configurationseteventdestination-kinesisfirehosedestination-iamrolearn </remarks>
        [JsiiProperty("iamRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object IamRoleArn
        {
            get;
            set;
        }
    }
}