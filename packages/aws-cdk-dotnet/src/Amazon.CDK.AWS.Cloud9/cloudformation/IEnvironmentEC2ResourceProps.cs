using Amazon.CDK;
using Amazon.CDK.AWS.Cloud9.cloudformation.EnvironmentEC2Resource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cloud9.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html </remarks>
    [JsiiInterface(typeof(IEnvironmentEC2ResourceProps), "@aws-cdk/aws-cloud9.cloudformation.EnvironmentEC2ResourceProps")]
    public interface IEnvironmentEC2ResourceProps
    {
        /// <summary>``AWS::Cloud9::EnvironmentEC2.InstanceType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-instancetype </remarks>
        [JsiiProperty("instanceType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object InstanceType
        {
            get;
            set;
        }

        /// <summary>``AWS::Cloud9::EnvironmentEC2.AutomaticStopTimeMinutes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-automaticstoptimeminutes </remarks>
        [JsiiProperty("automaticStopTimeMinutes", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AutomaticStopTimeMinutes
        {
            get;
            set;
        }

        /// <summary>``AWS::Cloud9::EnvironmentEC2.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Description
        {
            get;
            set;
        }

        /// <summary>``AWS::Cloud9::EnvironmentEC2.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-name </remarks>
        [JsiiProperty("environmentEc2Name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object EnvironmentEc2Name
        {
            get;
            set;
        }

        /// <summary>``AWS::Cloud9::EnvironmentEC2.OwnerArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-ownerarn </remarks>
        [JsiiProperty("ownerArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object OwnerArn
        {
            get;
            set;
        }

        /// <summary>``AWS::Cloud9::EnvironmentEC2.Repositories``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-repositories </remarks>
        [JsiiProperty("repositories", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloud9.cloudformation.EnvironmentEC2Resource.RepositoryProperty\"}]}}}}]},\"optional\":true}")]
        object Repositories
        {
            get;
            set;
        }

        /// <summary>``AWS::Cloud9::EnvironmentEC2.SubnetId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-subnetid </remarks>
        [JsiiProperty("subnetId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SubnetId
        {
            get;
            set;
        }
    }
}