using Amazon.CDK;
using Amazon.CDK.AWS.DAX;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.DAX.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dax-cluster.html </remarks>
    [JsiiClass(typeof(ClusterResource), "@aws-cdk/aws-dax.cloudformation.ClusterResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-dax.cloudformation.ClusterResourceProps\"}}]")]
    public class ClusterResource : Resource
    {
        public ClusterResource(Construct parent, string name, IClusterResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ClusterResource(ByRefValue reference): base(reference)
        {
        }

        protected ClusterResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ClusterResource));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("clusterArn", "{\"fqn\":\"@aws-cdk/aws-dax.ClusterArn\"}")]
        public virtual ClusterArn ClusterArn
        {
            get => GetInstanceProperty<ClusterArn>();
        }

        /// <remarks>cloudformation_attribute: ClusterDiscoveryEndpoint</remarks>
        [JsiiProperty("clusterDiscoveryEndpoint", "{\"fqn\":\"@aws-cdk/aws-dax.ClusterDiscoveryEndpoint\"}")]
        public virtual ClusterDiscoveryEndpoint ClusterDiscoveryEndpoint
        {
            get => GetInstanceProperty<ClusterDiscoveryEndpoint>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}