using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.SpotFleetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata-launchspecifications-tagspecifications.html </remarks>
    [JsiiInterface(typeof(ISpotFleetTagSpecificationProperty), "@aws-cdk/aws-ec2.cloudformation.SpotFleetResource.SpotFleetTagSpecificationProperty")]
    public interface ISpotFleetTagSpecificationProperty
    {
        /// <summary>``SpotFleetResource.SpotFleetTagSpecificationProperty.ResourceType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata-launchspecifications-tagspecifications.html#cfn-ec2-spotfleet-spotfleettagspecification-resourcetype </remarks>
        [JsiiProperty("resourceType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ResourceType
        {
            get;
            set;
        }
    }
}