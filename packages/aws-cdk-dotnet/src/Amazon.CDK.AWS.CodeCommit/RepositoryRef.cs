using Amazon.CDK;
using Amazon.CDK.AWS.Events;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    /// <summary>
    /// Represents a reference to a CodeCommit Repository.
    /// 
    /// If you want to create a new Repository managed alongside your CDK code,
    /// use the {@link Repository} class.
    /// 
    /// If you want to reference an already existing Repository,
    /// use the {@link RepositoryRef.import} method.
    /// </summary>
    [JsiiClass(typeof(RepositoryRef), "@aws-cdk/aws-codecommit.RepositoryRef", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class RepositoryRef : Construct
    {
        protected RepositoryRef(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected RepositoryRef(ByRefValue reference): base(reference)
        {
        }

        protected RepositoryRef(DeputyProps props): base(props)
        {
        }

        /// <summary>The ARN of this Repository. </summary>
        [JsiiProperty("repositoryArn", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryArn\"}")]
        public virtual RepositoryArn RepositoryArn
        {
            get => GetInstanceProperty<RepositoryArn>();
        }

        /// <summary>The human-visible name of this Repository. </summary>
        [JsiiProperty("repositoryName", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryName\"}")]
        public virtual RepositoryName RepositoryName
        {
            get => GetInstanceProperty<RepositoryName>();
        }

        /// <summary>
        /// Import a Repository defined either outside the CDK, or in a different Stack
        /// (exported with the {@link export} method).
        /// </summary>
        /// <param name = "parent">the parent Construct for the Repository</param>
        /// <param name = "name">the name of the Repository Construct</param>
        /// <param name = "props">the properties used to identify the existing Repository</param>
        /// <returns>a reference to the existing Repository</returns>
        [JsiiMethod("import", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryRef\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryRefProps\"}}]")]
        public static RepositoryRef Import(Construct parent, string name, IRepositoryRefProps props)
        {
            return InvokeStaticMethod<RepositoryRef>(typeof(RepositoryRef), new object[]{parent, name, props});
        }

        /// <summary>Exports this Repository. Allows the same Repository to be used in 2 different Stacks.</summary>
        /// <remarks>see: import</remarks>
        [JsiiMethod("export", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryRefProps\"}", "[]")]
        public virtual IRepositoryRefProps Export()
        {
            return InvokeInstanceMethod<IRepositoryRefProps>(new object[]{});
        }

        /// <summary>
        /// Defines a CloudWatch event rule which triggers for repository events. Use
        /// `rule.addEventPattern(pattern)` to specify a filter.
        /// </summary>
        [JsiiMethod("onEvent", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
        public virtual EventRule OnEvent(string name, IIEventRuleTargetProps target, IEventRuleProps options)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, options});
        }

        /// <summary>
        /// Defines a CloudWatch event rule which triggers when a "CodeCommit
        /// Repository State Change" event occurs.
        /// </summary>
        [JsiiMethod("onStateChange", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
        public virtual EventRule OnStateChange(string name, IIEventRuleTargetProps target, IEventRuleProps options)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, options});
        }

        /// <summary>
        /// Defines a CloudWatch event rule which triggers when a reference is
        /// created (i.e. a new brach/tag is created) to the repository.
        /// </summary>
        [JsiiMethod("onReferenceCreated", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
        public virtual EventRule OnReferenceCreated(string name, IIEventRuleTargetProps target, IEventRuleProps options)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, options});
        }

        /// <summary>
        /// Defines a CloudWatch event rule which triggers when a reference is
        /// updated (i.e. a commit is pushed to an existig branch) from the repository.
        /// </summary>
        [JsiiMethod("onReferenceUpdated", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
        public virtual EventRule OnReferenceUpdated(string name, IIEventRuleTargetProps target, IEventRuleProps options)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, options});
        }

        /// <summary>
        /// Defines a CloudWatch event rule which triggers when a reference is
        /// delete (i.e. a branch/tag is deleted) from the repository.
        /// </summary>
        [JsiiMethod("onReferenceDeleted", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
        public virtual EventRule OnReferenceDeleted(string name, IIEventRuleTargetProps target, IEventRuleProps options)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, options});
        }

        /// <summary>Defines a CloudWatch event rule which triggers when a pull request state is changed.</summary>
        [JsiiMethod("onPullRequestStateChange", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
        public virtual EventRule OnPullRequestStateChange(string name, IIEventRuleTargetProps target, IEventRuleProps options)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, options});
        }

        /// <summary>Defines a CloudWatch event rule which triggers when a comment is made on a pull request.</summary>
        [JsiiMethod("onCommentOnPullRequest", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
        public virtual EventRule OnCommentOnPullRequest(string name, IIEventRuleTargetProps target, IEventRuleProps options)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, options});
        }

        /// <summary>Defines a CloudWatch event rule which triggers when a comment is made on a commit.</summary>
        [JsiiMethod("onCommentOnCommit", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
        public virtual EventRule OnCommentOnCommit(string name, IIEventRuleTargetProps target, IEventRuleProps options)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, options});
        }

        /// <summary>Defines a CloudWatch event rule which triggers when a commit is pushed to a branch.</summary>
        /// <param name = "target">The target of the event</param>
        /// <param name = "branch">The branch to monitor. Defaults to all branches.</param>
        [JsiiMethod("onCommit", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"branch\",\"type\":{\"primitive\":\"string\",\"optional\":true}}]")]
        public virtual EventRule OnCommit(string name, IIEventRuleTargetProps target, string branch)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, branch});
        }
    }
}