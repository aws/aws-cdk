using Amazon.CDK;
using Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationOutputResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html </remarks>
    [JsiiInterface(typeof(IApplicationOutputResourceProps), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationOutputResourceProps")]
    public interface IApplicationOutputResourceProps
    {
        /// <summary>``AWS::KinesisAnalytics::ApplicationOutput.ApplicationName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html#cfn-kinesisanalytics-applicationoutput-applicationname </remarks>
        [JsiiProperty("applicationName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ApplicationName
        {
            get;
            set;
        }

        /// <summary>``AWS::KinesisAnalytics::ApplicationOutput.Output``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html#cfn-kinesisanalytics-applicationoutput-output </remarks>
        [JsiiProperty("output", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationOutputResource.OutputProperty\"}]}}")]
        object Output
        {
            get;
            set;
        }
    }
}