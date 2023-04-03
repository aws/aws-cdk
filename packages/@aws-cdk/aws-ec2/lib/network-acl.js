"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubnetNetworkAclAssociation = exports.NetworkAclEntry = exports.TrafficDirection = exports.Action = exports.NetworkAcl = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const ec2_generated_1 = require("./ec2.generated");
/**
 * A NetworkAclBase that is not created in this template
 *
 *
 */
class NetworkAclBase extends core_1.Resource {
    /**
     * Add a new entry to the ACL
     */
    addEntry(id, options) {
        return new NetworkAclEntry(this, id, {
            networkAcl: this,
            ...options,
        });
    }
}
/**
 * Define a new custom network ACL
 *
 * By default, will deny all inbound and outbound traffic unless entries are
 * added explicitly allowing it.
 *
 *
 */
class NetworkAcl extends NetworkAclBase {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.networkAclName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_NetworkAclProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, NetworkAcl);
            }
            throw error;
        }
        this.vpc = props.vpc;
        this.networkAcl = new ec2_generated_1.CfnNetworkAcl(this, 'Resource', {
            vpcId: props.vpc.vpcId,
        });
        this.networkAclId = this.networkAcl.ref;
        this.networkAclVpcId = this.networkAcl.vpcId;
        if (props.subnetSelection !== undefined) {
            this.associateWithSubnet('DefaultAssociation', props.subnetSelection);
        }
    }
    /**
     * Import an existing NetworkAcl into this app.
     */
    static fromNetworkAclId(scope, id, networkAclId) {
        class Import extends NetworkAclBase {
            constructor() {
                super(...arguments);
                this.networkAclId = networkAclId;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Associate the ACL with a given set of subnets
     */
    associateWithSubnet(id, selection) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_SubnetSelection(selection);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.associateWithSubnet);
            }
            throw error;
        }
        const subnets = this.vpc.selectSubnets(selection);
        for (const subnet of subnets.subnets) {
            subnet.associateNetworkAcl(id, this);
        }
    }
}
exports.NetworkAcl = NetworkAcl;
_a = JSII_RTTI_SYMBOL_1;
NetworkAcl[_a] = { fqn: "@aws-cdk/aws-ec2.NetworkAcl", version: "0.0.0" };
/**
 * What action to apply to traffic matching the ACL
 *
 *
 */
var Action;
(function (Action) {
    /**
     * Allow the traffic
     */
    Action["ALLOW"] = "allow";
    /**
     * Deny the traffic
     */
    Action["DENY"] = "deny";
})(Action = exports.Action || (exports.Action = {}));
/**
 * Base class for NetworkAclEntries
 *
 *
 */
class NetworkAclEntryBase extends core_1.Resource {
}
/**
 * Direction of traffic the AclEntry applies to
 *
 *
 */
var TrafficDirection;
(function (TrafficDirection) {
    /**
     * Traffic leaving the subnet
     */
    TrafficDirection[TrafficDirection["EGRESS"] = 0] = "EGRESS";
    /**
     * Traffic entering the subnet
     */
    TrafficDirection[TrafficDirection["INGRESS"] = 1] = "INGRESS";
})(TrafficDirection = exports.TrafficDirection || (exports.TrafficDirection = {}));
/**
 * Define an entry in a Network ACL table
 *
 *
 */
class NetworkAclEntry extends NetworkAclEntryBase {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.networkAclEntryName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_NetworkAclEntryProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, NetworkAclEntry);
            }
            throw error;
        }
        this.networkAcl = props.networkAcl;
        new ec2_generated_1.CfnNetworkAclEntry(this, 'Resource', {
            networkAclId: this.networkAcl.networkAclId,
            ruleNumber: props.ruleNumber,
            ruleAction: props.ruleAction ?? Action.ALLOW,
            egress: props.direction !== undefined ? props.direction === TrafficDirection.EGRESS : undefined,
            ...props.traffic.toTrafficConfig(),
            ...props.cidr.toCidrConfig(),
        });
    }
}
exports.NetworkAclEntry = NetworkAclEntry;
_b = JSII_RTTI_SYMBOL_1;
NetworkAclEntry[_b] = { fqn: "@aws-cdk/aws-ec2.NetworkAclEntry", version: "0.0.0" };
/**
 * Associate a network ACL with a subnet
 *
 *
 */
