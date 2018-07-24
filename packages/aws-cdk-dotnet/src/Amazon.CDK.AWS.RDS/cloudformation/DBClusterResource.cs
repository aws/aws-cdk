using Amazon.CDK;
using Amazon.CDK.AWS.RDS;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.RDS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html </remarks>
    [JsiiClass(typeof(DBClusterResource), "@aws-cdk/aws-rds.cloudformation.DBClusterResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-rds.cloudformation.DBClusterResourceProps\"}}]")]
    public class DBClusterResource : Resource
    {
        public DBClusterResource(Construct parent, string name, IDBClusterResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected DBClusterResource(ByRefValue reference): base(reference)
        {
        }

        protected DBClusterResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(DBClusterResource));
        /// <remarks>cloudformation_attribute: Endpoint.Address</remarks>
        [JsiiProperty("dbClusterEndpointAddress", "{\"fqn\":\"@aws-cdk/aws-rds.DBClusterEndpointAddress\"}")]
        public virtual DBClusterEndpointAddress DbClusterEndpointAddress
        {
            get => GetInstanceProperty<DBClusterEndpointAddress>();
        }

        /// <remarks>cloudformation_attribute: Endpoint.Port</remarks>
        [JsiiProperty("dbClusterEndpointPort", "{\"fqn\":\"@aws-cdk/aws-rds.DBClusterEndpointPort\"}")]
        public virtual DBClusterEndpointPort DbClusterEndpointPort
        {
            get => GetInstanceProperty<DBClusterEndpointPort>();
        }

        /// <remarks>cloudformation_attribute: ReadEndpoint.Address</remarks>
        [JsiiProperty("dbClusterReadEndpointAddress", "{\"fqn\":\"@aws-cdk/aws-rds.DBClusterReadEndpointAddress\"}")]
        public virtual DBClusterReadEndpointAddress DbClusterReadEndpointAddress
        {
            get => GetInstanceProperty<DBClusterReadEndpointAddress>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}