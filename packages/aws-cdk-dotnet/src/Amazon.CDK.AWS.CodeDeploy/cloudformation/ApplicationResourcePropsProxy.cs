using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeDeploy.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-application.html </remarks>
    [JsiiInterfaceProxy(typeof(IApplicationResourceProps), "@aws-cdk/aws-codedeploy.cloudformation.ApplicationResourceProps")]
    internal class ApplicationResourcePropsProxy : DeputyBase, IApplicationResourceProps
    {
        private ApplicationResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::CodeDeploy::Application.ApplicationName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-application.html#cfn-codedeploy-application-applicationname </remarks>
        [JsiiProperty("applicationName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ApplicationName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::CodeDeploy::Application.ComputePlatform``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-application.html#cfn-codedeploy-application-computeplatform </remarks>
        [JsiiProperty("computePlatform", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ComputePlatform
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}