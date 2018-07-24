using Amazon.CDK;
using Amazon.CDK.AWS.DirectoryService.cloudformation.SimpleADResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DirectoryService.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html </remarks>
    [JsiiInterface(typeof(ISimpleADResourceProps), "@aws-cdk/aws-directoryservice.cloudformation.SimpleADResourceProps")]
    public interface ISimpleADResourceProps
    {
        /// <summary>``AWS::DirectoryService::SimpleAD.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-name </remarks>
        [JsiiProperty("simpleAdName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object SimpleAdName
        {
            get;
            set;
        }

        /// <summary>``AWS::DirectoryService::SimpleAD.Password``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-password </remarks>
        [JsiiProperty("password", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Password
        {
            get;
            set;
        }

        /// <summary>``AWS::DirectoryService::SimpleAD.Size``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-size </remarks>
        [JsiiProperty("size", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Size
        {
            get;
            set;
        }

        /// <summary>``AWS::DirectoryService::SimpleAD.VpcSettings``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-vpcsettings </remarks>
        [JsiiProperty("vpcSettings", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-directoryservice.cloudformation.SimpleADResource.VpcSettingsProperty\"}]}}")]
        object VpcSettings
        {
            get;
            set;
        }

        /// <summary>``AWS::DirectoryService::SimpleAD.CreateAlias``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-createalias </remarks>
        [JsiiProperty("createAlias", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CreateAlias
        {
            get;
            set;
        }

        /// <summary>``AWS::DirectoryService::SimpleAD.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Description
        {
            get;
            set;
        }

        /// <summary>``AWS::DirectoryService::SimpleAD.EnableSso``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-enablesso </remarks>
        [JsiiProperty("enableSso", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object EnableSso
        {
            get;
            set;
        }

        /// <summary>``AWS::DirectoryService::SimpleAD.ShortName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-shortname </remarks>
        [JsiiProperty("shortName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ShortName
        {
            get;
            set;
        }
    }
}