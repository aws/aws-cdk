"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class CognitoMetrics {
    static noRiskSum(dimensions) {
        return {
            namespace: 'AWS/Cognito',
            metricName: 'NoRisk',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static riskSum(dimensions) {
        return {
            namespace: 'AWS/Cognito',
            metricName: 'Risk',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.CognitoMetrics = CognitoMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb2duaXRvLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFOzs7QUFFL0UsNEJBQTRCLENBQUMsaUVBQWlFO0FBRTlGLE1BQWEsY0FBYztJQUNsQixNQUFNLENBQUMsU0FBUyxDQUFDLFVBQXFEO1FBQzNFLE9BQU87WUFDTCxTQUFTLEVBQUUsYUFBYTtZQUN4QixVQUFVLEVBQUUsUUFBUTtZQUNwQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQXFEO1FBQ3pFLE9BQU87WUFDTCxTQUFTLEVBQUUsYUFBYTtZQUN4QixVQUFVLEVBQUUsTUFBTTtZQUNsQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7Q0FDRjtBQWpCRCx3Q0FpQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIENvZ25pdG9NZXRyaWNzIHtcbiAgcHVibGljIHN0YXRpYyBub1Jpc2tTdW0oZGltZW5zaW9uczogeyBPcGVyYXRpb246IHN0cmluZywgVXNlclBvb2xJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0NvZ25pdG8nLFxuICAgICAgbWV0cmljTmFtZTogJ05vUmlzaycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcmlza1N1bShkaW1lbnNpb25zOiB7IE9wZXJhdGlvbjogc3RyaW5nLCBVc2VyUG9vbElkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQ29nbml0bycsXG4gICAgICBtZXRyaWNOYW1lOiAnUmlzaycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG59XG4iXX0=