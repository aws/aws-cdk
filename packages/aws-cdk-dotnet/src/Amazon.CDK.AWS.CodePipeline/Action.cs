using Amazon.CDK;
using Amazon.CDK.AWS.CodePipeline.cloudformation.PipelineResource;
using Amazon.CDK.AWS.Events;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>
    /// Low level class for generically creating pipeline actions.
    /// It is recommended that concrete types are used instead, such as {@link codecommit.PipelineSource} or
    /// {@link codebuild.PipelineBuildAction}.
    /// </summary>
    [JsiiClass(typeof(Action), "@aws-cdk/aws-codepipeline.Action", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Stage\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.ActionProps\"}}]")]
    public abstract class Action : Construct
    {
        protected Action(Stage parent, string name, IActionProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Action(ByRefValue reference): base(reference)
        {
        }

        protected Action(DeputyProps props): base(props)
        {
        }

        /// <summary>The category of the action. The category defines which action type the owner (the entity that performs the action) performs.</summary>
        [JsiiProperty("category", "{\"fqn\":\"@aws-cdk/aws-codepipeline.ActionCategory\"}")]
        public virtual ActionCategory Category
        {
            get => GetInstanceProperty<ActionCategory>();
        }

        /// <summary>The service provider that the action calls.</summary>
        [JsiiProperty("provider", "{\"primitive\":\"string\"}")]
        public virtual string Provider
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>
        /// The action's configuration. These are key-value pairs that specify input values for an action.
        /// For more information, see the AWS CodePipeline User Guide.
        /// 
        /// http://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
        /// </summary>
        [JsiiProperty("configuration", "{\"primitive\":\"any\",\"optional\":true}")]
        public virtual object Configuration
        {
            get => GetInstanceProperty<object>();
        }

        /// <summary>
        /// The order in which AWS CodePipeline runs this action.
        /// For more information, see the AWS CodePipeline User Guide.
        /// 
        /// https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
        /// </summary>
        [JsiiProperty("runOrder", "{\"primitive\":\"number\"}")]
        public virtual double RunOrder
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// This method can be implemented by derived constructs in order to perform
        /// validation logic. It is called on all constructs before synthesis.
        /// </summary>
        [JsiiMethod("validate", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}", "[]")]
        public override string[] Validate()
        {
            return InvokeInstanceMethod<string[]>(new object[]{});
        }

        /// <summary>Render the Action to a CloudFormation struct</summary>
        [JsiiMethod("render", "{\"fqn\":\"@aws-cdk/aws-codepipeline.cloudformation.PipelineResource.ActionDeclarationProperty\"}", "[]")]
        public virtual IActionDeclarationProperty Render()
        {
            return InvokeInstanceMethod<IActionDeclarationProperty>(new object[]{});
        }

        [JsiiMethod("onStateChange", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
        public virtual EventRule OnStateChange(string name, IIEventRuleTargetProps target, IEventRuleProps options)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, options});
        }

        /// <summary>If an Artifact is added as a child, add it to the list of output artifacts.</summary>
        [JsiiMethod("addChild", null, "[{\"name\":\"child\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
        protected override void AddChild(Construct child, string name)
        {
            InvokeInstanceVoidMethod(new object[]{child, name});
        }

        [JsiiMethod("addOutputArtifact", "{\"fqn\":\"@aws-cdk/aws-codepipeline.Artifact\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
        protected virtual Artifact AddOutputArtifact(string name)
        {
            return InvokeInstanceMethod<Artifact>(new object[]{name});
        }

        [JsiiMethod("addInputArtifact", "{\"fqn\":\"@aws-cdk/aws-codepipeline.Action\"}", "[{\"name\":\"artifact\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Artifact\"}}]")]
        protected virtual Action AddInputArtifact(Artifact artifact)
        {
            return InvokeInstanceMethod<Action>(new object[]{artifact});
        }
    }
}