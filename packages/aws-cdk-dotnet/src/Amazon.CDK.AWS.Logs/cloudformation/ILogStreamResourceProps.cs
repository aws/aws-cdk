using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-logstream.html </remarks>
    [JsiiInterface(typeof(ILogStreamResourceProps), "@aws-cdk/aws-logs.cloudformation.LogStreamResourceProps")]
    public interface ILogStreamResourceProps
    {
        /// <summary>``AWS::Logs::LogStream.LogGroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-logstream.html#cfn-logs-logstream-loggroupname </remarks>
        [JsiiProperty("logGroupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object LogGroupName
        {
            get;
            set;
        }

        /// <summary>``AWS::Logs::LogStream.LogStreamName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-logstream.html#cfn-logs-logstream-logstreamname </remarks>
        [JsiiProperty("logStreamName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object LogStreamName
        {
            get;
            set;
        }
    }
}