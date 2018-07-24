using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DMS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html </remarks>
    [JsiiInterface(typeof(IReplicationTaskResourceProps), "@aws-cdk/aws-dms.cloudformation.ReplicationTaskResourceProps")]
    public interface IReplicationTaskResourceProps
    {
        /// <summary>``AWS::DMS::ReplicationTask.MigrationType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-migrationtype </remarks>
        [JsiiProperty("migrationType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object MigrationType
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::ReplicationTask.ReplicationInstanceArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-replicationinstancearn </remarks>
        [JsiiProperty("replicationInstanceArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ReplicationInstanceArn
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::ReplicationTask.SourceEndpointArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-sourceendpointarn </remarks>
        [JsiiProperty("sourceEndpointArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object SourceEndpointArn
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::ReplicationTask.TableMappings``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-tablemappings </remarks>
        [JsiiProperty("tableMappings", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object TableMappings
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::ReplicationTask.TargetEndpointArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-targetendpointarn </remarks>
        [JsiiProperty("targetEndpointArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object TargetEndpointArn
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::ReplicationTask.CdcStartTime``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-cdcstarttime </remarks>
        [JsiiProperty("cdcStartTime", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CdcStartTime
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::ReplicationTask.ReplicationTaskIdentifier``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-replicationtaskidentifier </remarks>
        [JsiiProperty("replicationTaskIdentifier", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ReplicationTaskIdentifier
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::ReplicationTask.ReplicationTaskSettings``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-replicationtasksettings </remarks>
        [JsiiProperty("replicationTaskSettings", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ReplicationTaskSettings
        {
            get;
            set;
        }

        /// <summary>``AWS::DMS::ReplicationTask.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}")]
        object Tags
        {
            get;
            set;
        }
    }
}