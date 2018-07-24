using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace Amazon.CDK
{
    /// <summary>Represents a CloudFormation resource.</summary>
    [JsiiClass(typeof(Resource), "@aws-cdk/cdk.Resource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/cdk.ResourceProps\"}}]")]
    public class Resource : Referenceable
    {
        public Resource(Construct parent, string name, IResourceProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Resource(ByRefValue reference): base(reference)
        {
        }

        protected Resource(DeputyProps props): base(props)
        {
        }

        /// <summary>Options for this resource, such as condition, update policy etc.</summary>
        [JsiiProperty("options", "{\"fqn\":\"@aws-cdk/cdk.ResourceOptions\"}")]
        public virtual IResourceOptions Options
        {
            get => GetInstanceProperty<IResourceOptions>();
        }

        /// <summary>AWS resource type.</summary>
        [JsiiProperty("resourceType", "{\"primitive\":\"string\"}")]
        public virtual string ResourceType
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>AWS resource properties</summary>
        [JsiiProperty("properties", "{\"primitive\":\"any\"}")]
        protected virtual object Properties
        {
            get => GetInstanceProperty<object>();
        }

        /// <summary>A decoration used to create a CloudFormation attribute property.</summary>
        /// <param name = "customName">
        /// Custom name for the attribute (default is the name of the property)
        /// NOTE: we return "any" here to satistfy jsii, which doesn't support lambdas.
        /// </param>
        [JsiiMethod("attribute", "{\"primitive\":\"any\"}", "[{\"name\":\"customName\",\"type\":{\"primitive\":\"string\",\"optional\":true}}]")]
        public static object Attribute(string customName)
        {
            return InvokeStaticMethod<object>(typeof(Resource), new object[]{customName});
        }

        /// <summary>
        /// Returns a token for an runtime attribute of this resource.
        /// Ideally, use generated attribute accessors (e.g. `resource.arn`), but this can be used for future compatibility
        /// in case there is no generated attribute.
        /// </summary>
        /// <param name = "attributeName">The name of the attribute.</param>
        [JsiiMethod("getAtt", "{\"fqn\":\"@aws-cdk/cdk.Token\"}", "[{\"name\":\"attributeName\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual Token GetAtt(string attributeName)
        {
            return InvokeInstanceMethod<Token>(new object[]{attributeName});
        }

        /// <summary>Adds a dependency on another resource.</summary>
        /// <param name = "other">The other resource.</param>
        [JsiiMethod("addDependency", null, "[{\"name\":\"other\",\"type\":{\"fqn\":\"@aws-cdk/cdk.IDependable\"}}]")]
        public virtual void AddDependency(IIDependable other)
        {
            InvokeInstanceVoidMethod(new object[]{other});
        }

        /// <summary>Emits CloudFormation for this resource.</summary>
        [JsiiMethod("toCloudFormation", "{\"primitive\":\"json\"}", "[]")]
        public override JObject ToCloudFormation()
        {
            return InvokeInstanceMethod<JObject>(new object[]{});
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected virtual IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}