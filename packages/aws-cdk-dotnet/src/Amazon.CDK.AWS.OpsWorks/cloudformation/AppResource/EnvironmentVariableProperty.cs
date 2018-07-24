using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation.AppResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-environment.html </remarks>
    public class EnvironmentVariableProperty : DeputyBase, IEnvironmentVariableProperty
    {
        /// <summary>``AppResource.EnvironmentVariableProperty.Key``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-environment.html#cfn-opsworks-app-environment-key </remarks>
        [JsiiProperty("key", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Key
        {
            get;
            set;
        }

        /// <summary>``AppResource.EnvironmentVariableProperty.Secure``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-environment.html#cfn-opsworks-app-environment-secure </remarks>
        [JsiiProperty("secure", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Secure
        {
            get;
            set;
        }

        /// <summary>``AppResource.EnvironmentVariableProperty.Value``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-environment.html#value </remarks>
        [JsiiProperty("value", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Value
        {
            get;
            set;
        }
    }
}