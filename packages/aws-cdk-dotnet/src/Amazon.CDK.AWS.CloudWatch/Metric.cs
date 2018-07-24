using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>
    /// A metric emitted by a service
    /// 
    /// The metric is a combination of a metric identifier (namespace, name and dimensions)
    /// and an aggregation function (statistic, period and unit).
    /// 
    /// It also contains metadata which is used only in graphs, such as color and label.
    /// It makes sense to embed this in here, so that compound constructs can attach
    /// that metadata to metrics they expose.
    /// 
    /// This class does not represent a resource, so hence is not a construct. Instead,
    /// Metric is an abstraction that makes it easy to specify metrics for use in both
    /// alarms and graphs.
    /// </summary>
    [JsiiClass(typeof(Metric), "@aws-cdk/aws-cloudwatch.Metric", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricProps\"}}]")]
    public class Metric : DeputyBase
    {
        public Metric(IMetricProps props): base(new DeputyProps(new object[]{props}))
        {
        }

        protected Metric(ByRefValue reference): base(reference)
        {
        }

        protected Metric(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("dimensions", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}},\"optional\":true}")]
        public virtual IDictionary<string, object> Dimensions
        {
            get => GetInstanceProperty<IDictionary<string, object>>();
        }

        [JsiiProperty("namespace", "{\"primitive\":\"string\"}")]
        public virtual string Namespace
        {
            get => GetInstanceProperty<string>();
        }

        [JsiiProperty("metricName", "{\"primitive\":\"string\"}")]
        public virtual string MetricName
        {
            get => GetInstanceProperty<string>();
        }

        [JsiiProperty("periodSec", "{\"primitive\":\"number\"}")]
        public virtual double PeriodSec
        {
            get => GetInstanceProperty<double>();
        }

        [JsiiProperty("statistic", "{\"primitive\":\"string\"}")]
        public virtual string Statistic
        {
            get => GetInstanceProperty<string>();
        }

        [JsiiProperty("unit", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Unit\",\"optional\":true}")]
        public virtual Unit Unit
        {
            get => GetInstanceProperty<Unit>();
        }

        [JsiiProperty("label", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Label
        {
            get => GetInstanceProperty<string>();
        }

        [JsiiProperty("color", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Color
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>Grant permissions to the given identity to write metrics.</summary>
        /// <param name = "identity">The IAM identity to give permissions to.</param>
        [JsiiMethod("grantPutMetricData", null, "[{\"name\":\"identity\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.IIdentityResource\",\"optional\":true}}]")]
        public static void GrantPutMetricData(IIIdentityResource identity)
        {
            InvokeStaticVoidMethod(typeof(Metric), new object[]{identity});
        }

        /// <summary>
        /// Return a copy of Metric with properties changed.
        /// 
        /// All properties except namespace and metricName can be changed.
        /// </summary>
        /// <param name = "props">The set of properties to change.</param>
        [JsiiMethod("with", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\"}}]")]
        public virtual Metric With(IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{props});
        }

        /// <summary>
        /// Make a new Alarm for this metric
        /// 
        /// Combines both properties that may adjust the metric (aggregation) as well
        /// as alarm properties.
        /// </summary>
        [JsiiMethod("newAlarm", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Alarm\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.NewAlarmProps\"}}]")]
        public virtual Alarm NewAlarm(Construct parent, string name, INewAlarmProps props)
        {
            return InvokeInstanceMethod<Alarm>(new object[]{parent, name, props});
        }

        /// <summary>Return the dimensions of this Metric as a list of Dimension.</summary>
        [JsiiMethod("dimensionsAsList", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.Dimension\"}}}", "[]")]
        public virtual IDimension[] DimensionsAsList()
        {
            return InvokeInstanceMethod<IDimension[]>(new object[]{});
        }
    }
}