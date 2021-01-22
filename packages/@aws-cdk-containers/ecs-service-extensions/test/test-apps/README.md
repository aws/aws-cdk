The test applications in this folder are useful for integration
testing observability. They can be used to deploy a simple
microservice deployment with three services:

- `greeter` (Constructs a greeting phrase like "Hello Nathan")
  - `greeting` (Returns a random prefix for the greeting phrase like "Hi" or "Hello")
  - `name` (Returns a random name to greet)

The services are designed to be very configurable via environment
variables:

- `PORT = '80'` - The port that the application should be listening for
  traffic on
- `GREETING_URL = 'greeting.internal'` - The `greeter` application needs to know the URL to reach the `greeting` service
- `NAME_URL = 'name.internal'` - The `greeter` application needs to know the URL of the name service
- `TEST_DATADOG = 'true'` - Turn on Datadog APM tracing
- `TEST_NEWRELIC = 'true'` - Turn on New Relic APM tracing
- `TEST_XRAY = 'true'` - Turn on AWS X-Ray APM tracing