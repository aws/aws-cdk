"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Metrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class S3Metrics {
    static bucketSizeBytesAverage(dimensions) {
        return {
            namespace: 'AWS/S3',
            metricName: 'BucketSizeBytes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static numberOfObjectsAverage(dimensions) {
        return {
            namespace: 'AWS/S3',
            metricName: 'NumberOfObjects',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.S3Metrics = S3Metrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiczMtY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrRUFBK0U7OztBQUUvRSw0QkFBNEIsQ0FBQyxpRUFBaUU7QUFFOUYsTUFBYSxTQUFTO0lBQ2IsTUFBTSxDQUFDLHNCQUFzQixDQUFDLFVBQXVEO1FBQzFGLE9BQU87WUFDTCxTQUFTLEVBQUUsUUFBUTtZQUNuQixVQUFVLEVBQUUsaUJBQWlCO1lBQzdCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxVQUF1RDtRQUMxRixPQUFPO1lBQ0wsU0FBUyxFQUFFLFFBQVE7WUFDbkIsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7Q0FDRjtBQWpCRCw4QkFpQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIFMzTWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMgYnVja2V0U2l6ZUJ5dGVzQXZlcmFnZShkaW1lbnNpb25zOiB7IEJ1Y2tldE5hbWU6IHN0cmluZywgU3RvcmFnZVR5cGU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9TMycsXG4gICAgICBtZXRyaWNOYW1lOiAnQnVja2V0U2l6ZUJ5dGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbnVtYmVyT2ZPYmplY3RzQXZlcmFnZShkaW1lbnNpb25zOiB7IEJ1Y2tldE5hbWU6IHN0cmluZywgU3RvcmFnZVR5cGU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9TMycsXG4gICAgICBtZXRyaWNOYW1lOiAnTnVtYmVyT2ZPYmplY3RzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG59XG4iXX0=