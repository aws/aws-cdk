"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerCondition = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * ListenerCondition providers definition.
 */
class ListenerCondition {
    /**
     * Create a host-header listener rule condition
     *
     * @param values Hosts for host headers
     */
    static hostHeaders(values) {
        return new HostHeaderListenerCondition(values);
    }
    /**
     * Create a http-header listener rule condition
     *
     * @param name HTTP header name
     * @param values HTTP header values
     */
    static httpHeader(name, values) {
        return new HttpHeaderListenerCondition(name, values);
    }
    /**
     * Create a http-request-method listener rule condition
     *
     * @param values HTTP request methods
     */
    static httpRequestMethods(values) {
        return new HttpRequestMethodListenerCondition(values);
    }
    /**
     * Create a path-pattern listener rule condition
     *
     * @param values Path patterns
     */
    static pathPatterns(values) {
        return new PathPatternListenerCondition(values);
    }
    /**
     * Create a query-string listener rule condition
     *
     * @param values Query string key/value pairs
     */
    static queryStrings(values) {
        return new QueryStringListenerCondition(values);
    }
    /**
     * Create a source-ip listener rule condition
     *
     * @param values Source ips
     */
    static sourceIps(values) {
        return new SourceIpListenerCondition(values);
    }
}
exports.ListenerCondition = ListenerCondition;
_a = JSII_RTTI_SYMBOL_1;
ListenerCondition[_a] = { fqn: "@aws-cdk/aws-elasticloadbalancingv2.ListenerCondition", version: "0.0.0" };
/**
 * Host header config of the listener rule condition
 */
class HostHeaderListenerCondition extends ListenerCondition {
    constructor(values) {
        super();
        this.values = values;
    }
    renderRawCondition() {
        return {
            field: 'host-header',
            hostHeaderConfig: {
                values: this.values,
            },
        };
    }
}
/**
 * HTTP header config of the listener rule condition
 */
class HttpHeaderListenerCondition extends ListenerCondition {
    constructor(name, values) {
        super();
        this.name = name;
        this.values = values;
    }
    renderRawCondition() {
        return {
            field: 'http-header',
            httpHeaderConfig: {
                httpHeaderName: this.name,
                values: this.values,
            },
        };
    }
}
/**
 * HTTP reqeust method config of the listener rule condition
 */
class HttpRequestMethodListenerCondition extends ListenerCondition {
    constructor(values) {
        super();
        this.values = values;
    }
    renderRawCondition() {
        return {
            field: 'http-request-method',
            httpRequestMethodConfig: {
                values: this.values,
            },
        };
    }
}
/**
 * Path pattern config of the listener rule condition
 */
class PathPatternListenerCondition extends ListenerCondition {
    constructor(values) {
        super();
        this.values = values;
        if (values && values.length > 5) {
            throw new Error("A rule can only have '5' condition values");
        }
    }
    renderRawCondition() {
        return {
            field: 'path-pattern',
            pathPatternConfig: {
                values: this.values,
            },
        };
    }
}
/**
 * Query string config of the listener rule condition
 */
class QueryStringListenerCondition extends ListenerCondition {
    constructor(values) {
        super();
        this.values = values;
    }
    renderRawCondition() {
        return {
            field: 'query-string',
            queryStringConfig: {
                values: this.values,
            },
        };
    }
}
/**
 * Source ip config of the listener rule condition
 */
