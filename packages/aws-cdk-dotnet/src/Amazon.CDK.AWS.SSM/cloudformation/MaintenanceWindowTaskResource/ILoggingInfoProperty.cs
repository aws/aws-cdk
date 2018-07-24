using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM.cloudformation.MaintenanceWindowTaskResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-logginginfo.html </remarks>
    [JsiiInterface(typeof(ILoggingInfoProperty), "@aws-cdk/aws-ssm.cloudformation.MaintenanceWindowTaskResource.LoggingInfoProperty")]
    public interface ILoggingInfoProperty
    {
        /// <summary>``MaintenanceWindowTaskResource.LoggingInfoProperty.Region``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-logginginfo.html#cfn-ssm-maintenancewindowtask-logginginfo-region </remarks>
        [JsiiProperty("region", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Region
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.LoggingInfoProperty.S3Bucket``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-logginginfo.html#cfn-ssm-maintenancewindowtask-logginginfo-s3bucket </remarks>
        [JsiiProperty("s3Bucket", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object S3Bucket
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.LoggingInfoProperty.S3Prefix``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-logginginfo.html#cfn-ssm-maintenancewindowtask-logginginfo-s3prefix </remarks>
        [JsiiProperty("s3Prefix", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object S3Prefix
        {
            get;
            set;
        }
    }
}