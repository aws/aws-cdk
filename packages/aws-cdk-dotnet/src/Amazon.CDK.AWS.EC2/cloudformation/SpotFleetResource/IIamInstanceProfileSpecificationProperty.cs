using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.SpotFleetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata-launchspecifications-iaminstanceprofile.html </remarks>
    [JsiiInterface(typeof(IIamInstanceProfileSpecificationProperty), "@aws-cdk/aws-ec2.cloudformation.SpotFleetResource.IamInstanceProfileSpecificationProperty")]
    public interface IIamInstanceProfileSpecificationProperty
    {
        /// <summary>``SpotFleetResource.IamInstanceProfileSpecificationProperty.Arn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata-launchspecifications-iaminstanceprofile.html#cfn-ec2-spotfleet-iaminstanceprofilespecification-arn </remarks>
        [JsiiProperty("arn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Arn
        {
            get;
            set;
        }
    }
}