class SourceIpListenerCondition extends ListenerCondition {
    constructor(values) {
        super();
        this.values = values;
    }
    renderRawCondition() {
        return {
            field: 'source-ip',
            sourceIpConfig: {
                values: this.values,
            },
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZGl0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbmRpdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7R0FFRztBQUNILE1BQXNCLGlCQUFpQjtJQUNyQzs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFnQjtRQUN4QyxPQUFPLElBQUksMkJBQTJCLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDaEQ7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBWSxFQUFFLE1BQWdCO1FBQ3JELE9BQU8sSUFBSSwyQkFBMkIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDdEQ7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLGtCQUFrQixDQUFDLE1BQWdCO1FBQy9DLE9BQU8sSUFBSSxrQ0FBa0MsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN2RDtJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQWdCO1FBQ3pDLE9BQU8sSUFBSSw0QkFBNEIsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNqRDtJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQThCO1FBQ3ZELE9BQU8sSUFBSSw0QkFBNEIsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNqRDtJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQWdCO1FBQ3RDLE9BQU8sSUFBSSx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM5Qzs7QUF0REgsOENBNERDOzs7QUFtQkQ7O0dBRUc7QUFDSCxNQUFNLDJCQUE0QixTQUFRLGlCQUFpQjtJQUN6RCxZQUE0QixNQUFnQjtRQUMxQyxLQUFLLEVBQUUsQ0FBQztRQURrQixXQUFNLEdBQU4sTUFBTSxDQUFVO0tBRTNDO0lBRU0sa0JBQWtCO1FBQ3ZCLE9BQU87WUFDTCxLQUFLLEVBQUUsYUFBYTtZQUNwQixnQkFBZ0IsRUFBRTtnQkFDaEIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2FBQ3BCO1NBQ0YsQ0FBQztLQUNIO0NBQ0Y7QUFFRDs7R0FFRztBQUNILE1BQU0sMkJBQTRCLFNBQVEsaUJBQWlCO0lBQ3pELFlBQTRCLElBQVksRUFBa0IsTUFBZ0I7UUFDeEUsS0FBSyxFQUFFLENBQUM7UUFEa0IsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFrQixXQUFNLEdBQU4sTUFBTSxDQUFVO0tBRXpFO0lBRU0sa0JBQWtCO1FBQ3ZCLE9BQU87WUFDTCxLQUFLLEVBQUUsYUFBYTtZQUNwQixnQkFBZ0IsRUFBRTtnQkFDaEIsY0FBYyxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUN6QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07YUFDcEI7U0FDRixDQUFDO0tBQ0g7Q0FDRjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxrQ0FBbUMsU0FBUSxpQkFBaUI7SUFDaEUsWUFBNEIsTUFBZ0I7UUFDMUMsS0FBSyxFQUFFLENBQUM7UUFEa0IsV0FBTSxHQUFOLE1BQU0sQ0FBVTtLQUUzQztJQUVNLGtCQUFrQjtRQUN2QixPQUFPO1lBQ0wsS0FBSyxFQUFFLHFCQUFxQjtZQUM1Qix1QkFBdUIsRUFBRTtnQkFDdkIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2FBQ3BCO1NBQ0YsQ0FBQztLQUNIO0NBQ0Y7QUFFRDs7R0FFRztBQUNILE1BQU0sNEJBQTZCLFNBQVEsaUJBQWlCO0lBQzFELFlBQTRCLE1BQWdCO1FBQzFDLEtBQUssRUFBRSxDQUFDO1FBRGtCLFdBQU0sR0FBTixNQUFNLENBQVU7UUFFMUMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1NBQzlEO0tBQ0Y7SUFFTSxrQkFBa0I7UUFDdkIsT0FBTztZQUNMLEtBQUssRUFBRSxjQUFjO1lBQ3JCLGlCQUFpQixFQUFFO2dCQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07YUFDcEI7U0FDRixDQUFDO0tBQ0g7Q0FDRjtBQUVEOztHQUVHO0FBQ0gsTUFBTSw0QkFBNkIsU0FBUSxpQkFBaUI7SUFDMUQsWUFBNEIsTUFBOEI7UUFDeEQsS0FBSyxFQUFFLENBQUM7UUFEa0IsV0FBTSxHQUFOLE1BQU0sQ0FBd0I7S0FFekQ7SUFFTSxrQkFBa0I7UUFDdkIsT0FBTztZQUNMLEtBQUssRUFBRSxjQUFjO1lBQ3JCLGlCQUFpQixFQUFFO2dCQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07YUFDcEI7U0FDRixDQUFDO0tBQ0g7Q0FDRjtBQUVEOztHQUVHO0FBQ0gsTUFBTSx5QkFBMEIsU0FBUSxpQkFBaUI7SUFDdkQsWUFBNEIsTUFBZ0I7UUFDMUMsS0FBSyxFQUFFLENBQUM7UUFEa0IsV0FBTSxHQUFOLE1BQU0sQ0FBVTtLQUUzQztJQUVNLGtCQUFrQjtRQUN2QixPQUFPO1lBQ0wsS0FBSyxFQUFFLFdBQVc7WUFDbEIsY0FBYyxFQUFFO2dCQUNkLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTthQUNwQjtTQUNGLENBQUM7S0FDSDtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBMaXN0ZW5lckNvbmRpdGlvbiBwcm92aWRlcnMgZGVmaW5pdGlvbi5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIExpc3RlbmVyQ29uZGl0aW9uIHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIGhvc3QtaGVhZGVyIGxpc3RlbmVyIHJ1bGUgY29uZGl0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZXMgSG9zdHMgZm9yIGhvc3QgaGVhZGVyc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBob3N0SGVhZGVycyh2YWx1ZXM6IHN0cmluZ1tdKTogTGlzdGVuZXJDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgSG9zdEhlYWRlckxpc3RlbmVyQ29uZGl0aW9uKHZhbHVlcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgaHR0cC1oZWFkZXIgbGlzdGVuZXIgcnVsZSBjb25kaXRpb25cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgSFRUUCBoZWFkZXIgbmFtZVxuICAgKiBAcGFyYW0gdmFsdWVzIEhUVFAgaGVhZGVyIHZhbHVlc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBodHRwSGVhZGVyKG5hbWU6IHN0cmluZywgdmFsdWVzOiBzdHJpbmdbXSk6IExpc3RlbmVyQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IEh0dHBIZWFkZXJMaXN0ZW5lckNvbmRpdGlvbihuYW1lLCB2YWx1ZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGh0dHAtcmVxdWVzdC1tZXRob2QgbGlzdGVuZXIgcnVsZSBjb25kaXRpb25cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlcyBIVFRQIHJlcXVlc3QgbWV0aG9kc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBodHRwUmVxdWVzdE1ldGhvZHModmFsdWVzOiBzdHJpbmdbXSk6IExpc3RlbmVyQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IEh0dHBSZXF1ZXN0TWV0aG9kTGlzdGVuZXJDb25kaXRpb24odmFsdWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBwYXRoLXBhdHRlcm4gbGlzdGVuZXIgcnVsZSBjb25kaXRpb25cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlcyBQYXRoIHBhdHRlcm5zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHBhdGhQYXR0ZXJucyh2YWx1ZXM6IHN0cmluZ1tdKTogTGlzdGVuZXJDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgUGF0aFBhdHRlcm5MaXN0ZW5lckNvbmRpdGlvbih2YWx1ZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHF1ZXJ5LXN0cmluZyBsaXN0ZW5lciBydWxlIGNvbmRpdGlvblxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWVzIFF1ZXJ5IHN0cmluZyBrZXkvdmFsdWUgcGFpcnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcXVlcnlTdHJpbmdzKHZhbHVlczogUXVlcnlTdHJpbmdDb25kaXRpb25bXSk6IExpc3RlbmVyQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IFF1ZXJ5U3RyaW5nTGlzdGVuZXJDb25kaXRpb24odmFsdWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBzb3VyY2UtaXAgbGlzdGVuZXIgcnVsZSBjb25kaXRpb25cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlcyBTb3VyY2UgaXBzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNvdXJjZUlwcyh2YWx1ZXM6IHN0cmluZ1tdKTogTGlzdGVuZXJDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgU291cmNlSXBMaXN0ZW5lckNvbmRpdGlvbih2YWx1ZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgcmF3IENmbiBsaXN0ZW5lciBydWxlIGNvbmRpdGlvbiBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVuZGVyUmF3Q29uZGl0aW9uKCk6IGFueTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciB0aGUga2V5L3ZhbHVlIHBhaXIgb2YgdGhlIHF1ZXJ5IHN0cmluZ1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5U3RyaW5nQ29uZGl0aW9uIHtcbiAgLyoqXG4gICAqIFRoZSBxdWVyeSBzdHJpbmcga2V5IGZvciB0aGUgY29uZGl0aW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQW55IGtleSBjYW4gYmUgbWF0Y2hlZC5cbiAgICovXG4gIHJlYWRvbmx5IGtleT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHF1ZXJ5IHN0cmluZyB2YWx1ZSBmb3IgdGhlIGNvbmRpdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgdmFsdWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBIb3N0IGhlYWRlciBjb25maWcgb2YgdGhlIGxpc3RlbmVyIHJ1bGUgY29uZGl0aW9uXG4gKi9cbmNsYXNzIEhvc3RIZWFkZXJMaXN0ZW5lckNvbmRpdGlvbiBleHRlbmRzIExpc3RlbmVyQ29uZGl0aW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHZhbHVlczogc3RyaW5nW10pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIHJlbmRlclJhd0NvbmRpdGlvbigpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWVsZDogJ2hvc3QtaGVhZGVyJyxcbiAgICAgIGhvc3RIZWFkZXJDb25maWc6IHtcbiAgICAgICAgdmFsdWVzOiB0aGlzLnZhbHVlcyxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIEhUVFAgaGVhZGVyIGNvbmZpZyBvZiB0aGUgbGlzdGVuZXIgcnVsZSBjb25kaXRpb25cbiAqL1xuY2xhc3MgSHR0cEhlYWRlckxpc3RlbmVyQ29uZGl0aW9uIGV4dGVuZHMgTGlzdGVuZXJDb25kaXRpb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nLCBwdWJsaWMgcmVhZG9ubHkgdmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyUmF3Q29uZGl0aW9uKCk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpZWxkOiAnaHR0cC1oZWFkZXInLFxuICAgICAgaHR0cEhlYWRlckNvbmZpZzoge1xuICAgICAgICBodHRwSGVhZGVyTmFtZTogdGhpcy5uYW1lLFxuICAgICAgICB2YWx1ZXM6IHRoaXMudmFsdWVzLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogSFRUUCByZXFldXN0IG1ldGhvZCBjb25maWcgb2YgdGhlIGxpc3RlbmVyIHJ1bGUgY29uZGl0aW9uXG4gKi9cbmNsYXNzIEh0dHBSZXF1ZXN0TWV0aG9kTGlzdGVuZXJDb25kaXRpb24gZXh0ZW5kcyBMaXN0ZW5lckNvbmRpdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB2YWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXJSYXdDb25kaXRpb24oKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgZmllbGQ6ICdodHRwLXJlcXVlc3QtbWV0aG9kJyxcbiAgICAgIGh0dHBSZXF1ZXN0TWV0aG9kQ29uZmlnOiB7XG4gICAgICAgIHZhbHVlczogdGhpcy52YWx1ZXMsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBQYXRoIHBhdHRlcm4gY29uZmlnIG9mIHRoZSBsaXN0ZW5lciBydWxlIGNvbmRpdGlvblxuICovXG5jbGFzcyBQYXRoUGF0dGVybkxpc3RlbmVyQ29uZGl0aW9uIGV4dGVuZHMgTGlzdGVuZXJDb25kaXRpb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgaWYgKHZhbHVlcyAmJiB2YWx1ZXMubGVuZ3RoID4gNSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQSBydWxlIGNhbiBvbmx5IGhhdmUgJzUnIGNvbmRpdGlvbiB2YWx1ZXNcIik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlbmRlclJhd0NvbmRpdGlvbigpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWVsZDogJ3BhdGgtcGF0dGVybicsXG4gICAgICBwYXRoUGF0dGVybkNvbmZpZzoge1xuICAgICAgICB2YWx1ZXM6IHRoaXMudmFsdWVzLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogUXVlcnkgc3RyaW5nIGNvbmZpZyBvZiB0aGUgbGlzdGVuZXIgcnVsZSBjb25kaXRpb25cbiAqL1xuY2xhc3MgUXVlcnlTdHJpbmdMaXN0ZW5lckNvbmRpdGlvbiBleHRlbmRzIExpc3RlbmVyQ29uZGl0aW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHZhbHVlczogUXVlcnlTdHJpbmdDb25kaXRpb25bXSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyUmF3Q29uZGl0aW9uKCk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpZWxkOiAncXVlcnktc3RyaW5nJyxcbiAgICAgIHF1ZXJ5U3RyaW5nQ29uZmlnOiB7XG4gICAgICAgIHZhbHVlczogdGhpcy52YWx1ZXMsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBTb3VyY2UgaXAgY29uZmlnIG9mIHRoZSBsaXN0ZW5lciBydWxlIGNvbmRpdGlvblxuICovXG5jbGFzcyBTb3VyY2VJcExpc3RlbmVyQ29uZGl0aW9uIGV4dGVuZHMgTGlzdGVuZXJDb25kaXRpb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyUmF3Q29uZGl0aW9uKCk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpZWxkOiAnc291cmNlLWlwJyxcbiAgICAgIHNvdXJjZUlwQ29uZmlnOiB7XG4gICAgICAgIHZhbHVlczogdGhpcy52YWx1ZXMsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiJdfQ==