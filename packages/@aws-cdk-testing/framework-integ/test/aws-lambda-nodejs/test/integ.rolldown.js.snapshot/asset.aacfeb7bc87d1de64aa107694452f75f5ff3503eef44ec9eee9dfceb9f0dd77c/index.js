Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region handler.ts
async function handler() {
	return {
		statusCode: 200,
		body: JSON.stringify({ bundler: "rolldown" })
	};
}
//#endregion
exports.handler = handler;