class SubnetNetworkAclAssociationBase extends core_1.Resource {
}
class SubnetNetworkAclAssociation extends SubnetNetworkAclAssociationBase {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.subnetNetworkAclAssociationName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_SubnetNetworkAclAssociationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SubnetNetworkAclAssociation);
            }
            throw error;
        }
        this.association = new ec2_generated_1.CfnSubnetNetworkAclAssociation(this, 'Resource', {
            networkAclId: props.networkAcl.networkAclId,
            subnetId: props.subnet.subnetId,
        });
        this.networkAcl = props.networkAcl;
        this.subnet = props.subnet;
        this.subnetNetworkAclAssociationAssociationId = this.association.attrAssociationId;
    }
    static fromSubnetNetworkAclAssociationAssociationId(scope, id, subnetNetworkAclAssociationAssociationId) {
        class Import extends SubnetNetworkAclAssociationBase {
            constructor() {
                super(...arguments);
                this.subnetNetworkAclAssociationAssociationId = subnetNetworkAclAssociationAssociationId;
            }
        }
        return new Import(scope, id);
    }
}
exports.SubnetNetworkAclAssociation = SubnetNetworkAclAssociation;
_c = JSII_RTTI_SYMBOL_1;
SubnetNetworkAclAssociation[_c] = { fqn: "@aws-cdk/aws-ec2.SubnetNetworkAclAssociation", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1hY2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXR3b3JrLWFjbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBb0Q7QUFFcEQsbURBQW9HO0FBc0JwRzs7OztHQUlHO0FBQ0gsTUFBZSxjQUFlLFNBQVEsZUFBUTtJQUc1Qzs7T0FFRztJQUNJLFFBQVEsQ0FBQyxFQUFVLEVBQUUsT0FBcUM7UUFDL0QsT0FBTyxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ25DLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLEdBQUcsT0FBTztTQUNYLENBQUMsQ0FBQztLQUNKO0NBRUY7QUFrQ0Q7Ozs7Ozs7R0FPRztBQUNILE1BQWEsVUFBVyxTQUFRLGNBQWM7SUE2QjVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLGNBQWM7U0FDbkMsQ0FBQyxDQUFDOzs7Ozs7K0NBaENNLFVBQVU7Ozs7UUFrQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUVyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksNkJBQWEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BELEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUs7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztRQUN4QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBRTdDLElBQUksS0FBSyxDQUFDLGVBQWUsS0FBSyxTQUFTLEVBQUU7WUFDdkMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUN2RTtL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QUFDO1FBRUgsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsd0NBQXdDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQztLQUNwRjtJQTFDTSxNQUFNLENBQUMsNENBQTRDLENBQ3hELEtBQWdCLEVBQUUsRUFBVSxFQUM1Qix3Q0FBZ0Q7UUFDaEQsTUFBTSxNQUFPLFNBQVEsK0JBQStCO1lBQXBEOztnQkFDa0IsNkNBQXdDLEdBQUcsd0NBQXdDLENBQUM7WUFDdEcsQ0FBQztTQUFBO1FBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7O0FBVEgsa0VBNENDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVJlc291cmNlLCBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5OZXR3b3JrQWNsLCBDZm5OZXR3b3JrQWNsRW50cnksIENmblN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbiB9IGZyb20gJy4vZWMyLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBBY2xDaWRyLCBBY2xUcmFmZmljIH0gZnJvbSAnLi9uZXR3b3JrLWFjbC10eXBlcyc7XG5pbXBvcnQgeyBJU3VibmV0LCBJVnBjLCBTdWJuZXRTZWxlY3Rpb24gfSBmcm9tICcuL3ZwYyc7XG5cbi8qKlxuICogQSBOZXR3b3JrQWNsXG4gKlxuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTmV0d29ya0FjbCBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBJRCBmb3IgdGhlIGN1cnJlbnQgTmV0d29yayBBQ0xcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgbmV0d29ya0FjbElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBlbnRyeSB0byB0aGUgQUNMXG4gICAqL1xuICBhZGRFbnRyeShpZDogc3RyaW5nLCBvcHRpb25zOiBDb21tb25OZXR3b3JrQWNsRW50cnlPcHRpb25zKTogTmV0d29ya0FjbEVudHJ5O1xufVxuXG4vKipcbiAqIEEgTmV0d29ya0FjbEJhc2UgdGhhdCBpcyBub3QgY3JlYXRlZCBpbiB0aGlzIHRlbXBsYXRlXG4gKlxuICpcbiAqL1xuYWJzdHJhY3QgY2xhc3MgTmV0d29ya0FjbEJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElOZXR3b3JrQWNsIHtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IG5ldHdvcmtBY2xJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZW50cnkgdG8gdGhlIEFDTFxuICAgKi9cbiAgcHVibGljIGFkZEVudHJ5KGlkOiBzdHJpbmcsIG9wdGlvbnM6IENvbW1vbk5ldHdvcmtBY2xFbnRyeU9wdGlvbnMpOiBOZXR3b3JrQWNsRW50cnkge1xuICAgIHJldHVybiBuZXcgTmV0d29ya0FjbEVudHJ5KHRoaXMsIGlkLCB7XG4gICAgICBuZXR3b3JrQWNsOiB0aGlzLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG59XG5cbi8qKlxuICogUHJvcGVydGllcyB0byBjcmVhdGUgTmV0d29ya0FjbFxuICpcbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya0FjbFByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBOZXR3b3JrQWNsLlxuICAgKlxuICAgKiBJdCBpcyBub3QgcmVjb21tZW5kZWQgdG8gdXNlIGFuIGV4cGxpY2l0IG5hbWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IElmIHlvdSBkb24ndCBzcGVjaWZ5IGEgbmV0d29ya0FjbE5hbWUsIEFXUyBDbG91ZEZvcm1hdGlvbiBnZW5lcmF0ZXMgYVxuICAgKiB1bmlxdWUgcGh5c2ljYWwgSUQgYW5kIHVzZXMgdGhhdCBJRCBmb3IgdGhlIGdyb3VwIG5hbWUuXG4gICAqL1xuICByZWFkb25seSBuZXR3b3JrQWNsTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIFZQQyBpbiB3aGljaCB0byBjcmVhdGUgdGhlIE5ldHdvcmtBQ0wuXG4gICAqL1xuICByZWFkb25seSB2cGM6IElWcGM7XG5cbiAgLyoqXG4gICAqIFN1Ym5ldHMgaW4gdGhlIGdpdmVuIFZQQyB0byBhc3NvY2lhdGUgdGhlIEFDTCB3aXRoXG4gICAqXG4gICAqIE1vcmUgc3VibmV0cyBjYW4gYWx3YXlzIGJlIGFkZGVkIGxhdGVyIGJ5IGNhbGxpbmdcbiAgICogYGFzc29jaWF0ZVdpdGhTdWJuZXRzKClgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHN1Ym5ldHMgYXNzb2NpYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgc3VibmV0U2VsZWN0aW9uPzogU3VibmV0U2VsZWN0aW9uO1xufVxuXG4vKipcbiAqIERlZmluZSBhIG5ldyBjdXN0b20gbmV0d29yayBBQ0xcbiAqXG4gKiBCeSBkZWZhdWx0LCB3aWxsIGRlbnkgYWxsIGluYm91bmQgYW5kIG91dGJvdW5kIHRyYWZmaWMgdW5sZXNzIGVudHJpZXMgYXJlXG4gKiBhZGRlZCBleHBsaWNpdGx5IGFsbG93aW5nIGl0LlxuICpcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBOZXR3b3JrQWNsIGV4dGVuZHMgTmV0d29ya0FjbEJhc2Uge1xuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIE5ldHdvcmtBY2wgaW50byB0aGlzIGFwcC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbU5ldHdvcmtBY2xJZChzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBuZXR3b3JrQWNsSWQ6IHN0cmluZyk6IElOZXR3b3JrQWNsIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBOZXR3b3JrQWNsQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbmV0d29ya0FjbElkID0gbmV0d29ya0FjbElkO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBOZXR3b3JrQUNMXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBuZXR3b3JrQWNsSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIFZQQyBJRCBmb3IgdGhpcyBOZXR3b3JrQUNMXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBuZXR3b3JrQWNsVnBjSWQ6IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IG5ldHdvcmtBY2w6IENmbk5ldHdvcmtBY2w7XG4gIHByaXZhdGUgcmVhZG9ubHkgdnBjOiBJVnBjO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBOZXR3b3JrQWNsUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMubmV0d29ya0FjbE5hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLnZwYyA9IHByb3BzLnZwYztcblxuICAgIHRoaXMubmV0d29ya0FjbCA9IG5ldyBDZm5OZXR3b3JrQWNsKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHZwY0lkOiBwcm9wcy52cGMudnBjSWQsXG4gICAgfSk7XG5cbiAgICB0aGlzLm5ldHdvcmtBY2xJZCA9IHRoaXMubmV0d29ya0FjbC5yZWY7XG4gICAgdGhpcy5uZXR3b3JrQWNsVnBjSWQgPSB0aGlzLm5ldHdvcmtBY2wudnBjSWQ7XG5cbiAgICBpZiAocHJvcHMuc3VibmV0U2VsZWN0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuYXNzb2NpYXRlV2l0aFN1Ym5ldCgnRGVmYXVsdEFzc29jaWF0aW9uJywgcHJvcHMuc3VibmV0U2VsZWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXNzb2NpYXRlIHRoZSBBQ0wgd2l0aCBhIGdpdmVuIHNldCBvZiBzdWJuZXRzXG4gICAqL1xuICBwdWJsaWMgYXNzb2NpYXRlV2l0aFN1Ym5ldChpZDogc3RyaW5nLCBzZWxlY3Rpb246IFN1Ym5ldFNlbGVjdGlvbikge1xuICAgIGNvbnN0IHN1Ym5ldHMgPSB0aGlzLnZwYy5zZWxlY3RTdWJuZXRzKHNlbGVjdGlvbik7XG4gICAgZm9yIChjb25zdCBzdWJuZXQgb2Ygc3VibmV0cy5zdWJuZXRzKSB7XG4gICAgICBzdWJuZXQuYXNzb2NpYXRlTmV0d29ya0FjbChpZCwgdGhpcyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogV2hhdCBhY3Rpb24gdG8gYXBwbHkgdG8gdHJhZmZpYyBtYXRjaGluZyB0aGUgQUNMXG4gKlxuICpcbiAqL1xuZXhwb3J0IGVudW0gQWN0aW9uIHtcbiAgLyoqXG4gICAqIEFsbG93IHRoZSB0cmFmZmljXG4gICAqL1xuICBBTExPVyA9ICdhbGxvdycsXG5cbiAgLyoqXG4gICAqIERlbnkgdGhlIHRyYWZmaWNcbiAgICovXG4gIERFTlkgPSAnZGVueScsXG59XG5cbi8qKlxuICogQSBOZXR3b3JrQWNsRW50cnlcbiAqXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElOZXR3b3JrQWNsRW50cnkgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIG5ldHdvcmsgQUNMLlxuICAgKi9cbiAgcmVhZG9ubHkgbmV0d29ya0FjbDogSU5ldHdvcmtBY2xcblxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIE5ldHdvcmtBY2xFbnRyaWVzXG4gKlxuICpcbiAqL1xuYWJzdHJhY3QgY2xhc3MgTmV0d29ya0FjbEVudHJ5QmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSU5ldHdvcmtBY2xFbnRyeSB7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBuZXR3b3JrQWNsOiBJTmV0d29ya0FjbDtcbn1cblxuLyoqXG4gKiBEaXJlY3Rpb24gb2YgdHJhZmZpYyB0aGUgQWNsRW50cnkgYXBwbGllcyB0b1xuICpcbiAqXG4gKi9cbmV4cG9ydCBlbnVtIFRyYWZmaWNEaXJlY3Rpb24ge1xuICAvKipcbiAgICogVHJhZmZpYyBsZWF2aW5nIHRoZSBzdWJuZXRcbiAgICovXG4gIEVHUkVTUyxcblxuICAvKipcbiAgICogVHJhZmZpYyBlbnRlcmluZyB0aGUgc3VibmV0XG4gICAqL1xuICBJTkdSRVNTLFxufVxuXG4vKipcbiAqIEJhc2ljIE5ldHdvcmtBQ0wgZW50cnkgcHJvcHNcbiAqXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbW1vbk5ldHdvcmtBY2xFbnRyeU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIE5ldHdvcmtBY2xFbnRyeS5cbiAgICpcbiAgICogSXQgaXMgbm90IHJlY29tbWVuZGVkIHRvIHVzZSBhbiBleHBsaWNpdCBncm91cCBuYW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCBJZiB5b3UgZG9uJ3Qgc3BlY2lmeSBhIE5ldHdvcmtBY2xOYW1lLCBBV1MgQ2xvdWRGb3JtYXRpb24gZ2VuZXJhdGVzIGFcbiAgICogdW5pcXVlIHBoeXNpY2FsIElEIGFuZCB1c2VzIHRoYXQgSUQgZm9yIHRoZSBncm91cCBuYW1lLlxuICAgKi9cbiAgcmVhZG9ubHkgbmV0d29ya0FjbEVudHJ5TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIENJRFIgcmFuZ2UgdG8gYWxsb3cgb3IgZGVueS5cbiAgICovXG4gIHJlYWRvbmx5IGNpZHI6IEFjbENpZHI7XG5cbiAgLyoqXG4gICAqIFdoYXQga2luZCBvZiB0cmFmZmljIHRoaXMgQUNMIHJ1bGUgYXBwbGllcyB0b1xuICAgKi9cbiAgcmVhZG9ubHkgdHJhZmZpYzogQWNsVHJhZmZpYztcblxuICAvKipcbiAgICogVHJhZmZpYyBkaXJlY3Rpb24sIHdpdGggcmVzcGVjdCB0byB0aGUgc3VibmV0LCB0aGlzIHJ1bGUgYXBwbGllcyB0b1xuICAgKlxuICAgKiBAZGVmYXVsdCBUcmFmZmljRGlyZWN0aW9uLklOR1JFU1NcbiAgICovXG4gIHJlYWRvbmx5IGRpcmVjdGlvbj86IFRyYWZmaWNEaXJlY3Rpb247XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYWxsb3cgb3IgZGVueSB0cmFmZmljIHRoYXQgbWF0Y2hlcyB0aGUgcnVsZTsgdmFsaWQgdmFsdWVzIGFyZSBcImFsbG93XCIgb3IgXCJkZW55XCIuXG4gICAqXG4gICAqIEFueSB0cmFmZmljIHRoYXQgaXMgbm90IGV4cGxpY2l0bHkgYWxsb3dlZCBpcyBhdXRvbWF0aWNhbGx5IGRlbmllZCBpbiBhIGN1c3RvbVxuICAgKiBBQ0wsIGFsbCB0cmFmZmljIGlzIGF1dG9tYXRpY2FsbHkgYWxsb3dlZCBpbiBhIGRlZmF1bHQgQUNMLlxuICAgKlxuICAgKiBAZGVmYXVsdCBBTExPV1xuICAgKi9cbiAgcmVhZG9ubHkgcnVsZUFjdGlvbj86IEFjdGlvbjtcblxuICAvKipcbiAgICogUnVsZSBudW1iZXIgdG8gYXNzaWduIHRvIHRoZSBlbnRyeSwgc3VjaCBhcyAxMDAuIEFDTCBlbnRyaWVzIGFyZSBwcm9jZXNzZWQgaW4gYXNjZW5kaW5nIG9yZGVyIGJ5IHJ1bGUgbnVtYmVyLlxuICAgKiBFbnRyaWVzIGNhbid0IHVzZSB0aGUgc2FtZSBydWxlIG51bWJlciB1bmxlc3Mgb25lIGlzIGFuIGVncmVzcyBydWxlIGFuZCB0aGUgb3RoZXIgaXMgYW4gaW5ncmVzcyBydWxlLlxuICAgKi9cbiAgcmVhZG9ubHkgcnVsZU51bWJlcjogbnVtYmVyO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gY3JlYXRlIE5ldHdvcmtBY2xFbnRyeVxuICpcbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya0FjbEVudHJ5UHJvcHMgZXh0ZW5kcyBDb21tb25OZXR3b3JrQWNsRW50cnlPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuZXR3b3JrIEFDTCB0aGlzIGVudHJ5IGFwcGxpZXMgdG8uXG4gICAqL1xuICByZWFkb25seSBuZXR3b3JrQWNsOiBJTmV0d29ya0FjbDtcbn1cblxuLyoqXG4gKiBEZWZpbmUgYW4gZW50cnkgaW4gYSBOZXR3b3JrIEFDTCB0YWJsZVxuICpcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBOZXR3b3JrQWNsRW50cnkgZXh0ZW5kcyBOZXR3b3JrQWNsRW50cnlCYXNlIHtcbiAgcHVibGljIHJlYWRvbmx5IG5ldHdvcmtBY2w6IElOZXR3b3JrQWNsO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBOZXR3b3JrQWNsRW50cnlQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5uZXR3b3JrQWNsRW50cnlOYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5uZXR3b3JrQWNsID0gcHJvcHMubmV0d29ya0FjbDtcblxuICAgIG5ldyBDZm5OZXR3b3JrQWNsRW50cnkodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbmV0d29ya0FjbElkOiB0aGlzLm5ldHdvcmtBY2wubmV0d29ya0FjbElkLFxuICAgICAgcnVsZU51bWJlcjogcHJvcHMucnVsZU51bWJlcixcbiAgICAgIHJ1bGVBY3Rpb246IHByb3BzLnJ1bGVBY3Rpb24gPz8gQWN0aW9uLkFMTE9XLFxuICAgICAgZWdyZXNzOiBwcm9wcy5kaXJlY3Rpb24gIT09IHVuZGVmaW5lZCA/IHByb3BzLmRpcmVjdGlvbiA9PT0gVHJhZmZpY0RpcmVjdGlvbi5FR1JFU1MgOiB1bmRlZmluZWQsXG4gICAgICAuLi5wcm9wcy50cmFmZmljLnRvVHJhZmZpY0NvbmZpZygpLFxuICAgICAgLi4ucHJvcHMuY2lkci50b0NpZHJDb25maWcoKSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEEgU3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uXG4gKlxuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIElEIGZvciB0aGUgY3VycmVudCBTdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb25cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgc3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uQXNzb2NpYXRpb25JZDogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gY3JlYXRlIGEgU3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uXG4gKlxuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgU3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uLlxuICAgKlxuICAgKiBJdCBpcyBub3QgcmVjb21tZW5kZWQgdG8gdXNlIGFuIGV4cGxpY2l0IG5hbWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IElmIHlvdSBkb24ndCBzcGVjaWZ5IGEgU3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uTmFtZSwgQVdTIENsb3VkRm9ybWF0aW9uIGdlbmVyYXRlcyBhXG4gICAqIHVuaXF1ZSBwaHlzaWNhbCBJRCBhbmQgdXNlcyB0aGF0IElEIGZvciB0aGUgZ3JvdXAgbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IHN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbk5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBOZXR3b3JrIEFDTCB0aGlzIGFzc29jaWF0aW9uIGlzIGRlZmluZWQgZm9yXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IG5ldHdvcmtBY2w6IElOZXR3b3JrQWNsO1xuXG4gIC8qKlxuICAgKiBJRCBvZiB0aGUgU3VibmV0XG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHN1Ym5ldDogSVN1Ym5ldDtcbn1cblxuLyoqXG4gKiBBc3NvY2lhdGUgYSBuZXR3b3JrIEFDTCB3aXRoIGEgc3VibmV0XG4gKlxuICpcbiAqL1xuYWJzdHJhY3QgY2xhc3MgU3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uQmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbiB7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBzdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb25Bc3NvY2lhdGlvbklkOiBzdHJpbmc7XG59XG5leHBvcnQgY2xhc3MgU3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uIGV4dGVuZHMgU3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uQmFzZSB7XG4gIHB1YmxpYyBzdGF0aWMgZnJvbVN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbkFzc29jaWF0aW9uSWQoXG4gICAgc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZyxcbiAgICBzdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb25Bc3NvY2lhdGlvbklkOiBzdHJpbmcpOiBJU3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBTdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb25CYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBzdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb25Bc3NvY2lhdGlvbklkID0gc3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uQXNzb2NpYXRpb25JZDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG4gIC8qKlxuICAgKiBJRCBmb3IgdGhlIGN1cnJlbnQgU3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb25Bc3NvY2lhdGlvbklkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElEIGZvciB0aGUgY3VycmVudCBOZXR3b3JrIEFDTFxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbmV0d29ya0FjbDogSU5ldHdvcmtBY2w7XG5cbiAgLyoqXG4gICAqIElEIG9mIHRoZSBTdWJuZXRcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN1Ym5ldDogSVN1Ym5ldDtcblxuICBwcml2YXRlIGFzc29jaWF0aW9uOiBDZm5TdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb247XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLnN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbk5hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmFzc29jaWF0aW9uID0gbmV3IENmblN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBuZXR3b3JrQWNsSWQ6IHByb3BzLm5ldHdvcmtBY2wubmV0d29ya0FjbElkLFxuICAgICAgc3VibmV0SWQ6IHByb3BzLnN1Ym5ldC5zdWJuZXRJZCxcbiAgICB9KTtcblxuICAgIHRoaXMubmV0d29ya0FjbCA9IHByb3BzLm5ldHdvcmtBY2w7XG4gICAgdGhpcy5zdWJuZXQgPSBwcm9wcy5zdWJuZXQ7XG4gICAgdGhpcy5zdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb25Bc3NvY2lhdGlvbklkID0gdGhpcy5hc3NvY2lhdGlvbi5hdHRyQXNzb2NpYXRpb25JZDtcbiAgfVxufVxuIl19