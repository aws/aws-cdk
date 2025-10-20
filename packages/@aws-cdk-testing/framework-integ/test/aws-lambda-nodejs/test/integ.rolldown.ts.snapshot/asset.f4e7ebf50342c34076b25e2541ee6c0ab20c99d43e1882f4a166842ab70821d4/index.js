//#region packages/@aws-cdk-testing/framework-integ/test/aws-lambda-nodejs/test/integ-handlers/rolldown-handler.ts
async function handler(event) {
	console.log("Event:", JSON.stringify(event, null, 2));
	const result = {
		message: "Hello from Rolldown bundler!",
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		event,
		delayed: await Promise.resolve("async works"),
		optional: event?.test?.value ?? "default",
		numbers: [
			1,
			2,
			3,
			4,
			5
		].map((n) => n * 2)
	};
	return {
		statusCode: 200,
		body: JSON.stringify(result)
	};
}

//#endregion
export { handler };