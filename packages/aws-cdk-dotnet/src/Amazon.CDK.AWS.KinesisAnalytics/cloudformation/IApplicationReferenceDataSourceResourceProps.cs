using Amazon.CDK;
using Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationReferenceDataSourceResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationreferencedatasource.html </remarks>
    [JsiiInterface(typeof(IApplicationReferenceDataSourceResourceProps), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationReferenceDataSourceResourceProps")]
    public interface IApplicationReferenceDataSourceResourceProps
    {
        /// <summary>``AWS::KinesisAnalytics::ApplicationReferenceDataSource.ApplicationName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationreferencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-applicationname </remarks>
        [JsiiProperty("applicationName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ApplicationName
        {
            get;
            set;
        }

        /// <summary>``AWS::KinesisAnalytics::ApplicationReferenceDataSource.ReferenceDataSource``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationreferencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-referencedatasource </remarks>
        [JsiiProperty("referenceDataSource", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationReferenceDataSourceResource.ReferenceDataSourceProperty\"}]}}")]
        object ReferenceDataSource
        {
            get;
            set;
        }
    }
}