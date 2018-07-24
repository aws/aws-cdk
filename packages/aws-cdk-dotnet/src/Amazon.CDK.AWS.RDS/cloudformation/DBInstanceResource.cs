using Amazon.CDK;
using Amazon.CDK.AWS.RDS;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.RDS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-database-instance.html </remarks>
    [JsiiClass(typeof(DBInstanceResource), "@aws-cdk/aws-rds.cloudformation.DBInstanceResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-rds.cloudformation.DBInstanceResourceProps\"}}]")]
    public class DBInstanceResource : Resource
    {
        public DBInstanceResource(Construct parent, string name, IDBInstanceResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected DBInstanceResource(ByRefValue reference): base(reference)
        {
        }

        protected DBInstanceResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(DBInstanceResource));
        /// <remarks>cloudformation_attribute: Endpoint.Address</remarks>
        [JsiiProperty("dbInstanceEndpointAddress", "{\"fqn\":\"@aws-cdk/aws-rds.DBInstanceEndpointAddress\"}")]
        public virtual DBInstanceEndpointAddress DbInstanceEndpointAddress
        {
            get => GetInstanceProperty<DBInstanceEndpointAddress>();
        }

        /// <remarks>cloudformation_attribute: Endpoint.Port</remarks>
        [JsiiProperty("dbInstanceEndpointPort", "{\"fqn\":\"@aws-cdk/aws-rds.DBInstanceEndpointPort\"}")]
        public virtual DBInstanceEndpointPort DbInstanceEndpointPort
        {
            get => GetInstanceProperty<DBInstanceEndpointPort>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}