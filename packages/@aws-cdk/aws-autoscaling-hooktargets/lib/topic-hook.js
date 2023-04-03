"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicHook = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const common_1 = require("./common");
/**
 * Use an SNS topic as a hook target
 */
class TopicHook {
    constructor(topic) {
        this.topic = topic;
    }
    /**
     * If an `IRole` is found in `options`, grant it topic publishing permissions.
     * Otherwise, create a new `IRole` and grant it topic publishing permissions.
     *
     * @returns the `IRole` with topic publishing permissions and the ARN of the topic it has publishing permission to.
     */
    bind(_scope, options) {
        const role = common_1.createRole(_scope, options.role);
        this.topic.grantPublish(role);
        return {
            notificationTargetArn: this.topic.topicArn,
            createdRole: role,
        };
    }
}
exports.TopicHook = TopicHook;
_a = JSII_RTTI_SYMBOL_1;
TopicHook[_a] = { fqn: "@aws-cdk/aws-autoscaling-hooktargets.TopicHook", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9waWMtaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRvcGljLWhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxxQ0FBc0M7QUFFdEM7O0dBRUc7QUFDSCxNQUFhLFNBQVM7SUFDcEIsWUFBNkIsS0FBaUI7UUFBakIsVUFBSyxHQUFMLEtBQUssQ0FBWTtLQUM3QztJQUVEOzs7OztPQUtHO0lBQ0ksSUFBSSxDQUFDLE1BQWlCLEVBQUUsT0FBMEM7UUFDdkUsTUFBTSxJQUFJLEdBQUcsbUJBQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTlCLE9BQU87WUFDTCxxQkFBcUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7WUFDMUMsV0FBVyxFQUFFLElBQUk7U0FDbEIsQ0FBQztLQUNIOztBQWxCSCw4QkFtQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhdXRvc2NhbGluZyBmcm9tICdAYXdzLWNkay9hd3MtYXV0b3NjYWxpbmcnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBjcmVhdGVSb2xlIH0gZnJvbSAnLi9jb21tb24nO1xuXG4vKipcbiAqIFVzZSBhbiBTTlMgdG9waWMgYXMgYSBob29rIHRhcmdldFxuICovXG5leHBvcnQgY2xhc3MgVG9waWNIb29rIGltcGxlbWVudHMgYXV0b3NjYWxpbmcuSUxpZmVjeWNsZUhvb2tUYXJnZXQge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHRvcGljOiBzbnMuSVRvcGljKSB7XG4gIH1cblxuICAvKipcbiAgICogSWYgYW4gYElSb2xlYCBpcyBmb3VuZCBpbiBgb3B0aW9uc2AsIGdyYW50IGl0IHRvcGljIHB1Ymxpc2hpbmcgcGVybWlzc2lvbnMuXG4gICAqIE90aGVyd2lzZSwgY3JlYXRlIGEgbmV3IGBJUm9sZWAgYW5kIGdyYW50IGl0IHRvcGljIHB1Ymxpc2hpbmcgcGVybWlzc2lvbnMuXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSBgSVJvbGVgIHdpdGggdG9waWMgcHVibGlzaGluZyBwZXJtaXNzaW9ucyBhbmQgdGhlIEFSTiBvZiB0aGUgdG9waWMgaXQgaGFzIHB1Ymxpc2hpbmcgcGVybWlzc2lvbiB0by5cbiAgICovXG4gIHB1YmxpYyBiaW5kKF9zY29wZTogQ29uc3RydWN0LCBvcHRpb25zOiBhdXRvc2NhbGluZy5CaW5kSG9va1RhcmdldE9wdGlvbnMpOiBhdXRvc2NhbGluZy5MaWZlY3ljbGVIb29rVGFyZ2V0Q29uZmlnIHtcbiAgICBjb25zdCByb2xlID0gY3JlYXRlUm9sZShfc2NvcGUsIG9wdGlvbnMucm9sZSk7XG4gICAgdGhpcy50b3BpYy5ncmFudFB1Ymxpc2gocm9sZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbm90aWZpY2F0aW9uVGFyZ2V0QXJuOiB0aGlzLnRvcGljLnRvcGljQXJuLFxuICAgICAgY3JlYXRlZFJvbGU6IHJvbGUsXG4gICAgfTtcbiAgfVxufVxuIl19