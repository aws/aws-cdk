# Amazon CloudWatch RUM Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

Amazon CloudWatch RUM is a real-user monitoring service that collects client-side data about your web application performance from actual user sessions in real time. The data that RUM collects includes page load times, client-side errors, and user behavior.

## App Monitor

Create a RUM app monitor to start collecting real user monitoring data:

```ts
new rum.AppMonitor(this, 'MyAppMonitor', {
  appMonitorName: 'my-web-app',
  domain: 'example.com',
});
```

Configure the app monitor with additional options:

```ts
new rum.AppMonitor(this, 'MyAppMonitor', {
  appMonitorName: 'my-web-app',
  domain: 'example.com',
  cwLogEnabled: true,
  appMonitorConfiguration: {
    allowCookies: true,
    enableXRay: true,
    sessionSampleRate: 0.5,
  },
  customEvents: { enabled: true },
});
```

## CloudWatch Logs Integration

When CloudWatch Logs is enabled, you can access the log group for further processing:

```ts
const appMonitor = new rum.AppMonitor(this, 'MyAppMonitor', {
  appMonitorName: 'my-web-app',
  domain: 'example.com',
  cwLogEnabled: true,
});

// Access the log group
const logGroup = appMonitor.logGroup;
```
