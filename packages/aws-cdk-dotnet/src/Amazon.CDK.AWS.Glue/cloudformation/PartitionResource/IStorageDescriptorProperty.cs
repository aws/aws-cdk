using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.Glue.cloudformation.PartitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html </remarks>
    [JsiiInterface(typeof(IStorageDescriptorProperty), "@aws-cdk/aws-glue.cloudformation.PartitionResource.StorageDescriptorProperty")]
    public interface IStorageDescriptorProperty
    {
        /// <summary>``PartitionResource.StorageDescriptorProperty.BucketColumns``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-bucketcolumns </remarks>
        [JsiiProperty("bucketColumns", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object BucketColumns
        {
            get;
            set;
        }

        /// <summary>``PartitionResource.StorageDescriptorProperty.Columns``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-columns </remarks>
        [JsiiProperty("columns", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-glue.cloudformation.PartitionResource.ColumnProperty\"}]}}}}]},\"optional\":true}")]
        object Columns
        {
            get;
            set;
        }

        /// <summary>``PartitionResource.StorageDescriptorProperty.Compressed``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-compressed </remarks>
        [JsiiProperty("compressed", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Compressed
        {
            get;
            set;
        }

        /// <summary>``PartitionResource.StorageDescriptorProperty.InputFormat``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-inputformat </remarks>
        [JsiiProperty("inputFormat", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object InputFormat
        {
            get;
            set;
        }

        /// <summary>``PartitionResource.StorageDescriptorProperty.Location``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-location </remarks>
        [JsiiProperty("location", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Location
        {
            get;
            set;
        }

        /// <summary>``PartitionResource.StorageDescriptorProperty.NumberOfBuckets``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-numberofbuckets </remarks>
        [JsiiProperty("numberOfBuckets", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object NumberOfBuckets
        {
            get;
            set;
        }

        /// <summary>``PartitionResource.StorageDescriptorProperty.OutputFormat``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-outputformat </remarks>
        [JsiiProperty("outputFormat", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object OutputFormat
        {
            get;
            set;
        }

        /// <summary>``PartitionResource.StorageDescriptorProperty.Parameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-parameters </remarks>
        [JsiiProperty("parameters", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Parameters
        {
            get;
            set;
        }

        /// <summary>``PartitionResource.StorageDescriptorProperty.SerdeInfo``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-serdeinfo </remarks>
        [JsiiProperty("serdeInfo", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-glue.cloudformation.PartitionResource.SerdeInfoProperty\"}]},\"optional\":true}")]
        object SerdeInfo
        {
            get;
            set;
        }

        /// <summary>``PartitionResource.StorageDescriptorProperty.SkewedInfo``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-skewedinfo </remarks>
        [JsiiProperty("skewedInfo", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-glue.cloudformation.PartitionResource.SkewedInfoProperty\"}]},\"optional\":true}")]
        object SkewedInfo
        {
            get;
            set;
        }

        /// <summary>``PartitionResource.StorageDescriptorProperty.SortColumns``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-sortcolumns </remarks>
        [JsiiProperty("sortColumns", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-glue.cloudformation.PartitionResource.OrderProperty\"}]}}}}]},\"optional\":true}")]
        object SortColumns
        {
            get;
            set;
        }

        /// <summary>``PartitionResource.StorageDescriptorProperty.StoredAsSubDirectories``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-storedassubdirectories </remarks>
        [JsiiProperty("storedAsSubDirectories", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object StoredAsSubDirectories
        {
            get;
            set;
        }
    }
}