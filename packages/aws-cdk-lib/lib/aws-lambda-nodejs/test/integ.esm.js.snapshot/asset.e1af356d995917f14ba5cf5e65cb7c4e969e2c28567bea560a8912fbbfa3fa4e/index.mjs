// packages/@aws-cdk/aws-lambda-nodejs/test/integ-handlers/esm.ts
import * as crypto from "crypto";
async function handler() {
  console.log(crypto.createHash("sha512").update("cdk").digest("hex"));
}
export {
  handler
};
