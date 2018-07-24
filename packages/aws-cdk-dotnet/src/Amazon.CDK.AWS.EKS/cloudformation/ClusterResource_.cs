using Amazon.CDK;
using Amazon.CDK.AWS.EKS;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EKS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html </remarks>
    [JsiiClass(typeof(ClusterResource_), "@aws-cdk/aws-eks.cloudformation.ClusterResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-eks.cloudformation.ClusterResourceProps\"}}]")]
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
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("clusterArn", "{\"fqn\":\"@aws-cdk/aws-eks.ClusterArn\"}")]
        public virtual ClusterArn ClusterArn
        {
            get => GetInstanceProperty<ClusterArn>();
        }

        /// <remarks>cloudformation_attribute: CertificateAuthorityData</remarks>
        [JsiiProperty("clusterCertificateAuthorityData", "{\"fqn\":\"@aws-cdk/aws-eks.ClusterCertificateAuthorityData\"}")]
        public virtual ClusterCertificateAuthorityData ClusterCertificateAuthorityData
        {
            get => GetInstanceProperty<ClusterCertificateAuthorityData>();
        }

        /// <remarks>cloudformation_attribute: Endpoint</remarks>
        [JsiiProperty("clusterEndpoint", "{\"fqn\":\"@aws-cdk/aws-eks.ClusterEndpoint\"}")]
        public virtual ClusterEndpoint ClusterEndpoint
        {
            get => GetInstanceProperty<ClusterEndpoint>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}