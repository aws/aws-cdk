"use strict";

// packages/@aws-cdk-testing/framework-integ/test/aws-appsync/test/integ-assets/eventapi-integrations/lambda-ds/index.js
exports.handler = async function(event) {
  return event.events.map((e) => ({
    id: e.id,
    payload: {
      ...e.payload,
      custom: "Hello from Lambda!"
    }
  }));
};
