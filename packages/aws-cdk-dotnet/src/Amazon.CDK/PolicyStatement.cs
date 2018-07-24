using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK
{
    /// <summary>Represents a statement in an IAM policy document.</summary>
    [JsiiClass(typeof(PolicyStatement), "@aws-cdk/cdk.PolicyStatement", "[{\"name\":\"effect\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatementEffect\",\"optional\":true}}]")]
    public class PolicyStatement : Token
    {
        public PolicyStatement(PolicyStatementEffect effect): base(new DeputyProps(new object[]{effect}))
        {
        }

        protected PolicyStatement(ByRefValue reference): base(reference)
        {
        }

        protected PolicyStatement(DeputyProps props): base(props)
        {
        }

        /// <summary>Indicates if this permission has a "Principal" section.</summary>
        [JsiiProperty("hasPrincipal", "{\"primitive\":\"boolean\"}")]
        public virtual bool HasPrincipal
        {
            get => GetInstanceProperty<bool>();
        }

        /// <summary>Indicates if this permission as at least one resource associated with it.</summary>
        [JsiiProperty("hasResource", "{\"primitive\":\"boolean\"}")]
        public virtual bool HasResource
        {
            get => GetInstanceProperty<bool>();
        }

        /// <summary>Indicates if this permission has only a ``"*"`` resource associated with it.</summary>
        [JsiiProperty("isOnlyStarResource", "{\"primitive\":\"boolean\"}")]
        public virtual bool IsOnlyStarResource
        {
            get => GetInstanceProperty<bool>();
        }

        [JsiiMethod("addAction", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[{\"name\":\"action\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual PolicyStatement AddAction(string action)
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{action});
        }

        [JsiiMethod("addActions", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[{\"name\":\"actions\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual PolicyStatement AddActions(string actions)
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{actions});
        }

        [JsiiMethod("addPrincipal", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[{\"name\":\"principal\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyPrincipal\"}}]")]
        public virtual PolicyStatement AddPrincipal(PolicyPrincipal principal)
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{principal});
        }

        [JsiiMethod("addAwsPrincipal", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[{\"name\":\"arn\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual PolicyStatement AddAwsPrincipal(object arn)
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{arn});
        }

        [JsiiMethod("addAwsAccountPrincipal", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[{\"name\":\"accountId\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual PolicyStatement AddAwsAccountPrincipal(object accountId)
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{accountId});
        }

        [JsiiMethod("addServicePrincipal", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[{\"name\":\"service\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual PolicyStatement AddServicePrincipal(object service)
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{service});
        }

        [JsiiMethod("addFederatedPrincipal", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[{\"name\":\"federated\",\"type\":{\"primitive\":\"any\"}},{\"name\":\"conditions\",\"type\":{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}}]")]
        public virtual PolicyStatement AddFederatedPrincipal(object federated, IDictionary<string, object> conditions)
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{federated, conditions});
        }

        [JsiiMethod("addAccountRootPrincipal", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[]")]
        public virtual PolicyStatement AddAccountRootPrincipal()
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{});
        }

        [JsiiMethod("addResource", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[{\"name\":\"resource\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual PolicyStatement AddResource(object resource)
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{resource});
        }

        /// <summary>Adds a ``"*"`` resource to this statement.</summary>
        [JsiiMethod("addAllResources", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[]")]
        public virtual PolicyStatement AddAllResources()
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{});
        }

        [JsiiMethod("addResources", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[{\"name\":\"resources\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual PolicyStatement AddResources(object resources)
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{resources});
        }

        [JsiiMethod("describe", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[{\"name\":\"sid\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual PolicyStatement Describe(object sid)
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{sid});
        }

        /// <summary>Sets the permission effect to deny access to resources.</summary>
        [JsiiMethod("allow", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[]")]
        public virtual PolicyStatement Allow()
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{});
        }

        /// <summary>Sets the permission effect to allow access to resources.</summary>
        [JsiiMethod("deny", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[]")]
        public virtual PolicyStatement Deny()
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{});
        }

        /// <summary>Add a condition to the Policy</summary>
        [JsiiMethod("addCondition", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[{\"name\":\"key\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"value\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual PolicyStatement AddCondition(string key, object value)
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{key, value});
        }

        /// <summary>Add multiple conditions to the Policy</summary>
        [JsiiMethod("addConditions", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[{\"name\":\"conditions\",\"type\":{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}}]")]
        public virtual PolicyStatement AddConditions(IDictionary<string, object> conditions)
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{conditions});
        }

        /// <summary>Add a condition to the Policy.</summary>
        /// <remarks>deprecated: For backwards compatibility. Use addCondition() instead.</remarks>
        [JsiiMethod("setCondition", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[{\"name\":\"key\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"value\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual PolicyStatement SetCondition(string key, object value)
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{key, value});
        }

        [JsiiMethod("limitToAccount", "{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}", "[{\"name\":\"accountId\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual PolicyStatement LimitToAccount(object accountId)
        {
            return InvokeInstanceMethod<PolicyStatement>(new object[]{accountId});
        }

        [JsiiMethod("resolve", "{\"primitive\":\"any\"}", "[]")]
        public override object Resolve()
        {
            return InvokeInstanceMethod<object>(new object[]{});
        }

        [JsiiMethod("toJson", "{\"primitive\":\"any\"}", "[]")]
        public virtual object ToJson()
        {
            return InvokeInstanceMethod<object>(new object[]{});
        }
    }
}