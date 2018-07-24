using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-jsonmappingparameters.html </remarks>
    [JsiiInterfaceProxy(typeof(IJSONMappingParametersProperty), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.JSONMappingParametersProperty")]
    internal class JSONMappingParametersPropertyProxy : DeputyBase, Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource.IJSONMappingParametersProperty
    {
        private JSONMappingParametersPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ApplicationResource.JSONMappingParametersProperty.RecordRowPath``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-jsonmappingparameters.html#cfn-kinesisanalytics-application-jsonmappingparameters-recordrowpath </remarks>
        [JsiiProperty("recordRowPath", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object RecordRowPath
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}