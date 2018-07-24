using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Events
{
    /// <summary>
    /// Specifies settings that provide custom input to an Amazon CloudWatch Events
    /// rule target based on certain event data.
    /// </summary>
    /// <remarks>see: https://docs.aws.amazon.com/AmazonCloudWatchEvents/latest/APIReference/API_InputTransformer.html</remarks>
    [JsiiInterfaceProxy(typeof(ITargetInputTemplate), "@aws-cdk/aws-events.TargetInputTemplate")]
    internal class TargetInputTemplateProxy : DeputyBase, ITargetInputTemplate
    {
        private TargetInputTemplateProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// Input template where you can use the values of the keys from
        /// inputPathsMap to customize the data sent to the target. Enclose each
        /// InputPathsMaps value in brackets: &lt;value&gt;
        /// 
        /// The value passed here will be double-quoted to indicate it's a string value.
        /// This option is mutually exclusive with `jsonTemplate`.
        /// </summary>
        /// <remarks>
        /// example: {
        ///    textTemplate: 'Build &lt;buildid&gt; started',
        ///    pathsMap: {
        ///      buildid: '$.detail.id'
        ///    }
        /// }
        /// </remarks>
        [JsiiProperty("textTemplate", "{\"primitive\":\"any\",\"optional\":true}")]
        public virtual object TextTemplate
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Input template where you can use the values of the keys from
        /// inputPathsMap to customize the data sent to the target. Enclose each
        /// InputPathsMaps value in brackets: &lt;value&gt;
        /// 
        /// This option is mutually exclusive with `textTemplate`.
        /// </summary>
        /// <remarks>
        /// example: {
        ///    jsonTemplate: '{ "commands": &lt;commandsToRun&gt; }' ,
        ///    pathsMap: {
        ///      commandsToRun: '$.detail.commands'
        ///    }
        /// }
        /// </remarks>
        [JsiiProperty("jsonTemplate", "{\"primitive\":\"any\",\"optional\":true}")]
        public virtual object JsonTemplate
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Map of JSON paths to be extracted from the event. These are key-value
        /// pairs, where each value is a JSON path. You must use JSON dot notation,
        /// not bracket notation.
        /// </summary>
        [JsiiProperty("pathsMap", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"string\"}},\"optional\":true}")]
        public virtual IDictionary<string, string> PathsMap
        {
            get => GetInstanceProperty<IDictionary<string, string>>();
            set => SetInstanceProperty(value);
        }
    }
}