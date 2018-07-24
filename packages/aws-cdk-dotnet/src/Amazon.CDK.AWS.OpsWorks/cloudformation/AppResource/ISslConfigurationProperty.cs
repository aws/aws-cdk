using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation.AppResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html </remarks>
    [JsiiInterface(typeof(ISslConfigurationProperty), "@aws-cdk/aws-opsworks.cloudformation.AppResource.SslConfigurationProperty")]
    public interface ISslConfigurationProperty
    {
        /// <summary>``AppResource.SslConfigurationProperty.Certificate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html#cfn-opsworks-app-sslconfig-certificate </remarks>
        [JsiiProperty("certificate", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Certificate
        {
            get;
            set;
        }

        /// <summary>``AppResource.SslConfigurationProperty.Chain``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html#cfn-opsworks-app-sslconfig-chain </remarks>
        [JsiiProperty("chain", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Chain
        {
            get;
            set;
        }

        /// <summary>``AppResource.SslConfigurationProperty.PrivateKey``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html#cfn-opsworks-app-sslconfig-privatekey </remarks>
        [JsiiProperty("privateKey", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PrivateKey
        {
            get;
            set;
        }
    }
}