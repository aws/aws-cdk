using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ServiceCatalog.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html </remarks>
    [JsiiClass(typeof(LaunchTemplateConstraintResource), "@aws-cdk/aws-servicecatalog.cloudformation.LaunchTemplateConstraintResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-servicecatalog.cloudformation.LaunchTemplateConstraintResourceProps\"}}]")]
    public class LaunchTemplateConstraintResource : Resource
    {
        public LaunchTemplateConstraintResource(Construct parent, string name, ILaunchTemplateConstraintResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected LaunchTemplateConstraintResource(ByRefValue reference): base(reference)
        {
        }

        protected LaunchTemplateConstraintResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(LaunchTemplateConstraintResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}