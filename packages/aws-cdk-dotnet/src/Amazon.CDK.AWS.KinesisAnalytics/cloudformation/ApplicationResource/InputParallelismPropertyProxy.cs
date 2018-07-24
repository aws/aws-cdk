using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputparallelism.html </remarks>
    [JsiiInterfaceProxy(typeof(IInputParallelismProperty), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.InputParallelismProperty")]
    internal class InputParallelismPropertyProxy : DeputyBase, IInputParallelismProperty
    {
        private InputParallelismPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ApplicationResource.InputParallelismProperty.Count``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputparallelism.html#cfn-kinesisanalytics-application-inputparallelism-count </remarks>
        [JsiiProperty("count", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Count
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}