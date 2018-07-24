using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.RDS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-security-group-ingress.html </remarks>
    [JsiiClass(typeof(DBSecurityGroupIngressResource), "@aws-cdk/aws-rds.cloudformation.DBSecurityGroupIngressResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-rds.cloudformation.DBSecurityGroupIngressResourceProps\"}}]")]
    public class DBSecurityGroupIngressResource : Resource
    {
        public DBSecurityGroupIngressResource(Construct parent, string name, IDBSecurityGroupIngressResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected DBSecurityGroupIngressResource(ByRefValue reference): base(reference)
        {
        }

        protected DBSecurityGroupIngressResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(DBSecurityGroupIngressResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}