"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spacer = exports.Column = exports.Row = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const widget_1 = require("./widget");
// This file contains widgets that exist for layout purposes
/**
 * A widget that contains other widgets in a horizontal row
 *
 * Widgets will be laid out next to each other
 */
class Row {
    constructor(...widgets) {
        /**
         * Relative position of each widget inside this row
         */
        this.offsets = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IWidget(widgets);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Row);
            }
            throw error;
        }
        this.widgets = widgets;
        this._width = 0;
        this._height = 0;
        let x = 0;
        let y = 0;
        for (const widget of widgets) {
            // See if we need to horizontally wrap to add this widget
            if (x + widget.width > widget_1.GRID_WIDTH) {
                y = this._height;
                x = 0;
            }
            this.updateDimensions(x, y, widget);
            x += widget.width;
        }
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    updateDimensions(x, y, widget) {
        this.offsets.push({ x, y });
        this._width = Math.max(this.width, x + widget.width);
        this._height = Math.max(this.height, y + widget.height);
    }
    /**
     * Add the widget to this container
     */
    addWidget(w) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IWidget(w);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addWidget);
            }
            throw error;
        }
        this.widgets.push(w);
        let x = this.width;
        let y = this.height;
        if (x + w.width > widget_1.GRID_WIDTH) {
            y = this.height;
            x = 0;
        }
        this.updateDimensions(x, y, w);
    }
    position(x, y) {
        for (let i = 0; i < this.widgets.length; i++) {
            this.widgets[i].position(x + this.offsets[i].x, y + this.offsets[i].y);
        }
    }
    toJson() {
        const ret = [];
        for (const widget of this.widgets) {
            ret.push(...widget.toJson());
        }
        return ret;
    }
}
exports.Row = Row;
_a = JSII_RTTI_SYMBOL_1;
Row[_a] = { fqn: "@aws-cdk/aws-cloudwatch.Row", version: "0.0.0" };
/**
 * A widget that contains other widgets in a vertical column
 *
 * Widgets will be laid out next to each other
 */
class Column {
    constructor(...widgets) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IWidget(widgets);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Column);
            }
            throw error;
        }
        this.widgets = widgets;
        // There's no vertical wrapping so this one's a lot easier
        this._width = Math.max(...this.widgets.map(w => w.width));
        this._height = sum(...this.widgets.map(w => w.height));
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    /**
     * Add the widget to this container
     */
    addWidget(w) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IWidget(w);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addWidget);
            }
            throw error;
        }
        this.widgets.push(w);
        this._width = Math.max(this.width, w.width);
        this._height += w.height;
    }
    position(x, y) {
        let widgetY = y;
        for (const widget of this.widgets) {
            widget.position(x, widgetY);
            widgetY += widget.height;
        }
    }
    toJson() {
        const ret = [];
        for (const widget of this.widgets) {
            ret.push(...widget.toJson());
        }
        return ret;
    }
}
exports.Column = Column;
_b = JSII_RTTI_SYMBOL_1;
Column[_b] = { fqn: "@aws-cdk/aws-cloudwatch.Column", version: "0.0.0" };
/**
 * A widget that doesn't display anything but takes up space
 */
class Spacer {
    constructor(props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_SpacerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Spacer);
            }
            throw error;
        }
        this.width = props.width || 1;
        this.height = props.height || 1;
    }
    position(_x, _y) {
    }
    toJson() {
        return [];
    }
}
exports.Spacer = Spacer;
_c = JSII_RTTI_SYMBOL_1;
Spacer[_c] = { fqn: "@aws-cdk/aws-cloudwatch.Spacer", version: "0.0.0" };
/**
 * Return the sum of a list of numbers
 */
