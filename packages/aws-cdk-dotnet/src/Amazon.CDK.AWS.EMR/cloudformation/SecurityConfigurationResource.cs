using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EMR.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-securityconfiguration.html </remarks>
    [JsiiClass(typeof(SecurityConfigurationResource), "@aws-cdk/aws-emr.cloudformation.SecurityConfigurationResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.SecurityConfigurationResourceProps\"}}]")]
    public class SecurityConfigurationResource : Resource
    {
        public SecurityConfigurationResource(Construct parent, string name, ISecurityConfigurationResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected SecurityConfigurationResource(ByRefValue reference): base(reference)
        {
        }

        protected SecurityConfigurationResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(SecurityConfigurationResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}