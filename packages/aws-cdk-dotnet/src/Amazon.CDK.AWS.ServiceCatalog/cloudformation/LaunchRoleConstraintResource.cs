using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ServiceCatalog.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html </remarks>
    [JsiiClass(typeof(LaunchRoleConstraintResource), "@aws-cdk/aws-servicecatalog.cloudformation.LaunchRoleConstraintResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-servicecatalog.cloudformation.LaunchRoleConstraintResourceProps\"}}]")]
    public class LaunchRoleConstraintResource : Resource
    {
        public LaunchRoleConstraintResource(Construct parent, string name, ILaunchRoleConstraintResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected LaunchRoleConstraintResource(ByRefValue reference): base(reference)
        {
        }

        protected LaunchRoleConstraintResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(LaunchRoleConstraintResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}