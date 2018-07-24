using Amazon.CDK.CXAPI;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK
{
    /// <summary>A root construct which represents a single CloudFormation stack.</summary>
    [JsiiClass(typeof(Stack), "@aws-cdk/cdk.Stack", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.App\",\"optional\":true}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\",\"optional\":true}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/cdk.StackProps\",\"optional\":true}}]")]
    public class Stack : Construct
    {
        public Stack(App parent, string name, IStackProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Stack(ByRefValue reference): base(reference)
        {
        }

        protected Stack(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// Lists all missing contextual information.
        /// This is returned when the stack is synthesized under the 'missing' attribute
        /// and allows tooling to obtain the context and re-synthesize.
        /// </summary>
        [JsiiProperty("missingContext", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"fqn\":\"@aws-cdk/cx-api.MissingContext\"}}}")]
        public virtual IDictionary<string, IMissingContext> MissingContext
        {
            get => GetInstanceProperty<IDictionary<string, IMissingContext>>();
        }

        /// <summary>The environment in which this stack is deployed.</summary>
        [JsiiProperty("env", "{\"fqn\":\"@aws-cdk/cdk.Environment\"}")]
        public virtual IEnvironment Env
        {
            get => GetInstanceProperty<IEnvironment>();
        }

        /// <summary>Used to determine if this construct is a stack.</summary>
        [JsiiProperty("isStack", "{\"primitive\":\"boolean\"}")]
        public virtual bool IsStack
        {
            get => GetInstanceProperty<bool>();
        }

        /// <summary>Logical ID generation strategy</summary>
        [JsiiProperty("logicalIds", "{\"fqn\":\"@aws-cdk/cdk.LogicalIDs\"}")]
        public virtual LogicalIDs LogicalIds
        {
            get => GetInstanceProperty<LogicalIDs>();
        }

        /// <summary>Options for CloudFormation template (like version, transform, description).</summary>
        [JsiiProperty("templateOptions", "{\"fqn\":\"@aws-cdk/cdk.TemplateOptions\"}")]
        public virtual ITemplateOptions TemplateOptions
        {
            get => GetInstanceProperty<ITemplateOptions>();
        }

        /// <summary>Traverses the tree and looks up for the Stack root.</summary>
        /// <param name = "node">A construct in the tree</param>
        /// <returns>The Stack object (throws if the node is not part of a Stack-rooted tree)</returns>
        [JsiiMethod("find", "{\"fqn\":\"@aws-cdk/cdk.Stack\"}", "[{\"name\":\"node\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}}]")]
        public static Stack Find(Construct node)
        {
            return InvokeStaticMethod<Stack>(typeof(Stack), new object[]{node});
        }

        /// <summary>
        /// Adds a metadata annotation "aws:cdk:physical-name" to the construct if physicalName
        /// is non-null. This can be used later by tools and aspects to determine if resources
        /// have been created with physical names.
        /// </summary>
        [JsiiMethod("annotatePhysicalName", null, "[{\"name\":\"construct\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"physicalName\",\"type\":{\"primitive\":\"string\",\"optional\":true}}]")]
        public static void AnnotatePhysicalName(Construct construct, string physicalName)
        {
            InvokeStaticVoidMethod(typeof(Stack), new object[]{construct, physicalName});
        }

        /// <summary>Looks up a resource by path.</summary>
        /// <returns>The Resource or undefined if not found</returns>
        [JsiiMethod("findResource", "{\"fqn\":\"@aws-cdk/cdk.Resource\",\"optional\":true}", "[{\"name\":\"path\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual Resource FindResource(string path)
        {
            return InvokeInstanceMethod<Resource>(new object[]{path});
        }

        /// <summary>
        /// Returns the CloudFormation template for this stack by traversing
        /// the tree and invoking toCloudFormation() on all Entity objects.
        /// </summary>
        [JsiiMethod("toCloudFormation", "{\"primitive\":\"any\"}", "[]")]
        public virtual object ToCloudFormation()
        {
            return InvokeInstanceMethod<object>(new object[]{});
        }

        /// <param name = "why">more information about why region is required.</param>
        /// <returns>The region in which this stack is deployed. Throws if region is not defined.</returns>
        [JsiiMethod("requireRegion", "{\"primitive\":\"string\"}", "[{\"name\":\"why\",\"type\":{\"primitive\":\"string\",\"optional\":true}}]")]
        public virtual string RequireRegion(string why)
        {
            return InvokeInstanceMethod<string>(new object[]{why});
        }

        /// <summary>
        /// Indicate that a context key was expected
        /// 
        /// Contains instructions on how the key should be supplied.
        /// </summary>
        /// <param name = "key">Key that uniquely identifies this missing context.</param>
        /// <param name = "details">The set of parameters needed to obtain the context (specific to context provider).</param>
        [JsiiMethod("reportMissingContext", null, "[{\"name\":\"key\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"details\",\"type\":{\"fqn\":\"@aws-cdk/cx-api.MissingContext\"}}]")]
        public virtual void ReportMissingContext(string key, IMissingContext details)
        {
            InvokeInstanceVoidMethod(new object[]{key, details});
        }

        /// <summary>Rename a generated logical identities</summary>
        [JsiiMethod("renameLogical", null, "[{\"name\":\"oldId\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"newId\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void RenameLogical(string oldId, string newId)
        {
            InvokeInstanceVoidMethod(new object[]{oldId, newId});
        }
    }
}