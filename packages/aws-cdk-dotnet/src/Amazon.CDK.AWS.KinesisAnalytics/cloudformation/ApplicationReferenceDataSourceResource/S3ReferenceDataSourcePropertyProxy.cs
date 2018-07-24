using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationReferenceDataSourceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-s3referencedatasource.html </remarks>
    [JsiiInterfaceProxy(typeof(IS3ReferenceDataSourceProperty), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationReferenceDataSourceResource.S3ReferenceDataSourceProperty")]
    internal class S3ReferenceDataSourcePropertyProxy : DeputyBase, IS3ReferenceDataSourceProperty
    {
        private S3ReferenceDataSourcePropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ApplicationReferenceDataSourceResource.S3ReferenceDataSourceProperty.BucketARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-s3referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-s3referencedatasource-bucketarn </remarks>
        [JsiiProperty("bucketArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object BucketArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ApplicationReferenceDataSourceResource.S3ReferenceDataSourceProperty.FileKey``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-s3referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-s3referencedatasource-filekey </remarks>
        [JsiiProperty("fileKey", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object FileKey
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ApplicationReferenceDataSourceResource.S3ReferenceDataSourceProperty.ReferenceRoleARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-s3referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-s3referencedatasource-referencerolearn </remarks>
        [JsiiProperty("referenceRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ReferenceRoleArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}