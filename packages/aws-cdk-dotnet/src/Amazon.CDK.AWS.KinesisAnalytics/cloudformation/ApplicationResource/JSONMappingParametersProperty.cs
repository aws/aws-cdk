using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-jsonmappingparameters.html </remarks>
    public class JSONMappingParametersProperty : DeputyBase, Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource.IJSONMappingParametersProperty
    {
        /// <summary>``ApplicationResource.JSONMappingParametersProperty.RecordRowPath``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-jsonmappingparameters.html#cfn-kinesisanalytics-application-jsonmappingparameters-recordrowpath </remarks>
        [JsiiProperty("recordRowPath", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object RecordRowPath
        {
            get;
            set;
        }
    }
}