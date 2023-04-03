"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Architecture = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Architectures supported by AWS Lambda
 */
class Architecture {
    constructor(archName, dockerPlatform) {
        this.name = archName;
        this.dockerPlatform = dockerPlatform;
    }
    /**
     * Used to specify a custom architecture name.
     * Use this if the architecture name is not yet supported by the CDK.
     * @param name the architecture name as recognized by AWS Lambda.
     * @param [dockerPlatform=linux/amd64] the platform to use for this architecture when building with Docker
     */
    static custom(name, dockerPlatform) {
        return new Architecture(name, dockerPlatform ?? 'linux/amd64');
    }
}
exports.Architecture = Architecture;
_a = JSII_RTTI_SYMBOL_1;
Architecture[_a] = { fqn: "@aws-cdk/aws-lambda.Architecture", version: "0.0.0" };
/**
 * 64 bit architecture with x86 instruction set.
 */
Architecture.X86_64 = new Architecture('x86_64', 'linux/amd64');
/**
 * 64 bit architecture with the ARM instruction set.
 */
Architecture.ARM_64 = new Architecture('arm64', 'linux/arm64');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjaGl0ZWN0dXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXJjaGl0ZWN0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7O0dBRUc7QUFDSCxNQUFhLFlBQVk7SUErQnZCLFlBQW9CLFFBQWdCLEVBQUUsY0FBc0I7UUFDMUQsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDckIsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7S0FDdEM7SUF2QkQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQVksRUFBRSxjQUF1QjtRQUN4RCxPQUFPLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxjQUFjLElBQUksYUFBYSxDQUFDLENBQUM7S0FDaEU7O0FBbkJILG9DQW1DQzs7O0FBbENDOztHQUVHO0FBQ29CLG1CQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBRTFFOztHQUVHO0FBQ29CLG1CQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBcmNoaXRlY3R1cmVzIHN1cHBvcnRlZCBieSBBV1MgTGFtYmRhXG4gKi9cbmV4cG9ydCBjbGFzcyBBcmNoaXRlY3R1cmUge1xuICAvKipcbiAgICogNjQgYml0IGFyY2hpdGVjdHVyZSB3aXRoIHg4NiBpbnN0cnVjdGlvbiBzZXQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFg4Nl82NCA9IG5ldyBBcmNoaXRlY3R1cmUoJ3g4Nl82NCcsICdsaW51eC9hbWQ2NCcpO1xuXG4gIC8qKlxuICAgKiA2NCBiaXQgYXJjaGl0ZWN0dXJlIHdpdGggdGhlIEFSTSBpbnN0cnVjdGlvbiBzZXQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEFSTV82NCA9IG5ldyBBcmNoaXRlY3R1cmUoJ2FybTY0JywgJ2xpbnV4L2FybTY0Jyk7XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gc3BlY2lmeSBhIGN1c3RvbSBhcmNoaXRlY3R1cmUgbmFtZS5cbiAgICogVXNlIHRoaXMgaWYgdGhlIGFyY2hpdGVjdHVyZSBuYW1lIGlzIG5vdCB5ZXQgc3VwcG9ydGVkIGJ5IHRoZSBDREsuXG4gICAqIEBwYXJhbSBuYW1lIHRoZSBhcmNoaXRlY3R1cmUgbmFtZSBhcyByZWNvZ25pemVkIGJ5IEFXUyBMYW1iZGEuXG4gICAqIEBwYXJhbSBbZG9ja2VyUGxhdGZvcm09bGludXgvYW1kNjRdIHRoZSBwbGF0Zm9ybSB0byB1c2UgZm9yIHRoaXMgYXJjaGl0ZWN0dXJlIHdoZW4gYnVpbGRpbmcgd2l0aCBEb2NrZXJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY3VzdG9tKG5hbWU6IHN0cmluZywgZG9ja2VyUGxhdGZvcm0/OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IEFyY2hpdGVjdHVyZShuYW1lLCBkb2NrZXJQbGF0Zm9ybSA/PyAnbGludXgvYW1kNjQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgYXJjaGl0ZWN0dXJlIGFzIHJlY29nbml6ZWQgYnkgdGhlIEFXUyBMYW1iZGEgc2VydmljZSBBUElzLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHBsYXRmb3JtIHRvIHVzZSBmb3IgdGhpcyBhcmNoaXRlY3R1cmUgd2hlbiBidWlsZGluZyB3aXRoIERvY2tlci5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkb2NrZXJQbGF0Zm9ybTogc3RyaW5nO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoYXJjaE5hbWU6IHN0cmluZywgZG9ja2VyUGxhdGZvcm06IHN0cmluZykge1xuICAgIHRoaXMubmFtZSA9IGFyY2hOYW1lO1xuICAgIHRoaXMuZG9ja2VyUGxhdGZvcm0gPSBkb2NrZXJQbGF0Zm9ybTtcbiAgfVxufVxuIl19