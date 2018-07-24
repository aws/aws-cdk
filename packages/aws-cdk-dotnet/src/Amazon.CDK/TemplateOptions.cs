using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK
{
    /// <summary>CloudFormation template options for a stack.</summary>
    public class TemplateOptions : DeputyBase, ITemplateOptions
    {
        /// <summary>
        /// Gets or sets the description of this stack.
        /// If provided, it will be included in the CloudFormation template's "Description" attribute.
        /// </summary>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Description
        {
            get;
            set;
        }

        /// <summary>Gets or sets the AWSTemplateFormatVersion field of the CloudFormation template.</summary>
        [JsiiProperty("templateFormatVersion", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string TemplateFormatVersion
        {
            get;
            set;
        }

        /// <summary>Gets or sets the top-level template transform for this stack (e.g. "AWS::Serverless-2016-10-31").</summary>
        [JsiiProperty("transform", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Transform
        {
            get;
            set;
        }

        /// <summary>Metadata associated with the CloudFormation template.</summary>
        [JsiiProperty("metadata", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}},\"optional\":true}", true)]
        public IDictionary<string, object> Metadata
        {
            get;
            set;
        }
    }
}