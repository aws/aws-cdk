using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation.TaskDefinitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions-hostentry.html </remarks>
    [JsiiInterface(typeof(IHostEntryProperty), "@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.HostEntryProperty")]
    public interface IHostEntryProperty
    {
        /// <summary>``TaskDefinitionResource.HostEntryProperty.Hostname``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions-hostentry.html#cfn-ecs-taskdefinition-containerdefinition-hostentry-hostname </remarks>
        [JsiiProperty("hostname", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Hostname
        {
            get;
            set;
        }

        /// <summary>``TaskDefinitionResource.HostEntryProperty.IpAddress``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-containerdefinitions-hostentry.html#cfn-ecs-taskdefinition-containerdefinition-hostentry-ipaddress </remarks>
        [JsiiProperty("ipAddress", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object IpAddress
        {
            get;
            set;
        }
    }
}