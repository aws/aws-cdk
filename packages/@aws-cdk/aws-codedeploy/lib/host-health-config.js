"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinimumHealthyHosts = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Minimum number of healthy hosts for a server deployment.
 */
class MinimumHealthyHosts {
    constructor(json) {
        this.json = json;
    }
    /**
     * The minimum healhty hosts threshold expressed as an absolute number.
     */
    static count(value) {
        return new MinimumHealthyHosts({
            type: 'HOST_COUNT',
            value,
        });
    }
    /**
     * The minmum healhty hosts threshold expressed as a percentage of the fleet.
     */
    static percentage(value) {
        return new MinimumHealthyHosts({
            type: 'FLEET_PERCENT',
            value,
        });
    }
    /**
     * @internal
     */
    get _json() {
        return this.json;
    }
}
exports.MinimumHealthyHosts = MinimumHealthyHosts;
_a = JSII_RTTI_SYMBOL_1;
MinimumHealthyHosts[_a] = { fqn: "@aws-cdk/aws-codedeploy.MinimumHealthyHosts", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdC1oZWFsdGgtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaG9zdC1oZWFsdGgtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUE7O0dBRUc7QUFDSCxNQUFhLG1CQUFtQjtJQXNCOUIsWUFBcUMsSUFBcUQ7UUFBckQsU0FBSSxHQUFKLElBQUksQ0FBaUQ7S0FBSztJQXBCL0Y7O09BRUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWE7UUFDL0IsT0FBTyxJQUFJLG1CQUFtQixDQUFDO1lBQzdCLElBQUksRUFBRSxZQUFZO1lBQ2xCLEtBQUs7U0FDTixDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFhO1FBQ3BDLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQztZQUM3QixJQUFJLEVBQUUsZUFBZTtZQUNyQixLQUFLO1NBQ04sQ0FBQyxDQUFDO0tBQ0o7SUFJRDs7T0FFRztJQUNILElBQVcsS0FBSztRQUNkLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztLQUNsQjs7QUE3Qkgsa0RBOEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2ZuRGVwbG95bWVudENvbmZpZyB9IGZyb20gJy4vY29kZWRlcGxveS5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIE1pbmltdW0gbnVtYmVyIG9mIGhlYWx0aHkgaG9zdHMgZm9yIGEgc2VydmVyIGRlcGxveW1lbnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBNaW5pbXVtSGVhbHRoeUhvc3RzIHtcblxuICAvKipcbiAgICogVGhlIG1pbmltdW0gaGVhbGh0eSBob3N0cyB0aHJlc2hvbGQgZXhwcmVzc2VkIGFzIGFuIGFic29sdXRlIG51bWJlci5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY291bnQodmFsdWU6IG51bWJlcik6IE1pbmltdW1IZWFsdGh5SG9zdHMge1xuICAgIHJldHVybiBuZXcgTWluaW11bUhlYWx0aHlIb3N0cyh7XG4gICAgICB0eXBlOiAnSE9TVF9DT1VOVCcsXG4gICAgICB2YWx1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbWlubXVtIGhlYWxodHkgaG9zdHMgdGhyZXNob2xkIGV4cHJlc3NlZCBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIGZsZWV0LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwZXJjZW50YWdlKHZhbHVlOiBudW1iZXIpOiBNaW5pbXVtSGVhbHRoeUhvc3RzIHtcbiAgICByZXR1cm4gbmV3IE1pbmltdW1IZWFsdGh5SG9zdHMoe1xuICAgICAgdHlwZTogJ0ZMRUVUX1BFUkNFTlQnLFxuICAgICAgdmFsdWUsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkganNvbjogQ2ZuRGVwbG95bWVudENvbmZpZy5NaW5pbXVtSGVhbHRoeUhvc3RzUHJvcGVydHkpIHsgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBnZXQgX2pzb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuanNvbjtcbiAgfVxufVxuIl19