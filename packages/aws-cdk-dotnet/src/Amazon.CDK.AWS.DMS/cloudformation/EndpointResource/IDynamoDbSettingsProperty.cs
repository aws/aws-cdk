using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DMS.cloudformation.EndpointResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-dynamodbsettings.html </remarks>
    [JsiiInterface(typeof(IDynamoDbSettingsProperty), "@aws-cdk/aws-dms.cloudformation.EndpointResource.DynamoDbSettingsProperty")]
    public interface IDynamoDbSettingsProperty
    {
        /// <summary>``EndpointResource.DynamoDbSettingsProperty.ServiceAccessRoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-dynamodbsettings.html#cfn-dms-endpoint-dynamodbsettings-serviceaccessrolearn </remarks>
        [JsiiProperty("serviceAccessRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ServiceAccessRoleArn
        {
            get;
            set;
        }
    }
}