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
  - MetricName -> metric dimension value gets emitted when the default action is performed, default value of "DefaultAction"

- Poor naming
  - MetricName -> this is ill-named. It is not a "metric name", it's a "dimension value", and in
    particular the value used for the dimension "Rule" when the default action is performed. The WAFv2
    documentation is extremely unclear on this value and it took me 2 hours and communicating with
    the doc writer to figure out what this does. Renamed to "cloudWatchDefaultDimension", picked a
    default value of "DefaultAction".

- Unnecessary information separation
  - Custom response bodies reference a body by key in a resource-wide lookup table. This requires setting a custom response in two places:
    - First, put the response in the table, pick a unique key
    - Second, reference the response by key in a Rule Action.
  - Add a case class that contains the entire response for use in a Rule Action, transparently invent a key and split the body off to the lookup table.


- Rules are in an array and all have a `priority` field. If not given, we can derive the priority field from the array order.