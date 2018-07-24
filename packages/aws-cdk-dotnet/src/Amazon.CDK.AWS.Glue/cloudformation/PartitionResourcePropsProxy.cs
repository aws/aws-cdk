using Amazon.CDK;
using Amazon.CDK.AWS.Glue.cloudformation.PartitionResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-partition.html </remarks>
    [JsiiInterfaceProxy(typeof(IPartitionResourceProps), "@aws-cdk/aws-glue.cloudformation.PartitionResourceProps")]
    internal class PartitionResourcePropsProxy : DeputyBase, IPartitionResourceProps
    {
        private PartitionResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::Glue::Partition.CatalogId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-partition.html#cfn-glue-partition-catalogid </remarks>
        [JsiiProperty("catalogId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object CatalogId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Glue::Partition.DatabaseName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-partition.html#cfn-glue-partition-databasename </remarks>
        [JsiiProperty("databaseName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object DatabaseName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Glue::Partition.PartitionInput``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-partition.html#cfn-glue-partition-partitioninput </remarks>
        [JsiiProperty("partitionInput", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-glue.cloudformation.PartitionResource.PartitionInputProperty\"}]}}")]
        public virtual object PartitionInput
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Glue::Partition.TableName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-partition.html#cfn-glue-partition-tablename </remarks>
        [JsiiProperty("tableName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object TableName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}