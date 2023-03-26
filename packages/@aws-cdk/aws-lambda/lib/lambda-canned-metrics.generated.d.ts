export declare class LambdaMetrics {
    static concurrentExecutionsMaximum(dimensions: {
        FunctionName: string;
    }): MetricWithDims<{
        FunctionName: string;
    }>;
    static concurrentExecutionsMaximum(dimensions: {
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        FunctionName: string;
        Resource: string;
    }>;
    static concurrentExecutionsMaximum(dimensions: {
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }>;
    static concurrentExecutionsMaximum(dimensions: {}): MetricWithDims<{}>;
    static deadLetterErrorsSum(dimensions: {
        FunctionName: string;
    }): MetricWithDims<{
        FunctionName: string;
    }>;
    static deadLetterErrorsSum(dimensions: {
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        FunctionName: string;
        Resource: string;
    }>;
    static deadLetterErrorsSum(dimensions: {
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }>;
    static deadLetterErrorsSum(dimensions: {}): MetricWithDims<{}>;
    static destinationDeliveryFailuresSum(dimensions: {
        FunctionName: string;
    }): MetricWithDims<{
        FunctionName: string;
    }>;
    static destinationDeliveryFailuresSum(dimensions: {
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        FunctionName: string;
        Resource: string;
    }>;
    static destinationDeliveryFailuresSum(dimensions: {
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }>;
    static destinationDeliveryFailuresSum(dimensions: {}): MetricWithDims<{}>;
    static durationAverage(dimensions: {
        FunctionName: string;
    }): MetricWithDims<{
        FunctionName: string;
    }>;
    static durationAverage(dimensions: {
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        FunctionName: string;
        Resource: string;
    }>;
    static durationAverage(dimensions: {
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }>;
    static durationAverage(dimensions: {}): MetricWithDims<{}>;
    static errorsSum(dimensions: {
        FunctionName: string;
    }): MetricWithDims<{
        FunctionName: string;
    }>;
    static errorsSum(dimensions: {
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        FunctionName: string;
        Resource: string;
    }>;
    static errorsSum(dimensions: {
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }>;
    static errorsSum(dimensions: {}): MetricWithDims<{}>;
    static invocationsSum(dimensions: {
        FunctionName: string;
    }): MetricWithDims<{
        FunctionName: string;
    }>;
    static invocationsSum(dimensions: {
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        FunctionName: string;
        Resource: string;
    }>;
    static invocationsSum(dimensions: {
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }>;
    static invocationsSum(dimensions: {}): MetricWithDims<{}>;
    static iteratorAgeAverage(dimensions: {
        FunctionName: string;
    }): MetricWithDims<{
        FunctionName: string;
    }>;
    static iteratorAgeAverage(dimensions: {
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        FunctionName: string;
        Resource: string;
    }>;
    static iteratorAgeAverage(dimensions: {
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }>;
    static iteratorAgeAverage(dimensions: {}): MetricWithDims<{}>;
    static postRuntimeExtensionsDurationAverage(dimensions: {
        FunctionName: string;
    }): MetricWithDims<{
        FunctionName: string;
    }>;
    static postRuntimeExtensionsDurationAverage(dimensions: {
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        FunctionName: string;
        Resource: string;
    }>;
    static postRuntimeExtensionsDurationAverage(dimensions: {
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }>;
    static postRuntimeExtensionsDurationAverage(dimensions: {}): MetricWithDims<{}>;
    static provisionedConcurrencyInvocationsSum(dimensions: {
        FunctionName: string;
    }): MetricWithDims<{
        FunctionName: string;
    }>;
    static provisionedConcurrencyInvocationsSum(dimensions: {
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        FunctionName: string;
        Resource: string;
    }>;
    static provisionedConcurrencyInvocationsSum(dimensions: {
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }>;
    static provisionedConcurrencyInvocationsSum(dimensions: {}): MetricWithDims<{}>;
    static provisionedConcurrencySpilloverInvocationsSum(dimensions: {
        FunctionName: string;
    }): MetricWithDims<{
        FunctionName: string;
    }>;
    static provisionedConcurrencySpilloverInvocationsSum(dimensions: {
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        FunctionName: string;
        Resource: string;
    }>;
    static provisionedConcurrencySpilloverInvocationsSum(dimensions: {
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }>;
    static provisionedConcurrencySpilloverInvocationsSum(dimensions: {}): MetricWithDims<{}>;
    static provisionedConcurrencyUtilizationMaximum(dimensions: {
        FunctionName: string;
    }): MetricWithDims<{
        FunctionName: string;
    }>;
    static provisionedConcurrencyUtilizationMaximum(dimensions: {
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        FunctionName: string;
        Resource: string;
    }>;
    static provisionedConcurrencyUtilizationMaximum(dimensions: {
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }>;
    static provisionedConcurrencyUtilizationMaximum(dimensions: {}): MetricWithDims<{}>;
    static provisionedConcurrentExecutionsMaximum(dimensions: {
        FunctionName: string;
    }): MetricWithDims<{
        FunctionName: string;
    }>;
    static provisionedConcurrentExecutionsMaximum(dimensions: {
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        FunctionName: string;
        Resource: string;
    }>;
    static provisionedConcurrentExecutionsMaximum(dimensions: {
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }>;
    static provisionedConcurrentExecutionsMaximum(dimensions: {}): MetricWithDims<{}>;
    static throttlesSum(dimensions: {
        FunctionName: string;
    }): MetricWithDims<{
        FunctionName: string;
    }>;
    static throttlesSum(dimensions: {
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        FunctionName: string;
        Resource: string;
    }>;
    static throttlesSum(dimensions: {
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }>;
    static throttlesSum(dimensions: {}): MetricWithDims<{}>;
    static unreservedConcurrentExecutionsMaximum(dimensions: {
        FunctionName: string;
    }): MetricWithDims<{
        FunctionName: string;
    }>;
    static unreservedConcurrentExecutionsMaximum(dimensions: {
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        FunctionName: string;
        Resource: string;
    }>;
    static unreservedConcurrentExecutionsMaximum(dimensions: {
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }): MetricWithDims<{
        ExecutedVersion: string;
        FunctionName: string;
        Resource: string;
    }>;
    static unreservedConcurrentExecutionsMaximum(dimensions: {}): MetricWithDims<{}>;
}
declare type MetricWithDims<D> = {
    namespace: string;
    metricName: string;
    statistic: string;
    dimensionsMap: D;
};
export {};
