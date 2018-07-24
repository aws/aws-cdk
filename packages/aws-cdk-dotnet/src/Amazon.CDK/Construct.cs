using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// Represents the building block of the construct graph.
    /// When a construct is created, it is always added as a child
    /// </summary>
    [JsiiClass(typeof(Construct), "@aws-cdk/cdk.Construct", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public class Construct : DeputyBase
    {
        public Construct(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected Construct(ByRefValue reference): base(reference)
        {
        }

        protected Construct(DeputyProps props): base(props)
        {
        }

        /// <summary>Returns the parent of this node or undefined if this is a root node.</summary>
        [JsiiProperty("parent", "{\"fqn\":\"@aws-cdk/cdk.Construct\",\"optional\":true}")]
        public virtual Construct Parent
        {
            get => GetInstanceProperty<Construct>();
        }

        /// <summary>The name of this construct</summary>
        [JsiiProperty("name", "{\"primitive\":\"string\"}")]
        public virtual string Name
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>All direct children of this construct.</summary>
        [JsiiProperty("children", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}}}")]
        public virtual Construct[] Children
        {
            get => GetInstanceProperty<Construct[]>();
        }

        /// <summary>Returns the path of all constructs from root to this construct, in string form.</summary>
        /// <returns>/-separated path of this Construct.</returns>
        [JsiiProperty("path", "{\"primitive\":\"string\"}")]
        public virtual string Path
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>
        /// An array of metadata objects associated with this construct.
        /// This can be used, for example, to implement support for deprecation notices, source mapping, etc.
        /// </summary>
        [JsiiProperty("metadata", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.MetadataEntry\"}}}")]
        public virtual IMetadataEntry[] Metadata
        {
            get => GetInstanceProperty<IMetadataEntry[]>();
        }

        /// <summary>Returns a string representation of this construct.</summary>
        [JsiiMethod("toString", "{\"primitive\":\"string\"}", "[]")]
        public override string ToString()
        {
            return InvokeInstanceMethod<string>(new object[]{});
        }

        /// <summary>Returns a string with a tree representation of this construct and it's children.</summary>
        [JsiiMethod("toTreeString", "{\"primitive\":\"string\"}", "[{\"name\":\"depth\",\"type\":{\"primitive\":\"number\",\"optional\":true}}]")]
        public virtual string ToTreeString(double? depth)
        {
            return InvokeInstanceMethod<string>(new object[]{depth});
        }

        /// <summary>Return a descendant by path, or undefined</summary>
        /// <returns>a child by path or undefined if not found.</returns>
        [JsiiMethod("tryFindChild", "{\"fqn\":\"@aws-cdk/cdk.Construct\",\"optional\":true}", "[{\"name\":\"path\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual Construct TryFindChild(string path)
        {
            return InvokeInstanceMethod<Construct>(new object[]{path});
        }

        /// <summary>
        /// Return a descendant by path
        /// 
        /// Throws an exception if the descendant is not found.
        /// </summary>
        /// <returns>Child with the given path.</returns>
        [JsiiMethod("findChild", "{\"fqn\":\"@aws-cdk/cdk.Construct\"}", "[{\"name\":\"path\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual Construct FindChild(string path)
        {
            return InvokeInstanceMethod<Construct>(new object[]{path});
        }

        /// <summary>
        /// This can be used to set contextual values.
        /// Context must be set before any children are added, since children may consult context info during construction.
        /// If the key already exists, it will be overridden.
        /// </summary>
        /// <param name = "key">The context key</param>
        /// <param name = "value">The context value</param>
        [JsiiMethod("setContext", null, "[{\"name\":\"key\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"value\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual void SetContext(string key, object value)
        {
            InvokeInstanceVoidMethod(new object[]{key, value});
        }

        /// <summary>
        /// Retrieves a value from tree context.
        /// 
        /// Context is usually initialized at the root, but can be overridden at any point in the tree.
        /// </summary>
        /// <param name = "key">The context key</param>
        /// <returns>The context value or undefined</returns>
        [JsiiMethod("getContext", "{\"primitive\":\"any\"}", "[{\"name\":\"key\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual object GetContext(string key)
        {
            return InvokeInstanceMethod<object>(new object[]{key});
        }

        /// <summary>
        /// Retrieve a value from tree-global context
        /// 
        /// It is an error if the context object is not available.
        /// </summary>
        [JsiiMethod("requireContext", "{\"primitive\":\"any\"}", "[{\"name\":\"key\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual object RequireContext(string key)
        {
            return InvokeInstanceMethod<object>(new object[]{key});
        }

        /// <summary>
        /// Adds a metadata entry to this construct.
        /// Entries are arbitrary values and will also include a stack trace to allow tracing back to
        /// the code location for when the entry was added. It can be used, for example, to include source
        /// mapping in CloudFormation templates to improve diagnostics.
        /// </summary>
        /// <param name = "type">a string denoting the type of metadata</param>
        /// <param name = "data">the value of the metadata (can be a Token). If null/undefined, metadata will not be added.</param>
        /// <param name = "from">a function under which to restrict the metadata entry's stack trace (defaults to this.addMetadata)</param>
        [JsiiMethod("addMetadata", "{\"fqn\":\"@aws-cdk/cdk.Construct\"}", "[{\"name\":\"type\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"data\",\"type\":{\"primitive\":\"any\"}},{\"name\":\"from\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
        public virtual Construct AddMetadata(string type, object data, object from)
        {
            return InvokeInstanceMethod<Construct>(new object[]{type, data, from});
        }

        /// <summary>
        /// Adds a { "aws:cdk:info": &lt;message&gt; } metadata entry to this construct.
        /// The toolkit will display the info message when apps are synthesized.
        /// </summary>
        /// <param name = "message">The info message.</param>
        [JsiiMethod("addInfo", "{\"fqn\":\"@aws-cdk/cdk.Construct\"}", "[{\"name\":\"message\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual Construct AddInfo(string message)
        {
            return InvokeInstanceMethod<Construct>(new object[]{message});
        }

        /// <summary>
        /// Adds a { warning: &lt;message&gt; } metadata entry to this construct.
        /// The toolkit will display the warning when an app is synthesized, or fail
        /// if run in --strict mode.
        /// </summary>
        /// <param name = "message">The warning message.</param>
        [JsiiMethod("addWarning", "{\"fqn\":\"@aws-cdk/cdk.Construct\"}", "[{\"name\":\"message\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual Construct AddWarning(string message)
        {
            return InvokeInstanceMethod<Construct>(new object[]{message});
        }

        /// <summary>
        /// Adds an { error: &lt;message&gt; } metadata entry to this construct.
        /// The toolkit will fail synthesis when errors are reported.
        /// </summary>
        /// <param name = "message">The error message.</param>
        [JsiiMethod("addError", "{\"fqn\":\"@aws-cdk/cdk.Construct\"}", "[{\"name\":\"message\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual Construct AddError(string message)
        {
            return InvokeInstanceMethod<Construct>(new object[]{message});
        }

        /// <summary>
        /// This method can be implemented by derived constructs in order to perform
        /// validation logic. It is called on all constructs before synthesis.
        /// </summary>
        /// <returns>An array of validation error messages, or an empty array if there the construct is valid.</returns>
        [JsiiMethod("validate", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}", "[]")]
        public virtual string[] Validate()
        {
            return InvokeInstanceMethod<string[]>(new object[]{});
        }

        /// <summary>Invokes 'validate' on all child constructs and then on this construct (depth-first).</summary>
        /// <returns>A list of validation errors. If the list is empty, all constructs are valid.</returns>
        [JsiiMethod("validateTree", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.ValidationError\"}}}", "[]")]
        public virtual ValidationError[] ValidateTree()
        {
            return InvokeInstanceMethod<ValidationError[]>(new object[]{});
        }

        /// <summary>Return the ancestors (including self) of this Construct up until and excluding the indicated component</summary>
        [JsiiMethod("ancestors", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}}}", "[{\"name\":\"upTo\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\",\"optional\":true}}]")]
        protected virtual Construct[] Ancestors(Construct upTo)
        {
            return InvokeInstanceMethod<Construct[]>(new object[]{upTo});
        }

        /// <summary>
        /// Throws if the `props` bag doesn't include the property `name`.
        /// In the future we can add some type-checking here, maybe even auto-generate during compilation.
        /// </summary>
        /// <param name = "props">The props bag.</param>
        /// <param name = "name">The name of the required property.</param>
        /// <remarks>
        /// aws: -cdk/runtime`` instead.
        /// deprecated: use ``requireProperty`` from ``
        /// </remarks>
        [JsiiMethod("required", "{\"primitive\":\"any\"}", "[{\"name\":\"props\",\"type\":{\"primitive\":\"any\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
        protected virtual object Required(object props, string name)
        {
            return InvokeInstanceMethod<object>(new object[]{props, name});
        }

        /// <summary>Adds a child construct to this node.</summary>
        /// <param name = "child">The child construct</param>
        /// <returns>The resolved path part name of the child</returns>
        [JsiiMethod("addChild", null, "[{\"name\":\"child\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"childName\",\"type\":{\"primitive\":\"string\"}}]")]
        protected virtual void AddChild(Construct child, string childName)
        {
            InvokeInstanceVoidMethod(new object[]{child, childName});
        }

        /// <summary>
        /// Locks this construct from allowing more children to be added. After this
        /// call, no more children can be added to this construct or to any children.
        /// </summary>
        [JsiiMethod("lock", null, "[]")]
        protected virtual void Lock()
        {
            InvokeInstanceVoidMethod(new object[]{});
        }

        /// <summary>Unlocks this costruct and allows mutations (adding children).</summary>
        [JsiiMethod("unlock", null, "[]")]
        protected virtual void Unlock()
        {
            InvokeInstanceVoidMethod(new object[]{});
        }
    }
}