using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.SpotFleetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata-launchspecifications-securitygroups.html </remarks>
    [JsiiInterface(typeof(IGroupIdentifierProperty), "@aws-cdk/aws-ec2.cloudformation.SpotFleetResource.GroupIdentifierProperty")]
    public interface IGroupIdentifierProperty
    {
        /// <summary>``SpotFleetResource.GroupIdentifierProperty.GroupId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata-launchspecifications-securitygroups.html#cfn-ec2-spotfleet-groupidentifier-groupid </remarks>
        [JsiiProperty("groupId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object GroupId
        {
            get;
            set;
        }
    }
}