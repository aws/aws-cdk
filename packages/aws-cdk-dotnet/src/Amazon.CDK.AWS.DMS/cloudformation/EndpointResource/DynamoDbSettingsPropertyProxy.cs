using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DMS.cloudformation.EndpointResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-dynamodbsettings.html </remarks>
    [JsiiInterfaceProxy(typeof(IDynamoDbSettingsProperty), "@aws-cdk/aws-dms.cloudformation.EndpointResource.DynamoDbSettingsProperty")]
    internal class DynamoDbSettingsPropertyProxy : DeputyBase, IDynamoDbSettingsProperty
    {
        private DynamoDbSettingsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``EndpointResource.DynamoDbSettingsProperty.ServiceAccessRoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-dynamodbsettings.html#cfn-dms-endpoint-dynamodbsettings-serviceaccessrolearn </remarks>
        [JsiiProperty("serviceAccessRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ServiceAccessRoleArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}