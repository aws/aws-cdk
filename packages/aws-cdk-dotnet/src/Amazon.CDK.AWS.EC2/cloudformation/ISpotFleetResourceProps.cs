using Amazon.CDK;
using Amazon.CDK.AWS.EC2.cloudformation.SpotFleetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-spotfleet.html </remarks>
    [JsiiInterface(typeof(ISpotFleetResourceProps), "@aws-cdk/aws-ec2.cloudformation.SpotFleetResourceProps")]
    public interface ISpotFleetResourceProps
    {
        /// <summary>``AWS::EC2::SpotFleet.SpotFleetRequestConfigData``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-spotfleet.html#cfn-ec2-spotfleet-spotfleetrequestconfigdata </remarks>
        [JsiiProperty("spotFleetRequestConfigData", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.SpotFleetResource.SpotFleetRequestConfigDataProperty\"}]}}")]
        object SpotFleetRequestConfigData
        {
            get;
            set;
        }
    }
}