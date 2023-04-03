"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VpcLink = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const apigateway_generated_1 = require("./apigateway.generated");
/**
 * Define a new VPC Link
 * Specifies an API Gateway VPC link for a RestApi to access resources in an Amazon Virtual Private Cloud (VPC).
 */
class VpcLink extends core_1.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.vpcLinkName ||
                core_1.Lazy.string({ produce: () => core_1.Names.nodeUniqueId(this.node) }),
        });
        this._targets = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_VpcLinkProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, VpcLink);
            }
            throw error;
        }
        const cfnResource = new apigateway_generated_1.CfnVpcLink(this, 'Resource', {
            name: this.physicalName,
            description: props.description,
            targetArns: core_1.Lazy.list({ produce: () => this.renderTargets() }),
        });
        this.vpcLinkId = cfnResource.ref;
        if (props.targets) {
            this.addTargets(...props.targets);
        }
        this.node.addValidation({ validate: () => this.validateVpcLink() });
    }
    /**
     * Import a VPC Link by its Id
     */
    static fromVpcLinkId(scope, id, vpcLinkId) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.vpcLinkId = vpcLinkId;
            }
        }
        return new Import(scope, id);
    }
    addTargets(...targets) {
        this._targets.push(...targets);
    }
    /**
     * Return the list of DNS names from the target NLBs.
     * @internal
     * */
    get _targetDnsNames() {
        return this._targets.map(t => t.loadBalancerDnsName);
    }
    validateVpcLink() {
        if (this._targets.length === 0) {
            return ['No targets added to vpc link'];
        }
        return [];
    }
    renderTargets() {
        return this._targets.map(nlb => nlb.loadBalancerArn);
    }
}
exports.VpcLink = VpcLink;
_a = JSII_RTTI_SYMBOL_1;
VpcLink[_a] = { fqn: "@aws-cdk/aws-apigateway.VpcLink", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLWxpbmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2cGMtbGluay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx3Q0FBaUU7QUFFakUsaUVBQW9EO0FBc0NwRDs7O0dBR0c7QUFDSCxNQUFhLE9BQVEsU0FBUSxlQUFRO0lBb0JuQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQXNCLEVBQUU7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLFdBQVc7Z0JBQzdCLFdBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsWUFBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztTQUNoRSxDQUFDLENBQUM7UUFOWSxhQUFRLEdBQUcsSUFBSSxLQUFLLEVBQThCLENBQUM7Ozs7OzsrQ0FsQnpELE9BQU87Ozs7UUEwQmhCLE1BQU0sV0FBVyxHQUFHLElBQUksaUNBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ25ELElBQUksRUFBRSxJQUFJLENBQUMsWUFBWTtZQUN2QixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDOUIsVUFBVSxFQUFFLFdBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUM7U0FDL0QsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDO1FBRWpDLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUNqQixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ25DO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNyRTtJQXRDRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsU0FBaUI7UUFDekUsTUFBTSxNQUFPLFNBQVEsZUFBUTtZQUE3Qjs7Z0JBQ1MsY0FBUyxHQUFHLFNBQVMsQ0FBQztZQUMvQixDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQStCTSxVQUFVLENBQUMsR0FBRyxPQUFxQztRQUN4RCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0tBQ2hDO0lBRUQ7OztTQUdLO0lBQ0wsSUFBVyxlQUFlO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQztLQUN0RDtJQUVPLGVBQWU7UUFDckIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDOUIsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUM7U0FDekM7UUFDRCxPQUFPLEVBQUUsQ0FBQztLQUNYO0lBRU8sYUFBYTtRQUNuQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ3REOztBQTlESCwwQkErREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mic7XG5pbXBvcnQgeyBJUmVzb3VyY2UsIExhenksIE5hbWVzLCBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5WcGNMaW5rIH0gZnJvbSAnLi9hcGlnYXRld2F5LmdlbmVyYXRlZCc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBBUEkgR2F0ZXdheSBWcGNMaW5rXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVZwY0xpbmsgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogUGh5c2ljYWwgSUQgb2YgdGhlIFZwY0xpbmsgcmVzb3VyY2VcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgdnBjTGlua0lkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBWcGNMaW5rXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVnBjTGlua1Byb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIHVzZWQgdG8gbGFiZWwgYW5kIGlkZW50aWZ5IHRoZSBWUEMgbGluay5cbiAgICogQGRlZmF1bHQgLSBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBuYW1lXG4gICAqL1xuICByZWFkb25seSB2cGNMaW5rTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBWUEMgbGluay5cbiAgICogQGRlZmF1bHQgbm8gZGVzY3JpcHRpb25cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmV0d29yayBsb2FkIGJhbGFuY2VycyBvZiB0aGUgVlBDIHRhcmdldGVkIGJ5IHRoZSBWUEMgbGluay5cbiAgICogVGhlIG5ldHdvcmsgbG9hZCBiYWxhbmNlcnMgbXVzdCBiZSBvd25lZCBieSB0aGUgc2FtZSBBV1MgYWNjb3VudCBvZiB0aGUgQVBJIG93bmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHRhcmdldHMuIFVzZSBgYWRkVGFyZ2V0c2AgdG8gYWRkIHRhcmdldHNcbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldHM/OiBlbGJ2Mi5JTmV0d29ya0xvYWRCYWxhbmNlcltdO1xufVxuXG4vKipcbiAqIERlZmluZSBhIG5ldyBWUEMgTGlua1xuICogU3BlY2lmaWVzIGFuIEFQSSBHYXRld2F5IFZQQyBsaW5rIGZvciBhIFJlc3RBcGkgdG8gYWNjZXNzIHJlc291cmNlcyBpbiBhbiBBbWF6b24gVmlydHVhbCBQcml2YXRlIENsb3VkIChWUEMpLlxuICovXG5leHBvcnQgY2xhc3MgVnBjTGluayBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVZwY0xpbmsge1xuICAvKipcbiAgICogSW1wb3J0IGEgVlBDIExpbmsgYnkgaXRzIElkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21WcGNMaW5rSWQoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgdnBjTGlua0lkOiBzdHJpbmcpOiBJVnBjTGluayB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJVnBjTGluayB7XG4gICAgICBwdWJsaWMgdnBjTGlua0lkID0gdnBjTGlua0lkO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogUGh5c2ljYWwgSUQgb2YgdGhlIFZwY0xpbmsgcmVzb3VyY2VcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHZwY0xpbmtJZDogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX3RhcmdldHMgPSBuZXcgQXJyYXk8ZWxidjIuSU5ldHdvcmtMb2FkQmFsYW5jZXI+KCk7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFZwY0xpbmtQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLnZwY0xpbmtOYW1lIHx8XG4gICAgICAgIExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gTmFtZXMubm9kZVVuaXF1ZUlkKHRoaXMubm9kZSkgfSksXG4gICAgfSk7XG5cbiAgICBjb25zdCBjZm5SZXNvdXJjZSA9IG5ldyBDZm5WcGNMaW5rKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIG5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uLFxuICAgICAgdGFyZ2V0QXJuczogTGF6eS5saXN0KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZW5kZXJUYXJnZXRzKCkgfSksXG4gICAgfSk7XG5cbiAgICB0aGlzLnZwY0xpbmtJZCA9IGNmblJlc291cmNlLnJlZjtcblxuICAgIGlmIChwcm9wcy50YXJnZXRzKSB7XG4gICAgICB0aGlzLmFkZFRhcmdldHMoLi4ucHJvcHMudGFyZ2V0cyk7XG4gICAgfVxuXG4gICAgdGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oeyB2YWxpZGF0ZTogKCkgPT4gdGhpcy52YWxpZGF0ZVZwY0xpbmsoKSB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUYXJnZXRzKC4uLnRhcmdldHM6IGVsYnYyLklOZXR3b3JrTG9hZEJhbGFuY2VyW10pIHtcbiAgICB0aGlzLl90YXJnZXRzLnB1c2goLi4udGFyZ2V0cyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBsaXN0IG9mIEROUyBuYW1lcyBmcm9tIHRoZSB0YXJnZXQgTkxCcy5cbiAgICogQGludGVybmFsXG4gICAqICovXG4gIHB1YmxpYyBnZXQgX3RhcmdldERuc05hbWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdGFyZ2V0cy5tYXAodCA9PiB0LmxvYWRCYWxhbmNlckRuc05hbWUpO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZVZwY0xpbmsoKTogc3RyaW5nW10ge1xuICAgIGlmICh0aGlzLl90YXJnZXRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFsnTm8gdGFyZ2V0cyBhZGRlZCB0byB2cGMgbGluayddO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclRhcmdldHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RhcmdldHMubWFwKG5sYiA9PiBubGIubG9hZEJhbGFuY2VyQXJuKTtcbiAgfVxufVxuIl19