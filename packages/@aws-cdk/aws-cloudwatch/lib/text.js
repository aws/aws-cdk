"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextWidget = exports.TextWidgetBackground = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const widget_1 = require("./widget");
/**
 * Background types available
 */
var TextWidgetBackground;
(function (TextWidgetBackground) {
    /**
     * Solid background
     */
    TextWidgetBackground["SOLID"] = "solid";
    /**
    * Transparent background
    */
    TextWidgetBackground["TRANSPARENT"] = "transparent";
})(TextWidgetBackground = exports.TextWidgetBackground || (exports.TextWidgetBackground = {}));
/**
 * A dashboard widget that displays MarkDown
 */
class TextWidget extends widget_1.ConcreteWidget {
    constructor(props) {
        super(props.width || 6, props.height || 2);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_TextWidgetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, TextWidget);
            }
            throw error;
        }
        this.markdown = props.markdown;
        this.background = props.background;
    }
    position(x, y) {
        this.x = x;
        this.y = y;
    }
    toJson() {
        return [{
                type: 'text',
                width: this.width,
                height: this.height,
                x: this.x,
                y: this.y,
                properties: {
                    markdown: this.markdown,
                    background: this.background,
                },
            }];
    }
}
exports.TextWidget = TextWidget;
_a = JSII_RTTI_SYMBOL_1;
TextWidget[_a] = { fqn: "@aws-cdk/aws-cloudwatch.TextWidget", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscUNBQTBDO0FBRTFDOztHQUVHO0FBQ0gsSUFBWSxvQkFTWDtBQVRELFdBQVksb0JBQW9CO0lBQzlCOztPQUVHO0lBQ0gsdUNBQWUsQ0FBQTtJQUNmOztNQUVFO0lBQ0YsbURBQTJCLENBQUE7QUFDN0IsQ0FBQyxFQVRXLG9CQUFvQixHQUFwQiw0QkFBb0IsS0FBcEIsNEJBQW9CLFFBUy9CO0FBaUNEOztHQUVHO0FBQ0gsTUFBYSxVQUFXLFNBQVEsdUJBQWM7SUFJNUMsWUFBWSxLQUFzQjtRQUNoQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQzs7Ozs7OytDQUxsQyxVQUFVOzs7O1FBTW5CLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7S0FDcEM7SUFFTSxRQUFRLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDbEMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNaO0lBRU0sTUFBTTtRQUNYLE9BQU8sQ0FBQztnQkFDTixJQUFJLEVBQUUsTUFBTTtnQkFDWixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNULENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDVCxVQUFVLEVBQUU7b0JBQ1YsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUN2QixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7aUJBQzVCO2FBQ0YsQ0FBQyxDQUFDO0tBQ0o7O0FBM0JILGdDQTRCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbmNyZXRlV2lkZ2V0IH0gZnJvbSAnLi93aWRnZXQnO1xuXG4vKipcbiAqIEJhY2tncm91bmQgdHlwZXMgYXZhaWxhYmxlXG4gKi9cbmV4cG9ydCBlbnVtIFRleHRXaWRnZXRCYWNrZ3JvdW5kIHtcbiAgLyoqXG4gICAqIFNvbGlkIGJhY2tncm91bmRcbiAgICovXG4gIFNPTElEID0gJ3NvbGlkJyxcbiAgLyoqXG4gICogVHJhbnNwYXJlbnQgYmFja2dyb3VuZFxuICAqL1xuICBUUkFOU1BBUkVOVCA9ICd0cmFuc3BhcmVudCdcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIFRleHQgd2lkZ2V0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGV4dFdpZGdldFByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSB0ZXh0IHRvIGRpc3BsYXksIGluIE1hcmtEb3duIGZvcm1hdFxuICAgKi9cbiAgcmVhZG9ubHkgbWFya2Rvd246IHN0cmluZztcblxuICAvKipcbiAgICogV2lkdGggb2YgdGhlIHdpZGdldCwgaW4gYSBncmlkIG9mIDI0IHVuaXRzIHdpZGVcbiAgICpcbiAgICogQGRlZmF1bHQgNlxuICAgKi9cbiAgcmVhZG9ubHkgd2lkdGg/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEhlaWdodCBvZiB0aGUgd2lkZ2V0XG4gICAqXG4gICAqIEBkZWZhdWx0IDJcbiAgICovXG4gIHJlYWRvbmx5IGhlaWdodD86IG51bWJlcjtcblxuICAvKipcbiAgICogQmFja2dyb3VuZCBmb3IgdGhlIHdpZGdldFxuICAgKlxuICAgKiBAZGVmYXVsdCBzb2xpZFxuICAgKi9cbiAgcmVhZG9ubHkgYmFja2dyb3VuZD86IFRleHRXaWRnZXRCYWNrZ3JvdW5kO1xufVxuXG4vKipcbiAqIEEgZGFzaGJvYXJkIHdpZGdldCB0aGF0IGRpc3BsYXlzIE1hcmtEb3duXG4gKi9cbmV4cG9ydCBjbGFzcyBUZXh0V2lkZ2V0IGV4dGVuZHMgQ29uY3JldGVXaWRnZXQge1xuICBwcml2YXRlIHJlYWRvbmx5IG1hcmtkb3duOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgYmFja2dyb3VuZD86IFRleHRXaWRnZXRCYWNrZ3JvdW5kO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBUZXh0V2lkZ2V0UHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcy53aWR0aCB8fCA2LCBwcm9wcy5oZWlnaHQgfHwgMik7XG4gICAgdGhpcy5tYXJrZG93biA9IHByb3BzLm1hcmtkb3duO1xuICAgIHRoaXMuYmFja2dyb3VuZCA9IHByb3BzLmJhY2tncm91bmQ7XG4gIH1cblxuICBwdWJsaWMgcG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gIH1cblxuICBwdWJsaWMgdG9Kc29uKCk6IGFueVtdIHtcbiAgICByZXR1cm4gW3tcbiAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIHg6IHRoaXMueCxcbiAgICAgIHk6IHRoaXMueSxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbWFya2Rvd246IHRoaXMubWFya2Rvd24sXG4gICAgICAgIGJhY2tncm91bmQ6IHRoaXMuYmFja2dyb3VuZCxcbiAgICAgIH0sXG4gICAgfV07XG4gIH1cbn1cbiJdfQ==