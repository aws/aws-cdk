using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK
{
    /// <summary>
    /// A collection of the fields in a PolicyStatement that can be used to identify a principal.
    /// 
    /// This consists of the JSON used in the "Principal" field, and optionally a
    /// set of "Condition"s that need to be applied to the policy.
    /// </summary>
    [JsiiClass(typeof(PrincipalPolicyFragment), "@aws-cdk/cdk.PrincipalPolicyFragment", "[{\"name\":\"principalJson\",\"type\":{\"primitive\":\"any\"}},{\"name\":\"conditions\",\"type\":{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}},\"optional\":true}}]")]
    public class PrincipalPolicyFragment : DeputyBase
    {
        public PrincipalPolicyFragment(object principalJson, IDictionary<string, object> conditions): base(new DeputyProps(new object[]{principalJson, conditions}))
        {
        }

        protected PrincipalPolicyFragment(ByRefValue reference): base(reference)
        {
        }

        protected PrincipalPolicyFragment(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("principalJson", "{\"primitive\":\"any\"}")]
        public virtual object PrincipalJson
        {
            get => GetInstanceProperty<object>();
        }

        [JsiiProperty("conditions", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}")]
        public virtual IDictionary<string, object> Conditions
        {
            get => GetInstanceProperty<IDictionary<string, object>>();
        }
    }
}