function sum(...xs) {
    let ret = 0;
    for (const x of xs) {
        ret += x;
    }
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF5b3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFDQUErQztBQUUvQyw0REFBNEQ7QUFFNUQ7Ozs7R0FJRztBQUNILE1BQWEsR0FBRztJQXFCZCxZQUFZLEdBQUcsT0FBa0I7UUFMakM7O1dBRUc7UUFDYyxZQUFPLEdBQWEsRUFBRSxDQUFDOzs7Ozs7K0NBbkI3QixHQUFHOzs7O1FBc0JaLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRXZCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO1lBQzVCLHlEQUF5RDtZQUN6RCxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLG1CQUFVLEVBQUU7Z0JBQ2pDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNqQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ1A7WUFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUVwQyxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQztTQUNuQjtLQUNGO0lBRUQsSUFBVyxLQUFLO1FBQ2QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3BCO0lBRUQsSUFBVyxNQUFNO1FBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ3JCO0lBRU8sZ0JBQWdCLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxNQUFlO1FBQzVELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFD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UztRQUNsQyxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDaEIsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVCLE9BQU8sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQzFCO0tBQ0Y7SUFFTSxNQUFNO1FBQ1gsTUFBTSxHQUFHLEdBQVUsRUFBRSxDQUFDO1FBQ3RCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDOUI7UUFDRCxPQUFPLEdBQUcsQ0FBQztLQUNaOztBQXZESCx3QkF3REM7OztBQXFCRDs7R0FFRztBQUNILE1BQWEsTUFBTTtJQUlqQixZQUFZLFFBQXFCLEVBQUU7Ozs7OzsrQ0FKeEIsTUFBTTs7OztRQUtmLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztLQUNqQztJQUVNLFFBQVEsQ0FBQyxFQUFVLEVBQUUsRUFBVTtLQUVyQztJQUVNLE1BQU07UUFDWCxPQUFPLEVBQUUsQ0FBQztLQUNYOztBQWZILHdCQWdCQzs7O0FBVUQ7O0dBRUc7QUFDSCxTQUFTLEdBQUcsQ0FBQyxHQUFHLEVBQVk7SUFDMUIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ1osS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDbEIsR0FBRyxJQUFJLENBQUMsQ0FBQztLQUNWO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR1JJRF9XSURUSCwgSVdpZGdldCB9IGZyb20gJy4vd2lkZ2V0JztcblxuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIHdpZGdldHMgdGhhdCBleGlzdCBmb3IgbGF5b3V0IHB1cnBvc2VzXG5cbi8qKlxuICogQSB3aWRnZXQgdGhhdCBjb250YWlucyBvdGhlciB3aWRnZXRzIGluIGEgaG9yaXpvbnRhbCByb3dcbiAqXG4gKiBXaWRnZXRzIHdpbGwgYmUgbGFpZCBvdXQgbmV4dCB0byBlYWNoIG90aGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBSb3cgaW1wbGVtZW50cyBJV2lkZ2V0IHtcbiAgLyoqXG4gICAqIFNhbWUgYXMgd2lkdGgsIGJ1dCB3cml0YWJsZSBpbnNpZGUgY2xhc3MgbWV0aG9kc1xuICAgKi9cbiAgcHJpdmF0ZSBfd2lkdGg6IG51bWJlcjtcblxuICAvKipcbiAgICogU2FtZSBhcyBoZWlnaHQsIGJ1dCB3cml0YWJsZSBpbnNpZGUgY2xhc3MgbWV0aG9kc1xuICAgKi9cbiAgcHJpdmF0ZSBfaGVpZ2h0OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgY29udGFpbmVkIHdpZGdldHNcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB3aWRnZXRzOiBJV2lkZ2V0W107XG5cbiAgLyoqXG4gICAqIFJlbGF0aXZlIHBvc2l0aW9uIG9mIGVhY2ggd2lkZ2V0IGluc2lkZSB0aGlzIHJvd1xuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBvZmZzZXRzOiBWZWN0b3JbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKC4uLndpZGdldHM6IElXaWRnZXRbXSkge1xuICAgIHRoaXMud2lkZ2V0cyA9IHdpZGdldHM7XG5cbiAgICB0aGlzLl93aWR0aCA9IDA7XG4gICAgdGhpcy5faGVpZ2h0ID0gMDtcbiAgICBsZXQgeCA9IDA7XG4gICAgbGV0IHkgPSAwO1xuICAgIGZvciAoY29uc3Qgd2lkZ2V0IG9mIHdpZGdldHMpIHtcbiAgICAgIC8vIFNlZSBpZiB3ZSBuZWVkIHRvIGhvcml6b250YWxseSB3cmFwIHRvIGFkZCB0aGlzIHdpZGdldFxuICAgICAgaWYgKHggKyB3aWRnZXQud2lkdGggPiBHUklEX1dJRFRIKSB7XG4gICAgICAgIHkgPSB0aGlzLl9oZWlnaHQ7XG4gICAgICAgIHggPSAwO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMoeCwgeSwgd2lkZ2V0KTtcblxuICAgICAgeCArPSB3aWRnZXQud2lkdGg7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldCB3aWR0aCgpIDogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGhlaWdodCgpIDogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVEaW1lbnNpb25zKHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWRnZXQ6IElXaWRnZXQpOiB2b2lkIHtcbiAgICB0aGlzLm9mZnNldHMucHVzaCh7IHgsIHkgfSk7XG4gICAgdGhpcy5fd2lkdGggPSBNYXRoLm1heCh0aGlzLndpZHRoLCB4ICsgd2lkZ2V0LndpZHRoKTtcbiAgICB0aGlzLl9oZWlnaHQgPSBNYXRoLm1heCh0aGlzLmhlaWdodCwgeSArIHdpZGdldC5oZWlnaHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgd2lkZ2V0IHRvIHRoaXMgY29udGFpbmVyXG4gICAqL1xuICBwdWJsaWMgYWRkV2lkZ2V0KHc6IElXaWRnZXQpOiB2b2lkIHtcbiAgICB0aGlzLndpZGdldHMucHVzaCh3KTtcblxuICAgIGxldCB4ID0gdGhpcy53aWR0aDtcbiAgICBsZXQgeSA9IHRoaXMuaGVpZ2h0O1xuICAgIGlmICh4ICsgdy53aWR0aCA+IEdSSURfV0lEVEgpIHtcbiAgICAgIHkgPSB0aGlzLmhlaWdodDtcbiAgICAgIHggPSAwO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlRGltZW5zaW9ucyh4LCB5LCB3KTtcbiAgfVxuXG4gIHB1YmxpYyBwb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53aWRnZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLndpZGdldHNbaV0ucG9zaXRpb24oeCArIHRoaXMub2Zmc2V0c1tpXS54LCB5ICsgdGhpcy5vZmZzZXRzW2ldLnkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB0b0pzb24oKTogYW55W10ge1xuICAgIGNvbnN0IHJldDogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHdpZGdldCBvZiB0aGlzLndpZGdldHMpIHtcbiAgICAgIHJldC5wdXNoKC4uLndpZGdldC50b0pzb24oKSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHdpZGdldCB0aGF0IGNvbnRhaW5zIG90aGVyIHdpZGdldHMgaW4gYSB2ZXJ0aWNhbCBjb2x1bW5cbiAqXG4gKiBXaWRnZXRzIHdpbGwgYmUgbGFpZCBvdXQgbmV4dCB0byBlYWNoIG90aGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBDb2x1bW4gaW1wbGVtZW50cyBJV2lkZ2V0IHtcbiAgLyoqXG4gICAqIFNhbWUgYXMgd2lkdGgsIGJ1dCB3cml0YWJsZSBpbnNpZGUgY2xhc3MgbWV0aG9kc1xuICAgKi9cbiAgcHJpdmF0ZSBfd2lkdGg6IG51bWJlcjtcblxuICAvKipcbiAgICogU2FtZSBhcyBoZWlnaHQsIGJ1dCB3cml0YWJsZSBpbnNpZGUgY2xhc3MgbWV0aG9kc1xuICAgKi9cbiAgcHJpdmF0ZSBfaGVpZ2h0OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgY29udGFpbmVkIHdpZGdldHNcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB3aWRnZXRzOiBJV2lkZ2V0W107XG5cbiAgY29uc3RydWN0b3IoLi4ud2lkZ2V0czogSVdpZGdldFtdKSB7XG4gICAgdGhpcy53aWRnZXRzID0gd2lkZ2V0cztcblxuICAgIC8vIFRoZXJlJ3Mgbm8gdmVydGljYWwgd3JhcHBpbmcgc28gdGhpcyBvbmUncyBhIGxvdCBlYXNpZXJcbiAgICB0aGlzLl93aWR0aCA9IE1hdGgubWF4KC4uLnRoaXMud2lkZ2V0cy5tYXAodyA9PiB3LndpZHRoKSk7XG4gICAgdGhpcy5faGVpZ2h0ID0gc3VtKC4uLnRoaXMud2lkZ2V0cy5tYXAodyA9PiB3LmhlaWdodCkpO1xuICB9XG5cbiAgcHVibGljIGdldCB3aWR0aCgpIDogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGhlaWdodCgpIDogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgd2lkZ2V0IHRvIHRoaXMgY29udGFpbmVyXG4gICAqL1xuICBwdWJsaWMgYWRkV2lkZ2V0KHc6IElXaWRnZXQpOiB2b2lkIHtcbiAgICB0aGlzLndpZGdldHMucHVzaCh3KTtcbiAgICB0aGlzLl93aWR0aCA9IE1hdGgubWF4KHRoaXMud2lkdGgsIHcud2lkdGgpO1xuICAgIHRoaXMuX2hlaWdodCArPSB3LmhlaWdodDtcbiAgfVxuXG4gIHB1YmxpYyBwb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgIGxldCB3aWRnZXRZID0geTtcbiAgICBmb3IgKGNvbnN0IHdpZGdldCBvZiB0aGlzLndpZGdldHMpIHtcbiAgICAgIHdpZGdldC5wb3NpdGlvbih4LCB3aWRnZXRZKTtcbiAgICAgIHdpZGdldFkgKz0gd2lkZ2V0LmhlaWdodDtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdG9Kc29uKCk6IGFueVtdIHtcbiAgICBjb25zdCByZXQ6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCB3aWRnZXQgb2YgdGhpcy53aWRnZXRzKSB7XG4gICAgICByZXQucHVzaCguLi53aWRnZXQudG9Kc29uKCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG59XG5cbi8qKlxuICogUHJvcHMgb2YgdGhlIHNwYWNlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNwYWNlclByb3BzIHtcbiAgLyoqXG4gICAqIFdpZHRoIG9mIHRoZSBzcGFjZXJcbiAgICpcbiAgICogQGRlZmF1bHQgMVxuICAgKi9cbiAgcmVhZG9ubHkgd2lkdGg/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEhlaWdodCBvZiB0aGUgc3BhY2VyXG4gICAqXG4gICAqIEBkZWZhdWx0OiAxXG4gICAqL1xuICByZWFkb25seSBoZWlnaHQ/OiBudW1iZXI7XG59XG5cbi8qKlxuICogQSB3aWRnZXQgdGhhdCBkb2Vzbid0IGRpc3BsYXkgYW55dGhpbmcgYnV0IHRha2VzIHVwIHNwYWNlXG4gKi9cbmV4cG9ydCBjbGFzcyBTcGFjZXIgaW1wbGVtZW50cyBJV2lkZ2V0IHtcbiAgcHVibGljIHJlYWRvbmx5IHdpZHRoOiBudW1iZXI7XG4gIHB1YmxpYyByZWFkb25seSBoZWlnaHQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogU3BhY2VyUHJvcHMgPSB7fSkge1xuICAgIHRoaXMud2lkdGggPSBwcm9wcy53aWR0aCB8fCAxO1xuICAgIHRoaXMuaGVpZ2h0ID0gcHJvcHMuaGVpZ2h0IHx8IDE7XG4gIH1cblxuICBwdWJsaWMgcG9zaXRpb24oX3g6IG51bWJlciwgX3k6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIERvbid0IG5lZWQgdG8gZG8gYW55dGhpbmcsIG5vdCBhIHBoeXNpY2FsIHdpZGdldFxuICB9XG5cbiAgcHVibGljIHRvSnNvbigpOiBhbnlbXSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIHJlcHJlc2VudGluZyBhIDJEIHZlY3RvciAoZm9yIGludGVybmFsIHVzZSlcbiAqL1xuaW50ZXJmYWNlIFZlY3RvciB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgc3VtIG9mIGEgbGlzdCBvZiBudW1iZXJzXG4gKi9cbmZ1bmN0aW9uIHN1bSguLi54czogbnVtYmVyW10pIHtcbiAgbGV0IHJldCA9IDA7XG4gIGZvciAoY29uc3QgeCBvZiB4cykge1xuICAgIHJldCArPSB4O1xuICB9XG4gIHJldHVybiByZXQ7XG59XG4iXX0=