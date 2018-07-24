using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationReferenceDataSourceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referencedatasource.html </remarks>
    [JsiiInterface(typeof(IReferenceDataSourceProperty), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationReferenceDataSourceResource.ReferenceDataSourceProperty")]
    public interface IReferenceDataSourceProperty
    {
        /// <summary>``ApplicationReferenceDataSourceResource.ReferenceDataSourceProperty.ReferenceSchema``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-referencedatasource-referenceschema </remarks>
        [JsiiProperty("referenceSchema", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationReferenceDataSourceResource.ReferenceSchemaProperty\"}]}}")]
        object ReferenceSchema
        {
            get;
            set;
        }

        /// <summary>``ApplicationReferenceDataSourceResource.ReferenceDataSourceProperty.S3ReferenceDataSource``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-referencedatasource-s3referencedatasource </remarks>
        [JsiiProperty("s3ReferenceDataSource", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationReferenceDataSourceResource.S3ReferenceDataSourceProperty\"}]},\"optional\":true}")]
        object S3ReferenceDataSource
        {
            get;
            set;
        }

        /// <summary>``ApplicationReferenceDataSourceResource.ReferenceDataSourceProperty.TableName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-referencedatasource-tablename </remarks>
        [JsiiProperty("tableName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object TableName
        {
            get;
            set;
        }
    }
}