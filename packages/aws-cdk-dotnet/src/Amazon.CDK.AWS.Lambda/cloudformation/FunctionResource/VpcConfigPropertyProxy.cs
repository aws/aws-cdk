using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda.cloudformation.FunctionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IVpcConfigProperty), "@aws-cdk/aws-lambda.cloudformation.FunctionResource.VpcConfigProperty")]
    internal class VpcConfigPropertyProxy : DeputyBase, IVpcConfigProperty
    {
        private VpcConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``FunctionResource.VpcConfigProperty.SecurityGroupIds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html#cfn-lambda-function-vpcconfig-securitygroupids </remarks>
        [JsiiProperty("securityGroupIds", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}")]
        public virtual object SecurityGroupIds
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``FunctionResource.VpcConfigProperty.SubnetIds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html#cfn-lambda-function-vpcconfig-subnetids </remarks>
        [JsiiProperty("subnetIds", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}")]
        public virtual object SubnetIds
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}