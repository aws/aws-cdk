using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.NetworkAclEntryResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-networkaclentry-portrange.html </remarks>
    [JsiiInterface(typeof(IPortRangeProperty), "@aws-cdk/aws-ec2.cloudformation.NetworkAclEntryResource.PortRangeProperty")]
    public interface IPortRangeProperty
    {
        /// <summary>``NetworkAclEntryResource.PortRangeProperty.From``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-networkaclentry-portrange.html#cfn-ec2-networkaclentry-portrange-from </remarks>
        [JsiiProperty("from", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object From
        {
            get;
            set;
        }

        /// <summary>``NetworkAclEntryResource.PortRangeProperty.To``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-networkaclentry-portrange.html#cfn-ec2-networkaclentry-portrange-to </remarks>
        [JsiiProperty("to", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object To
        {
            get;
            set;
        }
    }
}