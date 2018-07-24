using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK
{
    [JsiiClass(typeof(Output), "@aws-cdk/cdk.Output", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/cdk.OutputProps\",\"optional\":true}}]")]
    public class Output : StackElement
    {
        public Output(Construct parent, string name, IOutputProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Output(ByRefValue reference): base(reference)
        {
        }

        protected Output(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// A String type that describes the output value.
        /// The description can be a maximum of 4 K in length.
        /// </summary>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Description
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>
        /// The value of the property returned by the aws cloudformation describe-stacks command.
        /// The value of an output can include literals, parameter references, pseudo-parameters,
        /// a mapping value, or intrinsic functions.
        /// </summary>
        [JsiiProperty("value", "{\"primitive\":\"any\",\"optional\":true}")]
        public virtual object Value
        {
            get => GetInstanceProperty<object>();
        }

        /// <summary>
        /// The name of the resource output to be exported for a cross-stack reference.
        /// By default, the logical ID of the Output element is used as it's export name.
        /// </summary>
        [JsiiProperty("export", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Export
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>
        /// A condition from the "Conditions" section to associate with this output
        /// value. If the condition evaluates to `false`, this output value will not
        /// be included in the stack.
        /// </summary>
        [JsiiProperty("condition", "{\"fqn\":\"@aws-cdk/cdk.Condition\",\"optional\":true}")]
        public virtual Condition Condition
        {
            get => GetInstanceProperty<Condition>();
        }

        [JsiiProperty("ref", "{\"fqn\":\"@aws-cdk/cdk.Token\"}")]
        public virtual Token Ref
        {
            get => GetInstanceProperty<Token>();
        }

        /// <summary>Returns an FnImportValue bound to this export name.</summary>
        [JsiiMethod("makeImportValue", "{\"fqn\":\"@aws-cdk/cdk.FnImportValue\"}", "[]")]
        public virtual FnImportValue MakeImportValue()
        {
            return InvokeInstanceMethod<FnImportValue>(new object[]{});
        }

        /// <summary>
        /// Returns the CloudFormation 'snippet' for this entity. The snippet will only be merged
        /// at the root level to ensure there are no identity conflicts.
        /// 
        /// For example, a Resource class will return something like:
        /// {
        ///      Resources: {
        ///          [this.logicalId]: {
        ///              Type: this.resourceType,
        ///              Properties: this.props,
        ///              Condition: this.condition
        ///          }
        ///      }
        /// }
        /// </summary>
        [JsiiMethod("toCloudFormation", "{\"primitive\":\"json\"}", "[]")]
        public override JObject ToCloudFormation()
        {
            return InvokeInstanceMethod<JObject>(new object[]{});
        }
    }
}