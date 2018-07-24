using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DirectoryService.cloudformation.SimpleADResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-simplead-vpcsettings.html </remarks>
    public class VpcSettingsProperty : DeputyBase, Amazon.CDK.AWS.DirectoryService.cloudformation.SimpleADResource.IVpcSettingsProperty
    {
        /// <summary>``SimpleADResource.VpcSettingsProperty.SubnetIds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-simplead-vpcsettings.html#cfn-directoryservice-simplead-vpcsettings-subnetids </remarks>
        [JsiiProperty("subnetIds", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}", true)]
        public object SubnetIds
        {
            get;
            set;
        }

        /// <summary>``SimpleADResource.VpcSettingsProperty.VpcId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-simplead-vpcsettings.html#cfn-directoryservice-simplead-vpcsettings-vpcid </remarks>
        [JsiiProperty("vpcId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object VpcId
        {
            get;
            set;
        }
    }
}