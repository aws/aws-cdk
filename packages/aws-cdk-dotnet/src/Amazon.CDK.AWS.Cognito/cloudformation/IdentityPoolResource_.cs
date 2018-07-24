using Amazon.CDK;
using Amazon.CDK.AWS.Cognito;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Cognito.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html </remarks>
    [JsiiClass(typeof(IdentityPoolResource_), "@aws-cdk/aws-cognito.cloudformation.IdentityPoolResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.IdentityPoolResourceProps\"}}]")]
    public class IdentityPoolResource_ : Resource
    {
        public IdentityPoolResource_(Construct parent, string name, IIdentityPoolResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected IdentityPoolResource_(ByRefValue reference): base(reference)
        {
        }

        protected IdentityPoolResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(IdentityPoolResource_));
        /// <remarks>cloudformation_attribute: Name</remarks>
        [JsiiProperty("identityPoolName", "{\"fqn\":\"@aws-cdk/aws-cognito.IdentityPoolName\"}")]
        public virtual IdentityPoolName IdentityPoolName
        {
            get => GetInstanceProperty<IdentityPoolName>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}