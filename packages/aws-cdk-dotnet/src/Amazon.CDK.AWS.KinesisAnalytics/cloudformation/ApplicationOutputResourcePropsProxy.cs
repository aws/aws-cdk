using Amazon.CDK;
using Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationOutputResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html </remarks>
    [JsiiInterfaceProxy(typeof(IApplicationOutputResourceProps), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationOutputResourceProps")]
    internal class ApplicationOutputResourcePropsProxy : DeputyBase, IApplicationOutputResourceProps
    {
        private ApplicationOutputResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::KinesisAnalytics::ApplicationOutput.ApplicationName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html#cfn-kinesisanalytics-applicationoutput-applicationname </remarks>
        [JsiiProperty("applicationName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ApplicationName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::KinesisAnalytics::ApplicationOutput.Output``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html#cfn-kinesisanalytics-applicationoutput-output </remarks>
        [JsiiProperty("output", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationOutputResource.OutputProperty\"}]}}")]
        public virtual object Output
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}