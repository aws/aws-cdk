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
_a = JSII_RTTI_SYMBOL_1;
MetricFilter[_a] = { fqn: "@aws-cdk/aws-logs.MetricFilter", version: "0.0.0" };
exports.MetricFilter = MetricFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljLWZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1ldHJpYy1maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNERBQWdFO0FBQ2hFLHdDQUF5QztBQUd6QyxxREFBbUQ7QUFZbkQ7O0dBRUc7QUFDSCxNQUFhLFlBQWEsU0FBUSxlQUFRO0lBS3hDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQU5SLFlBQVk7Ozs7UUFRckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztRQUU3QyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2xELE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztTQUN6RTtRQUVELHNFQUFzRTtRQUN0RSxpREFBaUQ7UUFDakQsRUFBRTtRQUNGLGtFQUFrRTtRQUNsRSwrREFBK0Q7UUFDL0QsK0RBQStEO1FBQy9ELEVBQUU7UUFDRixxR0FBcUc7UUFDckcsSUFBSSxnQ0FBZSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDcEMsWUFBWSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWTtZQUN6QyxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0I7WUFDbkQscUJBQXFCLEVBQUUsQ0FBQztvQkFDdEIsZUFBZSxFQUFFLEtBQUssQ0FBQyxlQUFlO29CQUN0QyxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7b0JBQzVCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVyxJQUFJLEdBQUc7b0JBQ3JDLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtvQkFDaEMsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztvQkFDbkgsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO2lCQUNqQixDQUFDO1NBQ0gsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLEtBQXFCO1FBQ2pDLE9BQU8sSUFBSSx1QkFBTSxDQUFDO1lBQ2hCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWU7WUFDL0IsU0FBUyxFQUFFLEtBQUs7WUFDaEIsR0FBRyxLQUFLO1NBQ1QsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNuQjs7OztBQWpEVSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1ldHJpYywgTWV0cmljT3B0aW9ucyB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZHdhdGNoJztcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElMb2dHcm91cCwgTWV0cmljRmlsdGVyT3B0aW9ucyB9IGZyb20gJy4vbG9nLWdyb3VwJztcbmltcG9ydCB7IENmbk1ldHJpY0ZpbHRlciB9IGZyb20gJy4vbG9ncy5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgTWV0cmljRmlsdGVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWV0cmljRmlsdGVyUHJvcHMgZXh0ZW5kcyBNZXRyaWNGaWx0ZXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBsb2cgZ3JvdXAgdG8gY3JlYXRlIHRoZSBmaWx0ZXIgb24uXG4gICAqL1xuICByZWFkb25seSBsb2dHcm91cDogSUxvZ0dyb3VwO1xufVxuXG4vKipcbiAqIEEgZmlsdGVyIHRoYXQgZXh0cmFjdHMgaW5mb3JtYXRpb24gZnJvbSBDbG91ZFdhdGNoIExvZ3MgYW5kIGVtaXRzIHRvIENsb3VkV2F0Y2ggTWV0cmljc1xuICovXG5leHBvcnQgY2xhc3MgTWV0cmljRmlsdGVyIGV4dGVuZHMgUmVzb3VyY2Uge1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgbWV0cmljTmFtZTogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IG1ldHJpY05hbWVzcGFjZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBNZXRyaWNGaWx0ZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLm1ldHJpY05hbWUgPSBwcm9wcy5tZXRyaWNOYW1lO1xuICAgIHRoaXMubWV0cmljTmFtZXNwYWNlID0gcHJvcHMubWV0cmljTmFtZXNwYWNlO1xuXG4gICAgaWYgKE9iamVjdC5rZXlzKHByb3BzLmRpbWVuc2lvbnMgPz8ge30pLmxlbmd0aCA+IDMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWV0cmljRmlsdGVyIG9ubHkgc3VwcG9ydHMgYSBtYXhpbXVtIG9mIDMgRGltZW5zaW9ucycpO1xuICAgIH1cblxuICAgIC8vIEl0IGxvb2tzIG9kZCB0byBtYXAgdGhpcyBvYmplY3QgdG8gYSBzaW5nbGV0b24gbGlzdCwgYnV0IHRoYXQncyBob3dcbiAgICAvLyB3ZSdyZSBzdXBwb3NlZCB0byBkbyBpdCBhY2NvcmRpbmcgdG8gdGhlIGRvY3MuXG4gICAgLy9cbiAgICAvLyA+IEN1cnJlbnRseSwgeW91IGNhbiBzcGVjaWZ5IG9ubHkgb25lIG1ldHJpYyB0cmFuc2Zvcm1hdGlvbiBmb3JcbiAgICAvLyA+IGVhY2ggbWV0cmljIGZpbHRlci4gSWYgeW91IHdhbnQgdG8gc3BlY2lmeSBtdWx0aXBsZSBtZXRyaWNcbiAgICAvLyA+IHRyYW5zZm9ybWF0aW9ucywgeW91IG11c3Qgc3BlY2lmeSBtdWx0aXBsZSBtZXRyaWMgZmlsdGVycy5cbiAgICAvL1xuICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1sb2dzLW1ldHJpY2ZpbHRlci5odG1sXG4gICAgbmV3IENmbk1ldHJpY0ZpbHRlcih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBsb2dHcm91cE5hbWU6IHByb3BzLmxvZ0dyb3VwLmxvZ0dyb3VwTmFtZSxcbiAgICAgIGZpbHRlclBhdHRlcm46IHByb3BzLmZpbHRlclBhdHRlcm4ubG9nUGF0dGVyblN0cmluZyxcbiAgICAgIG1ldHJpY1RyYW5zZm9ybWF0aW9uczogW3tcbiAgICAgICAgbWV0cmljTmFtZXNwYWNlOiBwcm9wcy5tZXRyaWNOYW1lc3BhY2UsXG4gICAgICAgIG1ldHJpY05hbWU6IHByb3BzLm1ldHJpY05hbWUsXG4gICAgICAgIG1ldHJpY1ZhbHVlOiBwcm9wcy5tZXRyaWNWYWx1ZSA/PyAnMScsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogcHJvcHMuZGVmYXVsdFZhbHVlLFxuICAgICAgICBkaW1lbnNpb25zOiBwcm9wcy5kaW1lbnNpb25zID8gT2JqZWN0LmVudHJpZXMocHJvcHMuZGltZW5zaW9ucykubWFwKChba2V5LCB2YWx1ZV0pID0+ICh7IGtleSwgdmFsdWUgfSkpIDogdW5kZWZpbmVkLFxuICAgICAgICB1bml0OiBwcm9wcy51bml0LFxuICAgICAgfV0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBnaXZlbiBuYW1lZCBtZXRyaWMgZm9yIHRoaXMgTWV0cmljIEZpbHRlclxuICAgKlxuICAgKiBAZGVmYXVsdCBhdmcgb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWMocHJvcHM/OiBNZXRyaWNPcHRpb25zKTogTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IE1ldHJpYyh7XG4gICAgICBtZXRyaWNOYW1lOiB0aGlzLm1ldHJpY05hbWUsXG4gICAgICBuYW1lc3BhY2U6IHRoaXMubWV0cmljTmFtZXNwYWNlLFxuICAgICAgc3RhdGlzdGljOiAnYXZnJyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pLmF0dGFjaFRvKHRoaXMpO1xuICB9XG59XG4iXX0=