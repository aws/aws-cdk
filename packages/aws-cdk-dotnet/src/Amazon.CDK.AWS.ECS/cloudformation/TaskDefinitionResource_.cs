using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ECS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html </remarks>
    [JsiiClass(typeof(TaskDefinitionResource_), "@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResourceProps\",\"optional\":true}}]")]
    public class TaskDefinitionResource_ : Resource
    {
        public TaskDefinitionResource_(Construct parent, string name, ITaskDefinitionResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected TaskDefinitionResource_(ByRefValue reference): base(reference)
        {
        }

        protected TaskDefinitionResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(TaskDefinitionResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}