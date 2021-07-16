## Events

Many AWS resources emit events to the CloudWatch event bus. Such resources should
have a set of “onXxx” methods available on their construct interface
_[awslint:events-in-interface]_.

All “on” methods should have the following signature
[_awslint:events-method-signature_]:

```ts
onXxx(id: string, target: events.IEventRuleTarget, options?: XxxOptions): cloudwatch.EventRule;
```

When a resource emits CloudWatch events, it should at least have a single
generic **onEvent** method to allow users to specify the event name
[_awslint:events-generic_]:

```ts
onEvent(event: string, id: string, target: events.IEventRuleTarget): cloudwatch.EventRule
```