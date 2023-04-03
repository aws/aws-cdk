"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPoolIdentityProviderBase = void 0;
const core_1 = require("@aws-cdk/core");
const attr_names_1 = require("../../private/attr-names");
/**
 * Options to integrate with the various social identity providers.
 *
 * @internal
 */
class UserPoolIdentityProviderBase extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        props.userPool.registerIdentityProvider(this);
    }
    configureAttributeMapping() {
        if (!this.props.attributeMapping) {
            return undefined;
        }
        let mapping = {};
        mapping = Object.entries(this.props.attributeMapping)
            .filter(([k, _]) => k !== 'custom') // 'custom' handled later separately
            .reduce((agg, [k, v]) => {
            return { ...agg, [attr_names_1.StandardAttributeNames[k]]: v.attributeName };
        }, mapping);
        if (this.props.attributeMapping.custom) {
            mapping = Object.entries(this.props.attributeMapping.custom).reduce((agg, [k, v]) => {
                return { ...agg, [k]: v.attributeName };
            }, mapping);
        }
        if (Object.keys(mapping).length === 0) {
            return undefined;
        }
        return mapping;
    }
}
exports.UserPoolIdentityProviderBase = UserPoolIdentityProviderBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wb29sLWlkcC1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci1wb29sLWlkcC1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUF5QztBQUV6Qyx5REFBa0U7QUFJbEU7Ozs7R0FJRztBQUNILE1BQXNCLDRCQUE2QixTQUFRLGVBQVE7SUFHakUsWUFBbUIsS0FBZ0IsRUFBRSxFQUFVLEVBQW1CLEtBQW9DO1FBQ3BHLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFEK0MsVUFBSyxHQUFMLEtBQUssQ0FBK0I7UUFFcEcsS0FBSyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMvQztJQUVTLHlCQUF5QjtRQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRTtZQUNoQyxPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUVELElBQUksT0FBTyxHQUE4QixFQUFFLENBQUM7UUFDNUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQzthQUNsRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLG9DQUFvQzthQUN2RSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUN0QixPQUFPLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxtQ0FBc0IsQ0FBQyxDQUFxQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdEYsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRTtZQUN0QyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNsRixPQUFPLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDMUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ2I7UUFDRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUFFLE9BQU8sU0FBUyxDQUFDO1NBQUU7UUFDNUQsT0FBTyxPQUFPLENBQUM7S0FDaEI7Q0FDRjtBQTNCRCxvRUEyQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBTdGFuZGFyZEF0dHJpYnV0ZU5hbWVzIH0gZnJvbSAnLi4vLi4vcHJpdmF0ZS9hdHRyLW5hbWVzJztcbmltcG9ydCB7IElVc2VyUG9vbElkZW50aXR5UHJvdmlkZXIgfSBmcm9tICcuLi8uLi91c2VyLXBvb2wtaWRwJztcbmltcG9ydCB7IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclByb3BzLCBBdHRyaWJ1dGVNYXBwaW5nIH0gZnJvbSAnLi4vYmFzZSc7XG5cbi8qKlxuICogT3B0aW9ucyB0byBpbnRlZ3JhdGUgd2l0aCB0aGUgdmFyaW91cyBzb2NpYWwgaWRlbnRpdHkgcHJvdmlkZXJzLlxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyQmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVVzZXJQb29sSWRlbnRpdHlQcm92aWRlciB7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBwcm92aWRlck5hbWU6IHN0cmluZztcblxuICBwdWJsaWMgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBwcm9wczogVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIHByb3BzLnVzZXJQb29sLnJlZ2lzdGVySWRlbnRpdHlQcm92aWRlcih0aGlzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb25maWd1cmVBdHRyaWJ1dGVNYXBwaW5nKCk6IGFueSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmF0dHJpYnV0ZU1hcHBpbmcpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHR5cGUgU2Fuc0N1c3RvbSA9IE9taXQ8QXR0cmlidXRlTWFwcGluZywgJ2N1c3RvbSc+O1xuICAgIGxldCBtYXBwaW5nOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgbWFwcGluZyA9IE9iamVjdC5lbnRyaWVzKHRoaXMucHJvcHMuYXR0cmlidXRlTWFwcGluZylcbiAgICAgIC5maWx0ZXIoKFtrLCBfXSkgPT4gayAhPT0gJ2N1c3RvbScpIC8vICdjdXN0b20nIGhhbmRsZWQgbGF0ZXIgc2VwYXJhdGVseVxuICAgICAgLnJlZHVjZSgoYWdnLCBbaywgdl0pID0+IHtcbiAgICAgICAgcmV0dXJuIHsgLi4uYWdnLCBbU3RhbmRhcmRBdHRyaWJ1dGVOYW1lc1trIGFzIGtleW9mIFNhbnNDdXN0b21dXTogdi5hdHRyaWJ1dGVOYW1lIH07XG4gICAgICB9LCBtYXBwaW5nKTtcbiAgICBpZiAodGhpcy5wcm9wcy5hdHRyaWJ1dGVNYXBwaW5nLmN1c3RvbSkge1xuICAgICAgbWFwcGluZyA9IE9iamVjdC5lbnRyaWVzKHRoaXMucHJvcHMuYXR0cmlidXRlTWFwcGluZy5jdXN0b20pLnJlZHVjZSgoYWdnLCBbaywgdl0pID0+IHtcbiAgICAgICAgcmV0dXJuIHsgLi4uYWdnLCBba106IHYuYXR0cmlidXRlTmFtZSB9O1xuICAgICAgfSwgbWFwcGluZyk7XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyhtYXBwaW5nKS5sZW5ndGggPT09IDApIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIHJldHVybiBtYXBwaW5nO1xuICB9XG59Il19