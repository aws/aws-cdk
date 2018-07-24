using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-placementgroup.html </remarks>
    [JsiiInterfaceProxy(typeof(IPlacementGroupResourceProps), "@aws-cdk/aws-ec2.cloudformation.PlacementGroupResourceProps")]
    internal class PlacementGroupResourcePropsProxy : DeputyBase, IPlacementGroupResourceProps
    {
        private PlacementGroupResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::EC2::PlacementGroup.Strategy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-placementgroup.html#cfn-ec2-placementgroup-strategy </remarks>
        [JsiiProperty("strategy", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Strategy
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}