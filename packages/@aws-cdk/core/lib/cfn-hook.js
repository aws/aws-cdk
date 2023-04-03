"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnHook = void 0;
const cfn_element_1 = require("./cfn-element");
const util_1 = require("./util");
/**
 * Represents a CloudFormation resource.
 */
class CfnHook extends cfn_element_1.CfnElement {
    /**
     * Creates a new Hook object.
     */
    constructor(scope, id, props) {
        super(scope, id);
        this.type = props.type;
        this._cfnHookProperties = props.properties;
    }
    /** @internal */
    _toCloudFormation() {
        return {
            Hooks: {
                [this.logicalId]: {
                    Type: this.type,
                    Properties: (0, util_1.ignoreEmpty)(this.renderProperties(this._cfnHookProperties)),
                },
            },
        };
    }
    renderProperties(props) {
        return props;
    }
}
exports.CfnHook = CfnHook;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWhvb2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4taG9vay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQ0FBMkM7QUFDM0MsaUNBQXFDO0FBb0JyQzs7R0FFRztBQUNILE1BQWEsT0FBUSxTQUFRLHdCQUFVO0lBU3JDOztPQUVHO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFtQjtRQUMzRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztJQUM3QyxDQUFDO0lBRUQsZ0JBQWdCO0lBQ1QsaUJBQWlCO1FBQ3RCLE9BQU87WUFDTCxLQUFLLEVBQUU7Z0JBQ0wsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7b0JBQ2hCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDZixVQUFVLEVBQUUsSUFBQSxrQkFBVyxFQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztpQkFDeEU7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDO0lBRVMsZ0JBQWdCLENBQUMsS0FBNEI7UUFDckQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0NBQ0Y7QUFsQ0QsMEJBa0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5FbGVtZW50IH0gZnJvbSAnLi9jZm4tZWxlbWVudCc7XG5pbXBvcnQgeyBpZ25vcmVFbXB0eSB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgb2YgYENmbkhvb2tgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkhvb2tQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0aGUgaG9va1xuICAgKiAoZm9yIGV4YW1wbGUsIFwiQVdTOjpDb2RlRGVwbG95OjpCbHVlR3JlZW5cIikuXG4gICAqL1xuICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBob29rLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHByb3BlcnRpZXNcbiAgICovXG4gIHJlYWRvbmx5IHByb3BlcnRpZXM/OiB7IFtuYW1lOiBzdHJpbmddOiBhbnkgfTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5Ib29rIGV4dGVuZHMgQ2ZuRWxlbWVudCB7XG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0aGUgaG9va1xuICAgKiAoZm9yIGV4YW1wbGUsIFwiQVdTOjpDb2RlRGVwbG95OjpCbHVlR3JlZW5cIikuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Nmbkhvb2tQcm9wZXJ0aWVzPzogeyBbbmFtZTogc3RyaW5nXTogYW55IH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgSG9vayBvYmplY3QuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuSG9va1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMudHlwZSA9IHByb3BzLnR5cGU7XG4gICAgdGhpcy5fY2ZuSG9va1Byb3BlcnRpZXMgPSBwcm9wcy5wcm9wZXJ0aWVzO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgX3RvQ2xvdWRGb3JtYXRpb24oKTogb2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgSG9va3M6IHtcbiAgICAgICAgW3RoaXMubG9naWNhbElkXToge1xuICAgICAgICAgIFR5cGU6IHRoaXMudHlwZSxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiBpZ25vcmVFbXB0eSh0aGlzLnJlbmRlclByb3BlcnRpZXModGhpcy5fY2ZuSG9va1Byb3BlcnRpZXMpKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzPzoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cbn1cbiJdfQ==