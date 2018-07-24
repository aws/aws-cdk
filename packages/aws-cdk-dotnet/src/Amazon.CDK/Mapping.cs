using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK
{
    /// <summary>Represents a CloudFormation mapping.</summary>
    [JsiiClass(typeof(Mapping), "@aws-cdk/cdk.Mapping", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/cdk.MappingProps\"}}]")]
    public class Mapping : Referenceable
    {
        public Mapping(Construct parent, string name, IMappingProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Mapping(ByRefValue reference): base(reference)
        {
        }

        protected Mapping(DeputyProps props): base(props)
        {
        }

        /// <summary>Sets a value in the map based on the two keys.</summary>
        [JsiiMethod("setValue", null, "[{\"name\":\"key1\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"key2\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"value\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual void SetValue(string key1, string key2, object value)
        {
            InvokeInstanceVoidMethod(new object[]{key1, key2, value});
        }

        /// <returns>A reference to a value in the map based on the two keys.</returns>
        [JsiiMethod("findInMap", "{\"fqn\":\"@aws-cdk/cdk.FnFindInMap\"}", "[{\"name\":\"key1\",\"type\":{\"primitive\":\"any\"}},{\"name\":\"key2\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual FnFindInMap FindInMap(object key1, object key2)
        {
            return InvokeInstanceMethod<FnFindInMap>(new object[]{key1, key2});
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