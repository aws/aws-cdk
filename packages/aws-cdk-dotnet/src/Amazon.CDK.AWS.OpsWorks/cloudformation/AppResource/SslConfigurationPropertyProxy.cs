using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation.AppResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(ISslConfigurationProperty), "@aws-cdk/aws-opsworks.cloudformation.AppResource.SslConfigurationProperty")]
    internal class SslConfigurationPropertyProxy : DeputyBase, ISslConfigurationProperty
    {
        private SslConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AppResource.SslConfigurationProperty.Certificate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html#cfn-opsworks-app-sslconfig-certificate </remarks>
        [JsiiProperty("certificate", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Certificate
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AppResource.SslConfigurationProperty.Chain``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html#cfn-opsworks-app-sslconfig-chain </remarks>
        [JsiiProperty("chain", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Chain
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AppResource.SslConfigurationProperty.PrivateKey``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html#cfn-opsworks-app-sslconfig-privatekey </remarks>
        [JsiiProperty("privateKey", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object PrivateKey
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}