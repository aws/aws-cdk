using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Elasticsearch.cloudformation.DomainResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-snapshotoptions.html </remarks>
    [JsiiInterface(typeof(ISnapshotOptionsProperty), "@aws-cdk/aws-elasticsearch.cloudformation.DomainResource.SnapshotOptionsProperty")]
    public interface ISnapshotOptionsProperty
    {
        /// <summary>``DomainResource.SnapshotOptionsProperty.AutomatedSnapshotStartHour``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-snapshotoptions.html#cfn-elasticsearch-domain-snapshotoptions-automatedsnapshotstarthour </remarks>
        [JsiiProperty("automatedSnapshotStartHour", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AutomatedSnapshotStartHour
        {
            get;
            set;
        }
    }
}