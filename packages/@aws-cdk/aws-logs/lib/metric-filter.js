"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricFilter = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_cloudwatch_1 = require("@aws-cdk/aws-cloudwatch");
const core_1 = require("@aws-cdk/core");
const logs_generated_1 = require("./logs.generated");
/**
 * A filter that extracts information from CloudWatch Logs and emits to CloudWatch Metrics
 */
class MetricFilter extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_MetricFilterProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, MetricFilter);
            }
            throw error;
        }
        this.metricName = props.metricName;
        this.metricNamespace = props.metricNamespace;
        if (Object.keys(props.dimensions ?? {}).length > 3) {
            throw new Error('MetricFilter only supports a maximum of 3 Dimensions');
        }
        // It looks odd to map this object to a singleton list, but that's how
        // we're supposed to do it according to the docs.
        //
        // > Currently, you can specify only one metric transformation for
        // > each metric filter. If you want to specify multiple metric
        // > transformations, you must specify multiple metric filters.
        //
        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html
        new logs_generated_1.CfnMetricFilter(this, 'Resource', {
            logGroupName: props.logGroup.logGroupName,
            filterPattern: props.filterPattern.logPatternString,
            metricTransformations: [{
                    metricNamespace: props.metricNamespace,
                    metricName: props.metricName,
                    metricValue: props.metricValue ?? '1',
                    defaultValue: props.defaultValue,
                    dimensions: props.dimensions ? Object.entries(props.dimensions).map(([key, value]) => ({ key, value })) : undefined,
                    unit: props.unit,
                }],
        });
    }
    /**
     * Return the given named metric for this Metric Filter
     *
     * @default avg over 5 minutes
     */
    metric(props) {
        return new aws_cloudwatch_1.Metric({
            metricName: this.metricName,
            namespace: this.metricNamespace,
            statistic: 'avg',
            ...props,
        }).attachTo(this);
    }
}
exports.MetricFilter = MetricFilter;
_a = JSII_RTTI_SYMBOL_1;
MetricFilter[_a] = { fqn: "@aws-cdk/aws-logs.MetricFilter", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljLWZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1ldHJpYy1maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNERBQWdFO0FBQ2hFLHdDQUF5QztBQUd6QyxxREFBbUQ7QUFZbkQ7O0dBRUc7QUFDSCxNQUFhLFlBQWEsU0FBUSxlQUFRO0lBS3hDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQU5SLFlBQVk7Ozs7UUFRckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztRQUU3QyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2xELE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztTQUN6RTtRQUVELHNFQUFzRTtRQUN0RSxpREFBaUQ7UUFDakQsRUFBRTtRQUNGLGtFQUFrRTtRQUNsRSwrREFBK0Q7UUFDL0QsK0RBQStEO1FBQy9ELEVBQUU7UUFDRixxR0FBcUc7UUFDckcsSUFBSSxnQ0FBZSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDcEMsWUFBWSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWTtZQUN6QyxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0I7WUFDbkQscUJBQXFCLEVBQUUsQ0FBQztvQkFDdEIsZUFBZSxFQUFFLEtBQUssQ0FBQyxlQUFlO29CQUN0QyxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7b0JBQzVCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVyxJQUFJLEdBQUc7b0JBQ3JDLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtvQkFDaEMsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztvQkFDbkgsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO2lCQUNqQixDQUFDO1NBQ0gsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLEtBQXFCO1FBQ2pDLE9BQU8sSUFBSSx1QkFBTSxDQUFDO1lBQ2hCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWU7WUFDL0IsU0FBUyxFQUFFLEtBQUs7WUFDaEIsR0FBRyxLQUFLO1NBQ1QsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNuQjs7QUFqREgsb0NBa0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWV0cmljLCBNZXRyaWNPcHRpb25zIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUxvZ0dyb3VwLCBNZXRyaWNGaWx0ZXJPcHRpb25zIH0gZnJvbSAnLi9sb2ctZ3JvdXAnO1xuaW1wb3J0IHsgQ2ZuTWV0cmljRmlsdGVyIH0gZnJvbSAnLi9sb2dzLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBNZXRyaWNGaWx0ZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNZXRyaWNGaWx0ZXJQcm9wcyBleHRlbmRzIE1ldHJpY0ZpbHRlck9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGxvZyBncm91cCB0byBjcmVhdGUgdGhlIGZpbHRlciBvbi5cbiAgICovXG4gIHJlYWRvbmx5IGxvZ0dyb3VwOiBJTG9nR3JvdXA7XG59XG5cbi8qKlxuICogQSBmaWx0ZXIgdGhhdCBleHRyYWN0cyBpbmZvcm1hdGlvbiBmcm9tIENsb3VkV2F0Y2ggTG9ncyBhbmQgZW1pdHMgdG8gQ2xvdWRXYXRjaCBNZXRyaWNzXG4gKi9cbmV4cG9ydCBjbGFzcyBNZXRyaWNGaWx0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBtZXRyaWNOYW1lOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgbWV0cmljTmFtZXNwYWNlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE1ldHJpY0ZpbHRlclByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMubWV0cmljTmFtZSA9IHByb3BzLm1ldHJpY05hbWU7XG4gICAgdGhpcy5tZXRyaWNOYW1lc3BhY2UgPSBwcm9wcy5tZXRyaWNOYW1lc3BhY2U7XG5cbiAgICBpZiAoT2JqZWN0LmtleXMocHJvcHMuZGltZW5zaW9ucyA/PyB7fSkubGVuZ3RoID4gMykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNZXRyaWNGaWx0ZXIgb25seSBzdXBwb3J0cyBhIG1heGltdW0gb2YgMyBEaW1lbnNpb25zJyk7XG4gICAgfVxuXG4gICAgLy8gSXQgbG9va3Mgb2RkIHRvIG1hcCB0aGlzIG9iamVjdCB0byBhIHNpbmdsZXRvbiBsaXN0LCBidXQgdGhhdCdzIGhvd1xuICAgIC8vIHdlJ3JlIHN1cHBvc2VkIHRvIGRvIGl0IGFjY29yZGluZyB0byB0aGUgZG9jcy5cbiAgICAvL1xuICAgIC8vID4gQ3VycmVudGx5LCB5b3UgY2FuIHNwZWNpZnkgb25seSBvbmUgbWV0cmljIHRyYW5zZm9ybWF0aW9uIGZvclxuICAgIC8vID4gZWFjaCBtZXRyaWMgZmlsdGVyLiBJZiB5b3Ugd2FudCB0byBzcGVjaWZ5IG11bHRpcGxlIG1ldHJpY1xuICAgIC8vID4gdHJhbnNmb3JtYXRpb25zLCB5b3UgbXVzdCBzcGVjaWZ5IG11bHRpcGxlIG1ldHJpYyBmaWx0ZXJzLlxuICAgIC8vXG4gICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbWV0cmljZmlsdGVyLmh0bWxcbiAgICBuZXcgQ2ZuTWV0cmljRmlsdGVyKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGxvZ0dyb3VwTmFtZTogcHJvcHMubG9nR3JvdXAubG9nR3JvdXBOYW1lLFxuICAgICAgZmlsdGVyUGF0dGVybjogcHJvcHMuZmlsdGVyUGF0dGVybi5sb2dQYXR0ZXJuU3RyaW5nLFxuICAgICAgbWV0cmljVHJhbnNmb3JtYXRpb25zOiBbe1xuICAgICAgICBtZXRyaWNOYW1lc3BhY2U6IHByb3BzLm1ldHJpY05hbWVzcGFjZSxcbiAgICAgICAgbWV0cmljTmFtZTogcHJvcHMubWV0cmljTmFtZSxcbiAgICAgICAgbWV0cmljVmFsdWU6IHByb3BzLm1ldHJpY1ZhbHVlID8/ICcxJyxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBwcm9wcy5kZWZhdWx0VmFsdWUsXG4gICAgICAgIGRpbWVuc2lvbnM6IHByb3BzLmRpbWVuc2lvbnMgPyBPYmplY3QuZW50cmllcyhwcm9wcy5kaW1lbnNpb25zKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4gKHsga2V5LCB2YWx1ZSB9KSkgOiB1bmRlZmluZWQsXG4gICAgICAgIHVuaXQ6IHByb3BzLnVuaXQsXG4gICAgICB9XSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGdpdmVuIG5hbWVkIG1ldHJpYyBmb3IgdGhpcyBNZXRyaWMgRmlsdGVyXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZyBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpYyhwcm9wcz86IE1ldHJpY09wdGlvbnMpOiBNZXRyaWMge1xuICAgIHJldHVybiBuZXcgTWV0cmljKHtcbiAgICAgIG1ldHJpY05hbWU6IHRoaXMubWV0cmljTmFtZSxcbiAgICAgIG5hbWVzcGFjZTogdGhpcy5tZXRyaWNOYW1lc3BhY2UsXG4gICAgICBzdGF0aXN0aWM6ICdhdmcnLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSkuYXR0YWNoVG8odGhpcyk7XG4gIH1cbn1cbiJdfQ==