"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefixList = exports.AddressFamily = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const ec2_generated_1 = require("./ec2.generated");
/**
 * The IP address type.
 */
var AddressFamily;
(function (AddressFamily) {
    AddressFamily["IP_V4"] = "IPv4";
    AddressFamily["IP_V6"] = "IPv6";
})(AddressFamily = exports.AddressFamily || (exports.AddressFamily = {}));
/**
 * The base class for a prefix list
 */
class PrefixListBase extends core_1.Resource {
}
/**
 * A managed prefix list.
 * @resource AWS::EC2::PrefixList
 */
class PrefixList extends PrefixListBase {
    /**
     * Look up prefix list by id.
     *
     */
    static fromPrefixListId(scope, id, prefixListId) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.prefixListId = prefixListId;
            }
        }
        return new Import(scope, id);
    }
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props?.prefixListName ?? core_1.Lazy.string({
                produce: () => core_1.Names.uniqueResourceName(this, { maxLength: 255, allowedSpecialCharacters: '.-_' }),
            }),
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_PrefixListProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, PrefixList);
            }
            throw error;
        }
        if (props?.prefixListName) {
            if (props.prefixListName.startsWith('com.amazonaws')) {
                throw new Error('The name cannot start with \'com.amazonaws.\'');
            }
            ;
            if (props.prefixListName.length > 255) {
                throw new Error('Lengths exceeding 255 characters cannot be set.');
            }
            ;
        }
        ;
        this.prefixListName = this.physicalName;
        let defaultMaxEntries = 1;
        if (props?.entries && props.entries.length > 0) {
            defaultMaxEntries = props.entries.length;
        }
        const prefixList = new ec2_generated_1.CfnPrefixList(this, 'Resource', {
            addressFamily: props?.addressFamily || AddressFamily.IP_V4,
            maxEntries: props?.maxEntries || defaultMaxEntries,
            prefixListName: this.prefixListName,
            entries: props?.entries || [],
        });
        this.prefixListId = prefixList.attrPrefixListId;
        this.prefixListArn = prefixList.attrArn;
        this.ownerId = prefixList.attrOwnerId;
        this.version = prefixList.attrVersion;
        this.addressFamily = prefixList.addressFamily;
    }
}
_a = JSII_RTTI_SYMBOL_1;
PrefixList[_a] = { fqn: "@aws-cdk/aws-ec2.PrefixList", version: "0.0.0" };
exports.PrefixList = PrefixList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LWxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcmVmaXgtbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBaUU7QUFFakUsbURBQWdEO0FBY2hEOztHQUVHO0FBQ0gsSUFBWSxhQUdYO0FBSEQsV0FBWSxhQUFhO0lBQ3ZCLCtCQUFjLENBQUE7SUFDZCwrQkFBYyxDQUFBO0FBQ2hCLENBQUMsRUFIVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQUd4QjtBQTJDRDs7R0FFRztBQUNILE1BQWUsY0FBZSxTQUFRLGVBQVE7Q0FPN0M7QUFFRDs7O0dBR0c7QUFDSCxNQUFhLFVBQVcsU0FBUSxjQUFjO0lBQzVDOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxZQUFvQjtRQUMvRSxNQUFNLE1BQU8sU0FBUSxlQUFRO1lBQTdCOztnQkFDa0IsaUJBQVksR0FBRyxZQUFZLENBQUM7WUFDOUMsQ0FBQztTQUFBO1FBQ0QsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7SUF3Q0QsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF1QjtRQUMvRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxLQUFLLEVBQUUsY0FBYyxJQUFJLFdBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ2pELE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxZQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSx3QkFBd0IsRUFBRSxLQUFLLEVBQUUsQ0FBQzthQUNuRyxDQUFDO1NBQ0gsQ0FBQyxDQUFDOzs7Ozs7K0NBdkRNLFVBQVU7Ozs7UUF5RG5CLElBQUksS0FBSyxFQUFFLGNBQWMsRUFBRTtZQUN6QixJQUFLLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxFQUFFO2dCQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7YUFDbEU7WUFBQSxDQUFDO1lBQ0YsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUc7Z0JBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQzthQUNwRTtZQUFBLENBQUM7U0FDSDtRQUFBLENBQUM7UUFFRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFFeEMsSUFBSSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDMUIsSUFBSSxLQUFLLEVBQUUsT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM5QyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztTQUMxQztRQUVELE1BQU0sVUFBVSxHQUFHLElBQUksNkJBQWEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3JELGFBQWEsRUFBRSxLQUFLLEVBQUUsYUFBYSxJQUFJLGFBQWEsQ0FBQyxLQUFLO1lBQzFELFVBQVUsRUFBRSxLQUFLLEVBQUUsVUFBVSxJQUFJLGlCQUFpQjtZQUNsRCxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDbkMsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLElBQUksRUFBRTtTQUM5QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNoRCxJQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUM7UUFDeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQztRQUN0QyxJQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7S0FDL0M7Ozs7QUFyRlUsZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJUmVzb3VyY2UsIExhenksIFJlc291cmNlLCBOYW1lcyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5QcmVmaXhMaXN0IH0gZnJvbSAnLi9lYzIuZ2VuZXJhdGVkJztcblxuLyoqXG4gKiBBIHByZWZpeCBsaXN0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVByZWZpeExpc3QgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBwcmVmaXggbGlzdFxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBwcmVmaXhMaXN0SWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBUaGUgSVAgYWRkcmVzcyB0eXBlLlxuICovXG5leHBvcnQgZW51bSBBZGRyZXNzRmFtaWx5IHtcbiAgSVBfVjQgPSAnSVB2NCcsXG4gIElQX1Y2ID0gJ0lQdjYnLFxufVxuXG4vKipcbiAqIE9wdGlvbnMgdG8gYWRkIGEgcHJlZml4IGxpc3RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQcmVmaXhMaXN0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgZW50cmllcyBmb3IgdGhlIHByZWZpeCBsaXN0LlxuICAgKlxuICAgKiBAZGVmYXVsdCBBdXRvbWF0aWNhbGx5LWNhbGN1bGF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IG1heEVudHJpZXM/OiBudW1iZXI7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgY3JlYXRpbmcgYSBwcmVmaXggbGlzdC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQcmVmaXhMaXN0UHJvcHMgZXh0ZW5kcyBQcmVmaXhMaXN0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgYWRkcmVzcyBmYW1pbHkgb2YgdGhlIHByZWZpeCBsaXN0LlxuICAgKlxuICAgKiBAZGVmYXVsdCBBZGRyZXNzRmFtaWx5LklQX1Y0XG4gICAqL1xuICByZWFkb25seSBhZGRyZXNzRmFtaWx5PzogQWRkcmVzc0ZhbWlseTtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHByZWZpeCBsaXN0LlxuICAgKlxuICAgKiBAZGVmYXVsdCBOb25lXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqIEl0IGlzIG5vdCByZWNvbW1lbmRlZCB0byB1c2UgYW4gZXhwbGljaXQgbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IHByZWZpeExpc3ROYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbGlzdCBvZiBlbnRyaWVzIGZvciB0aGUgcHJlZml4IGxpc3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IFtdXG4gICAqL1xuICByZWFkb25seSBlbnRyaWVzPzogQ2ZuUHJlZml4TGlzdC5FbnRyeVByb3BlcnR5W107XG59XG5cbi8qKlxuICogVGhlIGJhc2UgY2xhc3MgZm9yIGEgcHJlZml4IGxpc3RcbiAqL1xuYWJzdHJhY3QgY2xhc3MgUHJlZml4TGlzdEJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElQcmVmaXhMaXN0IHtcbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgcHJlZml4IGxpc3RcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHByZWZpeExpc3RJZDogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgbWFuYWdlZCBwcmVmaXggbGlzdC5cbiAqIEByZXNvdXJjZSBBV1M6OkVDMjo6UHJlZml4TGlzdFxuICovXG5leHBvcnQgY2xhc3MgUHJlZml4TGlzdCBleHRlbmRzIFByZWZpeExpc3RCYXNlIHtcbiAgLyoqXG4gICAqIExvb2sgdXAgcHJlZml4IGxpc3QgYnkgaWQuXG4gICAqXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21QcmVmaXhMaXN0SWQoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJlZml4TGlzdElkOiBzdHJpbmcpOiBJUHJlZml4TGlzdCB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJUHJlZml4TGlzdCB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcHJlZml4TGlzdElkID0gcHJlZml4TGlzdElkO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIHByZWZpeCBsaXN0XG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBwcmVmaXhMaXN0SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHByZWZpeCBsaXN0XG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBwcmVmaXhMaXN0TmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBwcmVmaXggbGlzdFxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcHJlZml4TGlzdEFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgb3duZXIgSUQgb2YgdGhlIHByZWZpeCBsaXN0XG4gICAqXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgb3duZXJJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdmVyc2lvbiBvZiB0aGUgcHJlZml4IGxpc3RcbiAgICpcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2ZXJzaW9uOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBhZGRyZXNzIGZhbWlseSBvZiB0aGUgcHJlZml4IGxpc3RcbiAgICpcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhZGRyZXNzRmFtaWx5OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBQcmVmaXhMaXN0UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHM/LnByZWZpeExpc3ROYW1lID8/IExhenkuc3RyaW5nKHtcbiAgICAgICAgcHJvZHVjZTogKCkgPT4gTmFtZXMudW5pcXVlUmVzb3VyY2VOYW1lKHRoaXMsIHsgbWF4TGVuZ3RoOiAyNTUsIGFsbG93ZWRTcGVjaWFsQ2hhcmFjdGVyczogJy4tXycgfSksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIGlmIChwcm9wcz8ucHJlZml4TGlzdE5hbWUpIHtcbiAgICAgIGlmICggcHJvcHMucHJlZml4TGlzdE5hbWUuc3RhcnRzV2l0aCgnY29tLmFtYXpvbmF3cycpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIG5hbWUgY2Fubm90IHN0YXJ0IHdpdGggXFwnY29tLmFtYXpvbmF3cy5cXCcnKTtcbiAgICAgIH07XG4gICAgICBpZiAocHJvcHMucHJlZml4TGlzdE5hbWUubGVuZ3RoID4gMjU1ICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xlbmd0aHMgZXhjZWVkaW5nIDI1NSBjaGFyYWN0ZXJzIGNhbm5vdCBiZSBzZXQuJyk7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICB0aGlzLnByZWZpeExpc3ROYW1lID0gdGhpcy5waHlzaWNhbE5hbWU7XG5cbiAgICBsZXQgZGVmYXVsdE1heEVudHJpZXMgPSAxO1xuICAgIGlmIChwcm9wcz8uZW50cmllcyAmJiBwcm9wcy5lbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGRlZmF1bHRNYXhFbnRyaWVzID0gcHJvcHMuZW50cmllcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgY29uc3QgcHJlZml4TGlzdCA9IG5ldyBDZm5QcmVmaXhMaXN0KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGFkZHJlc3NGYW1pbHk6IHByb3BzPy5hZGRyZXNzRmFtaWx5IHx8IEFkZHJlc3NGYW1pbHkuSVBfVjQsXG4gICAgICBtYXhFbnRyaWVzOiBwcm9wcz8ubWF4RW50cmllcyB8fCBkZWZhdWx0TWF4RW50cmllcyxcbiAgICAgIHByZWZpeExpc3ROYW1lOiB0aGlzLnByZWZpeExpc3ROYW1lLFxuICAgICAgZW50cmllczogcHJvcHM/LmVudHJpZXMgfHwgW10sXG4gICAgfSk7XG5cbiAgICB0aGlzLnByZWZpeExpc3RJZCA9IHByZWZpeExpc3QuYXR0clByZWZpeExpc3RJZDtcbiAgICB0aGlzLnByZWZpeExpc3RBcm4gPSBwcmVmaXhMaXN0LmF0dHJBcm47XG4gICAgdGhpcy5vd25lcklkID0gcHJlZml4TGlzdC5hdHRyT3duZXJJZDtcbiAgICB0aGlzLnZlcnNpb24gPSBwcmVmaXhMaXN0LmF0dHJWZXJzaW9uO1xuICAgIHRoaXMuYWRkcmVzc0ZhbWlseSA9IHByZWZpeExpc3QuYWRkcmVzc0ZhbWlseTtcbiAgfVxufVxuIl19