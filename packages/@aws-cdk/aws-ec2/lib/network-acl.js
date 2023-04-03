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
_a = JSII_RTTI_SYMBOL_1;
NetworkAcl[_a] = { fqn: "@aws-cdk/aws-ec2.NetworkAcl", version: "0.0.0" };
exports.NetworkAcl = NetworkAcl;
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
_b = JSII_RTTI_SYMBOL_1;
NetworkAclEntry[_b] = { fqn: "@aws-cdk/aws-ec2.NetworkAclEntry", version: "0.0.0" };
exports.NetworkAclEntry = NetworkAclEntry;
/**
 * Associate a network ACL with a subnet
 *
 *
 */
class SubnetNetworkAclAssociationBase extends core_1.Resource {
}
class SubnetNetworkAclAssociation extends SubnetNetworkAclAssociationBase {
    static fromSubnetNetworkAclAssociationAssociationId(scope, id, subnetNetworkAclAssociationAssociationId) {
        class Import extends SubnetNetworkAclAssociationBase {
            constructor() {
                super(...arguments);
                this.subnetNetworkAclAssociationAssociationId = subnetNetworkAclAssociationAssociationId;
            }
        }
        return new Import(scope, id);
    }
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
}
_c = JSII_RTTI_SYMBOL_1;
SubnetNetworkAclAssociation[_c] = { fqn: "@aws-cdk/aws-ec2.SubnetNetworkAclAssociation", version: "0.0.0" };
exports.SubnetNetworkAclAssociation = SubnetNetworkAclAssociation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1hY2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXR3b3JrLWFjbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBb0Q7QUFFcEQsbURBQW9HO0FBc0JwRzs7OztHQUlHO0FBQ0gsTUFBZSxjQUFlLFNBQVEsZUFBUTtJQUc1Qzs7T0FFRztJQUNJLFFBQVEsQ0FBQyxFQUFVLEVBQUUsT0FBcUM7UUFDL0QsT0FBTyxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ25DLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLEdBQUcsT0FBTztTQUNYLENBQUMsQ0FBQztLQUNKO0NBRUY7QUFrQ0Q7Ozs7Ozs7R0FPRztBQUNILE1BQWEsVUFBVyxTQUFRLGNBQWM7SUFDNUM7O09BRUc7SUFDSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsWUFBb0I7UUFDL0UsTUFBTSxNQUFPLFNBQVEsY0FBYztZQUFuQzs7Z0JBQ2tCLGlCQUFZLEdBQUcsWUFBWSxDQUFDO1lBQzlDLENBQUM7U0FBQTtRQUVELE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzlCO0lBbUJELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLGNBQWM7U0FDbkMsQ0FBQyxDQUFDOzs7Ozs7K0NBaENNLFVBQVU7Ozs7UUFrQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUVyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksNkJBQWEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BELEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUs7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztRQUN4QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBRTdDLElBQUksS0FBSyxDQUFDLGVBQWUsS0FBSyxTQUFTLEVBQUU7WUFDdkMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUN2RTtLQUNGO0lBRUQ7O09BRUc7SUFDSSxtQkFBbUIsQ0FBQyxFQUFVLEVBQUUsU0FBMEI7Ozs7Ozs7Ozs7UUFDL0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbEQsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ3BDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDdEM7S0FDRjs7OztBQXhEVSxnQ0FBVTtBQTJEdkI7Ozs7R0FJRztBQUNILElBQVksTUFVWDtBQVZELFdBQVksTUFBTTtJQUNoQjs7T0FFRztJQUNILHlCQUFlLENBQUE7SUFFZjs7T0FFRztJQUNILHVCQUFhLENBQUE7QUFDZixDQUFDLEVBVlcsTUFBTSxHQUFOLGNBQU0sS0FBTixjQUFNLFFBVWpCO0FBZUQ7Ozs7R0FJRztBQUNILE1BQWUsbUJBQW9CLFNBQVEsZUFBUTtDQUVsRDtBQUVEOzs7O0dBSUc7QUFDSCxJQUFZLGdCQVVYO0FBVkQsV0FBWSxnQkFBZ0I7SUFDMUI7O09BRUc7SUFDSCwyREFBTSxDQUFBO0lBRU47O09BRUc7SUFDSCw2REFBTyxDQUFBO0FBQ1QsQ0FBQyxFQVZXLGdCQUFnQixHQUFoQix3QkFBZ0IsS0FBaEIsd0JBQWdCLFFBVTNCO0FBZ0VEOzs7O0dBSUc7QUFDSCxNQUFhLGVBQWdCLFNBQVEsbUJBQW1CO0lBR3RELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMkI7UUFDbkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLG1CQUFtQjtTQUN4QyxDQUFDLENBQUM7Ozs7OzsrQ0FOTSxlQUFlOzs7O1FBUXhCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUVuQyxJQUFJLGtDQUFrQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDdkMsWUFBWSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWTtZQUMxQyxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7WUFDNUIsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDLEtBQUs7WUFDNUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxLQUFLLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUztZQUMvRixHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFO1lBQ2xDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7U0FDN0IsQ0FBQyxDQUFDO0tBQ0o7Ozs7QUFsQlUsMENBQWU7QUFnRTVCOzs7O0dBSUc7QUFDSCxNQUFlLCtCQUFnQyxTQUFRLGVBQVE7Q0FFOUQ7QUFDRCxNQUFhLDJCQUE0QixTQUFRLCtCQUErQjtJQUN2RSxNQUFNLENBQUMsNENBQTRDLENBQ3hELEtBQWdCLEVBQUUsRUFBVSxFQUM1Qix3Q0FBZ0Q7UUFDaEQsTUFBTSxNQUFPLFNBQVEsK0JBQStCO1lBQXBEOztnQkFDa0IsNkNBQXdDLEdBQUcsd0NBQXdDLENBQUM7WUFDdEcsQ0FBQztTQUFBO1FBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7SUFxQkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF1QztRQUMvRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxLQUFLLENBQUMsK0JBQStCO1NBQ3BELENBQUMsQ0FBQzs7Ozs7OytDQWpDTSwyQkFBMkI7Ozs7UUFtQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSw4Q0FBOEIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3RFLFlBQVksRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLFlBQVk7WUFDM0MsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUTtTQUNoQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksQ0FBQyx3Q0FBd0MsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDO0tBQ3BGOzs7O0FBM0NVLGtFQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElSZXNvdXJjZSwgUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuTmV0d29ya0FjbCwgQ2ZuTmV0d29ya0FjbEVudHJ5LCBDZm5TdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb24gfSBmcm9tICcuL2VjMi5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQWNsQ2lkciwgQWNsVHJhZmZpYyB9IGZyb20gJy4vbmV0d29yay1hY2wtdHlwZXMnO1xuaW1wb3J0IHsgSVN1Ym5ldCwgSVZwYywgU3VibmV0U2VsZWN0aW9uIH0gZnJvbSAnLi92cGMnO1xuXG4vKipcbiAqIEEgTmV0d29ya0FjbFxuICpcbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSU5ldHdvcmtBY2wgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogSUQgZm9yIHRoZSBjdXJyZW50IE5ldHdvcmsgQUNMXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IG5ldHdvcmtBY2xJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZW50cnkgdG8gdGhlIEFDTFxuICAgKi9cbiAgYWRkRW50cnkoaWQ6IHN0cmluZywgb3B0aW9uczogQ29tbW9uTmV0d29ya0FjbEVudHJ5T3B0aW9ucyk6IE5ldHdvcmtBY2xFbnRyeTtcbn1cblxuLyoqXG4gKiBBIE5ldHdvcmtBY2xCYXNlIHRoYXQgaXMgbm90IGNyZWF0ZWQgaW4gdGhpcyB0ZW1wbGF0ZVxuICpcbiAqXG4gKi9cbmFic3RyYWN0IGNsYXNzIE5ldHdvcmtBY2xCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJTmV0d29ya0FjbCB7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBuZXR3b3JrQWNsSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogQWRkIGEgbmV3IGVudHJ5IHRvIHRoZSBBQ0xcbiAgICovXG4gIHB1YmxpYyBhZGRFbnRyeShpZDogc3RyaW5nLCBvcHRpb25zOiBDb21tb25OZXR3b3JrQWNsRW50cnlPcHRpb25zKTogTmV0d29ya0FjbEVudHJ5IHtcbiAgICByZXR1cm4gbmV3IE5ldHdvcmtBY2xFbnRyeSh0aGlzLCBpZCwge1xuICAgICAgbmV0d29ya0FjbDogdGhpcyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cblxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gY3JlYXRlIE5ldHdvcmtBY2xcbiAqXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtBY2xQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgTmV0d29ya0FjbC5cbiAgICpcbiAgICogSXQgaXMgbm90IHJlY29tbWVuZGVkIHRvIHVzZSBhbiBleHBsaWNpdCBuYW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCBJZiB5b3UgZG9uJ3Qgc3BlY2lmeSBhIG5ldHdvcmtBY2xOYW1lLCBBV1MgQ2xvdWRGb3JtYXRpb24gZ2VuZXJhdGVzIGFcbiAgICogdW5pcXVlIHBoeXNpY2FsIElEIGFuZCB1c2VzIHRoYXQgSUQgZm9yIHRoZSBncm91cCBuYW1lLlxuICAgKi9cbiAgcmVhZG9ubHkgbmV0d29ya0FjbE5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBWUEMgaW4gd2hpY2ggdG8gY3JlYXRlIHRoZSBOZXR3b3JrQUNMLlxuICAgKi9cbiAgcmVhZG9ubHkgdnBjOiBJVnBjO1xuXG4gIC8qKlxuICAgKiBTdWJuZXRzIGluIHRoZSBnaXZlbiBWUEMgdG8gYXNzb2NpYXRlIHRoZSBBQ0wgd2l0aFxuICAgKlxuICAgKiBNb3JlIHN1Ym5ldHMgY2FuIGFsd2F5cyBiZSBhZGRlZCBsYXRlciBieSBjYWxsaW5nXG4gICAqIGBhc3NvY2lhdGVXaXRoU3VibmV0cygpYC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBzdWJuZXRzIGFzc29jaWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHN1Ym5ldFNlbGVjdGlvbj86IFN1Ym5ldFNlbGVjdGlvbjtcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBuZXcgY3VzdG9tIG5ldHdvcmsgQUNMXG4gKlxuICogQnkgZGVmYXVsdCwgd2lsbCBkZW55IGFsbCBpbmJvdW5kIGFuZCBvdXRib3VuZCB0cmFmZmljIHVubGVzcyBlbnRyaWVzIGFyZVxuICogYWRkZWQgZXhwbGljaXRseSBhbGxvd2luZyBpdC5cbiAqXG4gKlxuICovXG5leHBvcnQgY2xhc3MgTmV0d29ya0FjbCBleHRlbmRzIE5ldHdvcmtBY2xCYXNlIHtcbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBOZXR3b3JrQWNsIGludG8gdGhpcyBhcHAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21OZXR3b3JrQWNsSWQoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgbmV0d29ya0FjbElkOiBzdHJpbmcpOiBJTmV0d29ya0FjbCB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgTmV0d29ya0FjbEJhc2Uge1xuICAgICAgcHVibGljIHJlYWRvbmx5IG5ldHdvcmtBY2xJZCA9IG5ldHdvcmtBY2xJZDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgTmV0d29ya0FDTFxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbmV0d29ya0FjbElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBWUEMgSUQgZm9yIHRoaXMgTmV0d29ya0FDTFxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbmV0d29ya0FjbFZwY0lkOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBuZXR3b3JrQWNsOiBDZm5OZXR3b3JrQWNsO1xuICBwcml2YXRlIHJlYWRvbmx5IHZwYzogSVZwYztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTmV0d29ya0FjbFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLm5ldHdvcmtBY2xOYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy52cGMgPSBwcm9wcy52cGM7XG5cbiAgICB0aGlzLm5ldHdvcmtBY2wgPSBuZXcgQ2ZuTmV0d29ya0FjbCh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICB2cGNJZDogcHJvcHMudnBjLnZwY0lkLFxuICAgIH0pO1xuXG4gICAgdGhpcy5uZXR3b3JrQWNsSWQgPSB0aGlzLm5ldHdvcmtBY2wucmVmO1xuICAgIHRoaXMubmV0d29ya0FjbFZwY0lkID0gdGhpcy5uZXR3b3JrQWNsLnZwY0lkO1xuXG4gICAgaWYgKHByb3BzLnN1Ym5ldFNlbGVjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmFzc29jaWF0ZVdpdGhTdWJuZXQoJ0RlZmF1bHRBc3NvY2lhdGlvbicsIHByb3BzLnN1Ym5ldFNlbGVjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFzc29jaWF0ZSB0aGUgQUNMIHdpdGggYSBnaXZlbiBzZXQgb2Ygc3VibmV0c1xuICAgKi9cbiAgcHVibGljIGFzc29jaWF0ZVdpdGhTdWJuZXQoaWQ6IHN0cmluZywgc2VsZWN0aW9uOiBTdWJuZXRTZWxlY3Rpb24pIHtcbiAgICBjb25zdCBzdWJuZXRzID0gdGhpcy52cGMuc2VsZWN0U3VibmV0cyhzZWxlY3Rpb24pO1xuICAgIGZvciAoY29uc3Qgc3VibmV0IG9mIHN1Ym5ldHMuc3VibmV0cykge1xuICAgICAgc3VibmV0LmFzc29jaWF0ZU5ldHdvcmtBY2woaWQsIHRoaXMpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFdoYXQgYWN0aW9uIHRvIGFwcGx5IHRvIHRyYWZmaWMgbWF0Y2hpbmcgdGhlIEFDTFxuICpcbiAqXG4gKi9cbmV4cG9ydCBlbnVtIEFjdGlvbiB7XG4gIC8qKlxuICAgKiBBbGxvdyB0aGUgdHJhZmZpY1xuICAgKi9cbiAgQUxMT1cgPSAnYWxsb3cnLFxuXG4gIC8qKlxuICAgKiBEZW55IHRoZSB0cmFmZmljXG4gICAqL1xuICBERU5ZID0gJ2RlbnknLFxufVxuXG4vKipcbiAqIEEgTmV0d29ya0FjbEVudHJ5XG4gKlxuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTmV0d29ya0FjbEVudHJ5IGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBuZXR3b3JrIEFDTC5cbiAgICovXG4gIHJlYWRvbmx5IG5ldHdvcmtBY2w6IElOZXR3b3JrQWNsXG5cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBOZXR3b3JrQWNsRW50cmllc1xuICpcbiAqXG4gKi9cbmFic3RyYWN0IGNsYXNzIE5ldHdvcmtBY2xFbnRyeUJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElOZXR3b3JrQWNsRW50cnkge1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgbmV0d29ya0FjbDogSU5ldHdvcmtBY2w7XG59XG5cbi8qKlxuICogRGlyZWN0aW9uIG9mIHRyYWZmaWMgdGhlIEFjbEVudHJ5IGFwcGxpZXMgdG9cbiAqXG4gKlxuICovXG5leHBvcnQgZW51bSBUcmFmZmljRGlyZWN0aW9uIHtcbiAgLyoqXG4gICAqIFRyYWZmaWMgbGVhdmluZyB0aGUgc3VibmV0XG4gICAqL1xuICBFR1JFU1MsXG5cbiAgLyoqXG4gICAqIFRyYWZmaWMgZW50ZXJpbmcgdGhlIHN1Ym5ldFxuICAgKi9cbiAgSU5HUkVTUyxcbn1cblxuLyoqXG4gKiBCYXNpYyBOZXR3b3JrQUNMIGVudHJ5IHByb3BzXG4gKlxuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb21tb25OZXR3b3JrQWNsRW50cnlPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBOZXR3b3JrQWNsRW50cnkuXG4gICAqXG4gICAqIEl0IGlzIG5vdCByZWNvbW1lbmRlZCB0byB1c2UgYW4gZXhwbGljaXQgZ3JvdXAgbmFtZS5cbiAgICpcbiAgICogQGRlZmF1bHQgSWYgeW91IGRvbid0IHNwZWNpZnkgYSBOZXR3b3JrQWNsTmFtZSwgQVdTIENsb3VkRm9ybWF0aW9uIGdlbmVyYXRlcyBhXG4gICAqIHVuaXF1ZSBwaHlzaWNhbCBJRCBhbmQgdXNlcyB0aGF0IElEIGZvciB0aGUgZ3JvdXAgbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IG5ldHdvcmtBY2xFbnRyeU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBDSURSIHJhbmdlIHRvIGFsbG93IG9yIGRlbnkuXG4gICAqL1xuICByZWFkb25seSBjaWRyOiBBY2xDaWRyO1xuXG4gIC8qKlxuICAgKiBXaGF0IGtpbmQgb2YgdHJhZmZpYyB0aGlzIEFDTCBydWxlIGFwcGxpZXMgdG9cbiAgICovXG4gIHJlYWRvbmx5IHRyYWZmaWM6IEFjbFRyYWZmaWM7XG5cbiAgLyoqXG4gICAqIFRyYWZmaWMgZGlyZWN0aW9uLCB3aXRoIHJlc3BlY3QgdG8gdGhlIHN1Ym5ldCwgdGhpcyBydWxlIGFwcGxpZXMgdG9cbiAgICpcbiAgICogQGRlZmF1bHQgVHJhZmZpY0RpcmVjdGlvbi5JTkdSRVNTXG4gICAqL1xuICByZWFkb25seSBkaXJlY3Rpb24/OiBUcmFmZmljRGlyZWN0aW9uO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGFsbG93IG9yIGRlbnkgdHJhZmZpYyB0aGF0IG1hdGNoZXMgdGhlIHJ1bGU7IHZhbGlkIHZhbHVlcyBhcmUgXCJhbGxvd1wiIG9yIFwiZGVueVwiLlxuICAgKlxuICAgKiBBbnkgdHJhZmZpYyB0aGF0IGlzIG5vdCBleHBsaWNpdGx5IGFsbG93ZWQgaXMgYXV0b21hdGljYWxseSBkZW5pZWQgaW4gYSBjdXN0b21cbiAgICogQUNMLCBhbGwgdHJhZmZpYyBpcyBhdXRvbWF0aWNhbGx5IGFsbG93ZWQgaW4gYSBkZWZhdWx0IEFDTC5cbiAgICpcbiAgICogQGRlZmF1bHQgQUxMT1dcbiAgICovXG4gIHJlYWRvbmx5IHJ1bGVBY3Rpb24/OiBBY3Rpb247XG5cbiAgLyoqXG4gICAqIFJ1bGUgbnVtYmVyIHRvIGFzc2lnbiB0byB0aGUgZW50cnksIHN1Y2ggYXMgMTAwLiBBQ0wgZW50cmllcyBhcmUgcHJvY2Vzc2VkIGluIGFzY2VuZGluZyBvcmRlciBieSBydWxlIG51bWJlci5cbiAgICogRW50cmllcyBjYW4ndCB1c2UgdGhlIHNhbWUgcnVsZSBudW1iZXIgdW5sZXNzIG9uZSBpcyBhbiBlZ3Jlc3MgcnVsZSBhbmQgdGhlIG90aGVyIGlzIGFuIGluZ3Jlc3MgcnVsZS5cbiAgICovXG4gIHJlYWRvbmx5IHJ1bGVOdW1iZXI6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHRvIGNyZWF0ZSBOZXR3b3JrQWNsRW50cnlcbiAqXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtBY2xFbnRyeVByb3BzIGV4dGVuZHMgQ29tbW9uTmV0d29ya0FjbEVudHJ5T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbmV0d29yayBBQ0wgdGhpcyBlbnRyeSBhcHBsaWVzIHRvLlxuICAgKi9cbiAgcmVhZG9ubHkgbmV0d29ya0FjbDogSU5ldHdvcmtBY2w7XG59XG5cbi8qKlxuICogRGVmaW5lIGFuIGVudHJ5IGluIGEgTmV0d29yayBBQ0wgdGFibGVcbiAqXG4gKlxuICovXG5leHBvcnQgY2xhc3MgTmV0d29ya0FjbEVudHJ5IGV4dGVuZHMgTmV0d29ya0FjbEVudHJ5QmFzZSB7XG4gIHB1YmxpYyByZWFkb25seSBuZXR3b3JrQWNsOiBJTmV0d29ya0FjbDtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTmV0d29ya0FjbEVudHJ5UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMubmV0d29ya0FjbEVudHJ5TmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMubmV0d29ya0FjbCA9IHByb3BzLm5ldHdvcmtBY2w7XG5cbiAgICBuZXcgQ2ZuTmV0d29ya0FjbEVudHJ5KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIG5ldHdvcmtBY2xJZDogdGhpcy5uZXR3b3JrQWNsLm5ldHdvcmtBY2xJZCxcbiAgICAgIHJ1bGVOdW1iZXI6IHByb3BzLnJ1bGVOdW1iZXIsXG4gICAgICBydWxlQWN0aW9uOiBwcm9wcy5ydWxlQWN0aW9uID8/IEFjdGlvbi5BTExPVyxcbiAgICAgIGVncmVzczogcHJvcHMuZGlyZWN0aW9uICE9PSB1bmRlZmluZWQgPyBwcm9wcy5kaXJlY3Rpb24gPT09IFRyYWZmaWNEaXJlY3Rpb24uRUdSRVNTIDogdW5kZWZpbmVkLFxuICAgICAgLi4ucHJvcHMudHJhZmZpYy50b1RyYWZmaWNDb25maWcoKSxcbiAgICAgIC4uLnByb3BzLmNpZHIudG9DaWRyQ29uZmlnKCksXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIFN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvblxuICpcbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbiBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBJRCBmb3IgdGhlIGN1cnJlbnQgU3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbkFzc29jaWF0aW9uSWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHRvIGNyZWF0ZSBhIFN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvblxuICpcbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIFN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbi5cbiAgICpcbiAgICogSXQgaXMgbm90IHJlY29tbWVuZGVkIHRvIHVzZSBhbiBleHBsaWNpdCBuYW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCBJZiB5b3UgZG9uJ3Qgc3BlY2lmeSBhIFN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbk5hbWUsIEFXUyBDbG91ZEZvcm1hdGlvbiBnZW5lcmF0ZXMgYVxuICAgKiB1bmlxdWUgcGh5c2ljYWwgSUQgYW5kIHVzZXMgdGhhdCBJRCBmb3IgdGhlIGdyb3VwIG5hbWUuXG4gICAqL1xuICByZWFkb25seSBzdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb25OYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgTmV0d29yayBBQ0wgdGhpcyBhc3NvY2lhdGlvbiBpcyBkZWZpbmVkIGZvclxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBuZXR3b3JrQWNsOiBJTmV0d29ya0FjbDtcblxuICAvKipcbiAgICogSUQgb2YgdGhlIFN1Ym5ldFxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBzdWJuZXQ6IElTdWJuZXQ7XG59XG5cbi8qKlxuICogQXNzb2NpYXRlIGEgbmV0d29yayBBQ0wgd2l0aCBhIHN1Ym5ldFxuICpcbiAqXG4gKi9cbmFic3RyYWN0IGNsYXNzIFN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbkJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElTdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb24ge1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgc3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uQXNzb2NpYXRpb25JZDogc3RyaW5nO1xufVxuZXhwb3J0IGNsYXNzIFN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbiBleHRlbmRzIFN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbkJhc2Uge1xuICBwdWJsaWMgc3RhdGljIGZyb21TdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb25Bc3NvY2lhdGlvbklkKFxuICAgIHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsXG4gICAgc3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uQXNzb2NpYXRpb25JZDogc3RyaW5nKTogSVN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbiB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgU3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgc3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uQXNzb2NpYXRpb25JZCA9IHN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbkFzc29jaWF0aW9uSWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuICAvKipcbiAgICogSUQgZm9yIHRoZSBjdXJyZW50IFN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvblxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uQXNzb2NpYXRpb25JZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJRCBmb3IgdGhlIGN1cnJlbnQgTmV0d29yayBBQ0xcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG5ldHdvcmtBY2w6IElOZXR3b3JrQWNsO1xuXG4gIC8qKlxuICAgKiBJRCBvZiB0aGUgU3VibmV0XG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzdWJuZXQ6IElTdWJuZXQ7XG5cbiAgcHJpdmF0ZSBhc3NvY2lhdGlvbjogQ2ZuU3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb25Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5zdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb25OYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5hc3NvY2lhdGlvbiA9IG5ldyBDZm5TdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb24odGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbmV0d29ya0FjbElkOiBwcm9wcy5uZXR3b3JrQWNsLm5ldHdvcmtBY2xJZCxcbiAgICAgIHN1Ym5ldElkOiBwcm9wcy5zdWJuZXQuc3VibmV0SWQsXG4gICAgfSk7XG5cbiAgICB0aGlzLm5ldHdvcmtBY2wgPSBwcm9wcy5uZXR3b3JrQWNsO1xuICAgIHRoaXMuc3VibmV0ID0gcHJvcHMuc3VibmV0O1xuICAgIHRoaXMuc3VibmV0TmV0d29ya0FjbEFzc29jaWF0aW9uQXNzb2NpYXRpb25JZCA9IHRoaXMuYXNzb2NpYXRpb24uYXR0ckFzc29jaWF0aW9uSWQ7XG4gIH1cbn1cbiJdfQ==