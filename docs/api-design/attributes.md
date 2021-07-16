## Attributes

Every AWS resource has a set of "physical" runtime attributes such as ARN,
physical names, URLs, etc. These attributes are commonly late-bound, which means
they can only be resolved during deployment, when AWS CloudFormation actually
provisions the resource.

AWS constructs must expose all resource attributes defined in the underlying
CloudFormation resource as readonly properties of the class
_[awslint:resource-attribute]_.

All properties that represent resource attributes must include the JSDoc tag
**@attribute** _[awslint:attribute-tag]_.

All attribute names must begin with the type name as a prefix
(e.g. ***bucket*Arn** instead of just **arn**) _[awslint:attribute-name]_. This
implies that if a property begins with the type name, it must have an
**@attribute** tag.

All resource attributes must be represented as readonly properties of the
resource interface _[awslint:attribute-readonly]_.

Resource attributes should use a type that corresponds to the resolved AWS
CloudFormation type (e.g. **string**, **string[]**) _[awslint:attribute-type]_.

> Resource attributes almost always represent string values (URL, ARN,
  name). Sometimes they might also represent a list of strings. Since attribute
  values can either be late-bound ("a promise to a string") or concrete ("a
  string"), the AWS CDK has a mechanism called "tokens" which allows codifying
  late-bound values into strings or string arrays. This approach was chosen in
  order to dramatically simplify the type-system and ergonomics of CDK code. As
  long as users treat these attributes as opaque values (e.g. not try to parse
  them or manipulate them), they can be used interchangeably.

If needed, you can query whether an object includes unresolved tokens by using
the **Token.unresolved(x)** method.

To ensure users are aware that the value returned by attribute properties should
be treated as an opaque token, the JSDoc “@returns” annotation should begin with
“**@returns a $token representing the xxxxx**”
[_awslint:attribute-doc-returns-token_].