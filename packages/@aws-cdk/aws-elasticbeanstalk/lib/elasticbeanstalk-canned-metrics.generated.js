"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticBeanstalkMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class ElasticBeanstalkMetrics {
    static environmentHealthAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticBeanstalk',
            metricName: 'EnvironmentHealth',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static applicationRequests5XxAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticBeanstalk',
            metricName: 'ApplicationRequests5xx',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static applicationRequests2XxAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticBeanstalk',
            metricName: 'ApplicationRequests2xx',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static applicationRequests3XxAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticBeanstalk',
            metricName: 'ApplicationRequests3xx',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static applicationRequests4XxAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticBeanstalk',
            metricName: 'ApplicationRequests4xx',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.ElasticBeanstalkMetrics = ElasticBeanstalkMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpY2JlYW5zdGFsay1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbGFzdGljYmVhbnN0YWxrLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFOzs7QUFFL0UsNEJBQTRCLENBQUMsaUVBQWlFO0FBRTlGLE1BQWEsdUJBQXVCO0lBQzNCLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxVQUF1QztRQUM1RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLHNCQUFzQjtZQUNqQyxVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxVQUF1QztRQUNqRixPQUFPO1lBQ0wsU0FBUyxFQUFFLHNCQUFzQjtZQUNqQyxVQUFVLEVBQUUsd0JBQXdCO1lBQ3BDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxVQUF1QztRQUNqRixPQUFPO1lBQ0wsU0FBUyxFQUFFLHNCQUFzQjtZQUNqQyxVQUFVLEVBQUUsd0JBQXdCO1lBQ3BDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxVQUF1QztRQUNqRixPQUFPO1lBQ0wsU0FBUyxFQUFFLHNCQUFzQjtZQUNqQyxVQUFVLEVBQUUsd0JBQXdCO1lBQ3BDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxVQUF1QztRQUNqRixPQUFPO1lBQ0wsU0FBUyxFQUFFLHNCQUFzQjtZQUNqQyxVQUFVLEVBQUUsd0JBQXdCO1lBQ3BDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtDQUNGO0FBekNELDBEQXlDQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5leHBvcnQgY2xhc3MgRWxhc3RpY0JlYW5zdGFsa01ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIGVudmlyb25tZW50SGVhbHRoQXZlcmFnZShkaW1lbnNpb25zOiB7IEVudmlyb25tZW50TmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNCZWFuc3RhbGsnLFxuICAgICAgbWV0cmljTmFtZTogJ0Vudmlyb25tZW50SGVhbHRoJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgYXBwbGljYXRpb25SZXF1ZXN0czVYeEF2ZXJhZ2UoZGltZW5zaW9uczogeyBFbnZpcm9ubWVudE5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljQmVhbnN0YWxrJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBcHBsaWNhdGlvblJlcXVlc3RzNXh4JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgYXBwbGljYXRpb25SZXF1ZXN0czJYeEF2ZXJhZ2UoZGltZW5zaW9uczogeyBFbnZpcm9ubWVudE5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljQmVhbnN0YWxrJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBcHBsaWNhdGlvblJlcXVlc3RzMnh4JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgYXBwbGljYXRpb25SZXF1ZXN0czNYeEF2ZXJhZ2UoZGltZW5zaW9uczogeyBFbnZpcm9ubWVudE5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljQmVhbnN0YWxrJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBcHBsaWNhdGlvblJlcXVlc3RzM3h4JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgYXBwbGljYXRpb25SZXF1ZXN0czRYeEF2ZXJhZ2UoZGltZW5zaW9uczogeyBFbnZpcm9ubWVudE5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljQmVhbnN0YWxrJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBcHBsaWNhdGlvblJlcXVlc3RzNHh4JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG59XG4iXX0=