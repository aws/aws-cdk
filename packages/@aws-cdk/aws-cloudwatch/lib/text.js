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
_a = JSII_RTTI_SYMBOL_1;
TextWidget[_a] = { fqn: "@aws-cdk/aws-cloudwatch.TextWidget", version: "0.0.0" };
exports.TextWidget = TextWidget;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscUNBQTBDO0FBRTFDOztHQUVHO0FBQ0gsSUFBWSxvQkFTWDtBQVRELFdBQVksb0JBQW9CO0lBQzlCOztPQUVHO0lBQ0gsdUNBQWUsQ0FBQTtJQUNmOztNQUVFO0lBQ0YsbURBQTJCLENBQUE7QUFDN0IsQ0FBQyxFQVRXLG9CQUFvQixHQUFwQiw0QkFBb0IsS0FBcEIsNEJBQW9CLFFBUy9CO0FBaUNEOztHQUVHO0FBQ0gsTUFBYSxVQUFXLFNBQVEsdUJBQWM7SUFJNUMsWUFBWSxLQUFzQjtRQUNoQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQzs7Ozs7OytDQUxsQyxVQUFVOzs7O1FBTW5CLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7S0FDcEM7SUFFTSxRQUFRLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDbEMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNaO0lBRU0sTUFBTTtRQUNYLE9BQU8sQ0FBQztnQkFDTixJQUFJLEVBQUUsTUFBTTtnQkFDWixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNULENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDVCxVQUFVLEVBQUU7b0JBQ1YsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUN2QixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7aUJBQzVCO2FBQ0YsQ0FBQyxDQUFDO0tBQ0o7Ozs7QUEzQlUsZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25jcmV0ZVdpZGdldCB9IGZyb20gJy4vd2lkZ2V0JztcblxuLyoqXG4gKiBCYWNrZ3JvdW5kIHR5cGVzIGF2YWlsYWJsZVxuICovXG5leHBvcnQgZW51bSBUZXh0V2lkZ2V0QmFja2dyb3VuZCB7XG4gIC8qKlxuICAgKiBTb2xpZCBiYWNrZ3JvdW5kXG4gICAqL1xuICBTT0xJRCA9ICdzb2xpZCcsXG4gIC8qKlxuICAqIFRyYW5zcGFyZW50IGJhY2tncm91bmRcbiAgKi9cbiAgVFJBTlNQQVJFTlQgPSAndHJhbnNwYXJlbnQnXG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBUZXh0IHdpZGdldFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRleHRXaWRnZXRQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgdGV4dCB0byBkaXNwbGF5LCBpbiBNYXJrRG93biBmb3JtYXRcbiAgICovXG4gIHJlYWRvbmx5IG1hcmtkb3duOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdpZHRoIG9mIHRoZSB3aWRnZXQsIGluIGEgZ3JpZCBvZiAyNCB1bml0cyB3aWRlXG4gICAqXG4gICAqIEBkZWZhdWx0IDZcbiAgICovXG4gIHJlYWRvbmx5IHdpZHRoPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBIZWlnaHQgb2YgdGhlIHdpZGdldFxuICAgKlxuICAgKiBAZGVmYXVsdCAyXG4gICAqL1xuICByZWFkb25seSBoZWlnaHQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEJhY2tncm91bmQgZm9yIHRoZSB3aWRnZXRcbiAgICpcbiAgICogQGRlZmF1bHQgc29saWRcbiAgICovXG4gIHJlYWRvbmx5IGJhY2tncm91bmQ/OiBUZXh0V2lkZ2V0QmFja2dyb3VuZDtcbn1cblxuLyoqXG4gKiBBIGRhc2hib2FyZCB3aWRnZXQgdGhhdCBkaXNwbGF5cyBNYXJrRG93blxuICovXG5leHBvcnQgY2xhc3MgVGV4dFdpZGdldCBleHRlbmRzIENvbmNyZXRlV2lkZ2V0IHtcbiAgcHJpdmF0ZSByZWFkb25seSBtYXJrZG93bjogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IGJhY2tncm91bmQ/OiBUZXh0V2lkZ2V0QmFja2dyb3VuZDtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogVGV4dFdpZGdldFByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMud2lkdGggfHwgNiwgcHJvcHMuaGVpZ2h0IHx8IDIpO1xuICAgIHRoaXMubWFya2Rvd24gPSBwcm9wcy5tYXJrZG93bjtcbiAgICB0aGlzLmJhY2tncm91bmQgPSBwcm9wcy5iYWNrZ3JvdW5kO1xuICB9XG5cbiAgcHVibGljIHBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICB9XG5cbiAgcHVibGljIHRvSnNvbigpOiBhbnlbXSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICB4OiB0aGlzLngsXG4gICAgICB5OiB0aGlzLnksXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG1hcmtkb3duOiB0aGlzLm1hcmtkb3duLFxuICAgICAgICBiYWNrZ3JvdW5kOiB0aGlzLmJhY2tncm91bmQsXG4gICAgICB9LFxuICAgIH1dO1xuICB9XG59XG4iXX0=