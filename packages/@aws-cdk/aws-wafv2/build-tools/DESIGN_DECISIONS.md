Interesting Design Decisions
============================

- Targets: targets are controlled by WebAclAssociations, but are tied to 'scope'.
  - Limitations:
    - CloudFront requires scope=GLOBAL, must be deployed in us-east-1, and excludes non-CloudFront targets
    - All other targets require scope=REGIONAL, and exclude CloudFront targets
  - Decision:
    - Integration classes for the targets
    - Scope can be implicit based on the target (but can also be explicit in case the integrations
      are added later, with an `add`er).

- Properties: flattening many deeply nested structs as per our style guide.

- Aggressive defaulting of values
  - CloudWatchMetricsEnabled -> default to true (because why not, it's free and good practice)
  - SampledRequestsEnabled -> default to false (probably costs money)
  - MetricName -> this is ill-named. It is not a "metric name", it's a "dimension value", and in
    particular the value used for the dimension "Rule" when the default action is performed. The WAFv2
    documentation is extremely unclear on this value and it took me 2 hours and communicating with
    the doc writer to figure out what this does. Renamed to "cloudWatchDefaultDimension", picked a
    default value of "DefaultAction".
