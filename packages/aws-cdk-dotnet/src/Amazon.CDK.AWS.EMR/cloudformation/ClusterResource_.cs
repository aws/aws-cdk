using Amazon.CDK;
using Amazon.CDK.AWS.EMR;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EMR.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html </remarks>
    [JsiiClass(typeof(ClusterResource_), "@aws-cdk/aws-emr.cloudformation.ClusterResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResourceProps\"}}]")]
    public class ClusterResource_ : Resource
    {
        public ClusterResource_(Construct parent, string name, IClusterResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ClusterResource_(ByRefValue reference): base(reference)
        {
        }

        protected ClusterResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ClusterResource_));
        /// <remarks>cloudformation_attribute: MasterPublicDNS</remarks>
        [JsiiProperty("clusterMasterPublicDns", "{\"fqn\":\"@aws-cdk/aws-emr.ClusterMasterPublicDns\"}")]
        public virtual ClusterMasterPublicDns ClusterMasterPublicDns
        {
            get => GetInstanceProperty<ClusterMasterPublicDns>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}