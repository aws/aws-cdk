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
_a = JSII_RTTI_SYMBOL_1;
Row[_a] = { fqn: "@aws-cdk/aws-cloudwatch.Row", version: "0.0.0" };
exports.Row = Row;
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
_b = JSII_RTTI_SYMBOL_1;
Column[_b] = { fqn: "@aws-cdk/aws-cloudwatch.Column", version: "0.0.0" };
exports.Column = Column;
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
_c = JSII_RTTI_SYMBOL_1;
Spacer[_c] = { fqn: "@aws-cdk/aws-cloudwatch.Spacer", version: "0.0.0" };
exports.Spacer = Spacer;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF5b3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFDQUErQztBQUUvQyw0REFBNEQ7QUFFNUQ7Ozs7R0FJRztBQUNILE1BQWEsR0FBRztJQXFCZCxZQUFZLEdBQUcsT0FBa0I7UUFMakM7O1dBRUc7UUFDYyxZQUFPLEdBQWEsRUFBRSxDQUFDOzs7Ozs7K0NBbkI3QixHQUFHOzs7O1FBc0JaLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRXZCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO1lBQzVCLHlEQUF5RDtZQUN6RCxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLG1CQUFVLEVBQUU7Z0JBQ2pDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNqQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ1A7WUFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUVwQyxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQztTQUNuQjtLQUNGO0lBRUQsSUFBVyxLQUFLO1FBQ2QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3BCO0lBRUQsSUFBVyxNQUFNO1FBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ3JCO0lBRU8sZ0JBQWdCLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxNQUFlO1FBQzVELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFD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QVM7UUFDbEMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM1QixPQUFPLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUMxQjtLQUNGO0lBRU0sTUFBTTtRQUNYLE1BQU0sR0FBRyxHQUFVLEVBQUUsQ0FBQztRQUN0QixLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsT0FBTyxHQUFHLENBQUM7S0FDWjs7OztBQXZEVSx3QkFBTTtBQTZFbkI7O0dBRUc7QUFDSCxNQUFhLE1BQU07SUFJakIsWUFBWSxRQUFxQixFQUFFOzs7Ozs7K0NBSnhCLE1BQU07Ozs7UUFLZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7S0FDakM7SUFFTSxRQUFRLENBQUMsRUFBVSxFQUFFLEVBQVU7S0FFckM7SUFFTSxNQUFNO1FBQ1gsT0FBTyxFQUFFLENBQUM7S0FDWDs7OztBQWZVLHdCQUFNO0FBMEJuQjs7R0FFRztBQUNILFNBQVMsR0FBRyxDQUFDLEdBQUcsRUFBWTtJQUMxQixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDWixLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNsQixHQUFHLElBQUksQ0FBQyxDQUFDO0tBQ1Y7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHUklEX1dJRFRILCBJV2lkZ2V0IH0gZnJvbSAnLi93aWRnZXQnO1xuXG4vLyBUaGlzIGZpbGUgY29udGFpbnMgd2lkZ2V0cyB0aGF0IGV4aXN0IGZvciBsYXlvdXQgcHVycG9zZXNcblxuLyoqXG4gKiBBIHdpZGdldCB0aGF0IGNvbnRhaW5zIG90aGVyIHdpZGdldHMgaW4gYSBob3Jpem9udGFsIHJvd1xuICpcbiAqIFdpZGdldHMgd2lsbCBiZSBsYWlkIG91dCBuZXh0IHRvIGVhY2ggb3RoZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFJvdyBpbXBsZW1lbnRzIElXaWRnZXQge1xuICAvKipcbiAgICogU2FtZSBhcyB3aWR0aCwgYnV0IHdyaXRhYmxlIGluc2lkZSBjbGFzcyBtZXRob2RzXG4gICAqL1xuICBwcml2YXRlIF93aWR0aDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBTYW1lIGFzIGhlaWdodCwgYnV0IHdyaXRhYmxlIGluc2lkZSBjbGFzcyBtZXRob2RzXG4gICAqL1xuICBwcml2YXRlIF9oZWlnaHQ6IG51bWJlcjtcblxuICAvKipcbiAgICogTGlzdCBvZiBjb250YWluZWQgd2lkZ2V0c1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHdpZGdldHM6IElXaWRnZXRbXTtcblxuICAvKipcbiAgICogUmVsYXRpdmUgcG9zaXRpb24gb2YgZWFjaCB3aWRnZXQgaW5zaWRlIHRoaXMgcm93XG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IG9mZnNldHM6IFZlY3RvcltdID0gW107XG5cbiAgY29uc3RydWN0b3IoLi4ud2lkZ2V0czogSVdpZGdldFtdKSB7XG4gICAgdGhpcy53aWRnZXRzID0gd2lkZ2V0cztcblxuICAgIHRoaXMuX3dpZHRoID0gMDtcbiAgICB0aGlzLl9oZWlnaHQgPSAwO1xuICAgIGxldCB4ID0gMDtcbiAgICBsZXQgeSA9IDA7XG4gICAgZm9yIChjb25zdCB3aWRnZXQgb2Ygd2lkZ2V0cykge1xuICAgICAgLy8gU2VlIGlmIHdlIG5lZWQgdG8gaG9yaXpvbnRhbGx5IHdyYXAgdG8gYWRkIHRoaXMgd2lkZ2V0XG4gICAgICBpZiAoeCArIHdpZGdldC53aWR0aCA+IEdSSURfV0lEVEgpIHtcbiAgICAgICAgeSA9IHRoaXMuX2hlaWdodDtcbiAgICAgICAgeCA9IDA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudXBkYXRlRGltZW5zaW9ucyh4LCB5LCB3aWRnZXQpO1xuXG4gICAgICB4ICs9IHdpZGdldC53aWR0aDtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0IHdpZHRoKCkgOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgaGVpZ2h0KCkgOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZURpbWVuc2lvbnMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZGdldDogSVdpZGdldCk6IHZvaWQge1xuICAgIHRoaXMub2Zmc2V0cy5wdXNoKHsgeCwgeSB9KTtcbiAgICB0aGlzLl93aWR0aCA9IE1hdGgubWF4KHRoaXMud2lkdGgsIHggKyB3aWRnZXQud2lkdGgpO1xuICAgIHRoaXMuX2hlaWdodCA9IE1hdGgubWF4KHRoaXMuaGVpZ2h0LCB5ICsgd2lkZ2V0LmhlaWdodCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSB3aWRnZXQgdG8gdGhpcyBjb250YWluZXJcbiAgICovXG4gIHB1YmxpYyBhZGRXaWRnZXQodzogSVdpZGdldCk6IHZvaWQge1xuICAgIHRoaXMud2lkZ2V0cy5wdXNoKHcpO1xuXG4gICAgbGV0IHggPSB0aGlzLndpZHRoO1xuICAgIGxldCB5ID0gdGhpcy5oZWlnaHQ7XG4gICAgaWYgKHggKyB3LndpZHRoID4gR1JJRF9XSURUSCkge1xuICAgICAgeSA9IHRoaXMuaGVpZ2h0O1xuICAgICAgeCA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVEaW1lbnNpb25zKHgsIHksIHcpO1xuICB9XG5cbiAgcHVibGljIHBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndpZGdldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMud2lkZ2V0c1tpXS5wb3NpdGlvbih4ICsgdGhpcy5vZmZzZXRzW2ldLngsIHkgKyB0aGlzLm9mZnNldHNbaV0ueSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHRvSnNvbigpOiBhbnlbXSB7XG4gICAgY29uc3QgcmV0OiBhbnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3Qgd2lkZ2V0IG9mIHRoaXMud2lkZ2V0cykge1xuICAgICAgcmV0LnB1c2goLi4ud2lkZ2V0LnRvSnNvbigpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxufVxuXG4vKipcbiAqIEEgd2lkZ2V0IHRoYXQgY29udGFpbnMgb3RoZXIgd2lkZ2V0cyBpbiBhIHZlcnRpY2FsIGNvbHVtblxuICpcbiAqIFdpZGdldHMgd2lsbCBiZSBsYWlkIG91dCBuZXh0IHRvIGVhY2ggb3RoZXJcbiAqL1xuZXhwb3J0IGNsYXNzIENvbHVtbiBpbXBsZW1lbnRzIElXaWRnZXQge1xuICAvKipcbiAgICogU2FtZSBhcyB3aWR0aCwgYnV0IHdyaXRhYmxlIGluc2lkZSBjbGFzcyBtZXRob2RzXG4gICAqL1xuICBwcml2YXRlIF93aWR0aDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBTYW1lIGFzIGhlaWdodCwgYnV0IHdyaXRhYmxlIGluc2lkZSBjbGFzcyBtZXRob2RzXG4gICAqL1xuICBwcml2YXRlIF9oZWlnaHQ6IG51bWJlcjtcblxuICAvKipcbiAgICogTGlzdCBvZiBjb250YWluZWQgd2lkZ2V0c1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHdpZGdldHM6IElXaWRnZXRbXTtcblxuICBjb25zdHJ1Y3RvciguLi53aWRnZXRzOiBJV2lkZ2V0W10pIHtcbiAgICB0aGlzLndpZGdldHMgPSB3aWRnZXRzO1xuXG4gICAgLy8gVGhlcmUncyBubyB2ZXJ0aWNhbCB3cmFwcGluZyBzbyB0aGlzIG9uZSdzIGEgbG90IGVhc2llclxuICAgIHRoaXMuX3dpZHRoID0gTWF0aC5tYXgoLi4udGhpcy53aWRnZXRzLm1hcCh3ID0+IHcud2lkdGgpKTtcbiAgICB0aGlzLl9oZWlnaHQgPSBzdW0oLi4udGhpcy53aWRnZXRzLm1hcCh3ID0+IHcuaGVpZ2h0KSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHdpZHRoKCkgOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgaGVpZ2h0KCkgOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSB3aWRnZXQgdG8gdGhpcyBjb250YWluZXJcbiAgICovXG4gIHB1YmxpYyBhZGRXaWRnZXQodzogSVdpZGdldCk6IHZvaWQge1xuICAgIHRoaXMud2lkZ2V0cy5wdXNoKHcpO1xuICAgIHRoaXMuX3dpZHRoID0gTWF0aC5tYXgodGhpcy53aWR0aCwgdy53aWR0aCk7XG4gICAgdGhpcy5faGVpZ2h0ICs9IHcuaGVpZ2h0O1xuICB9XG5cbiAgcHVibGljIHBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgbGV0IHdpZGdldFkgPSB5O1xuICAgIGZvciAoY29uc3Qgd2lkZ2V0IG9mIHRoaXMud2lkZ2V0cykge1xuICAgICAgd2lkZ2V0LnBvc2l0aW9uKHgsIHdpZGdldFkpO1xuICAgICAgd2lkZ2V0WSArPSB3aWRnZXQuaGVpZ2h0O1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB0b0pzb24oKTogYW55W10ge1xuICAgIGNvbnN0IHJldDogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHdpZGdldCBvZiB0aGlzLndpZGdldHMpIHtcbiAgICAgIHJldC5wdXNoKC4uLndpZGdldC50b0pzb24oKSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9wcyBvZiB0aGUgc3BhY2VyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3BhY2VyUHJvcHMge1xuICAvKipcbiAgICogV2lkdGggb2YgdGhlIHNwYWNlclxuICAgKlxuICAgKiBAZGVmYXVsdCAxXG4gICAqL1xuICByZWFkb25seSB3aWR0aD86IG51bWJlcjtcblxuICAvKipcbiAgICogSGVpZ2h0IG9mIHRoZSBzcGFjZXJcbiAgICpcbiAgICogQGRlZmF1bHQ6IDFcbiAgICovXG4gIHJlYWRvbmx5IGhlaWdodD86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBBIHdpZGdldCB0aGF0IGRvZXNuJ3QgZGlzcGxheSBhbnl0aGluZyBidXQgdGFrZXMgdXAgc3BhY2VcbiAqL1xuZXhwb3J0IGNsYXNzIFNwYWNlciBpbXBsZW1lbnRzIElXaWRnZXQge1xuICBwdWJsaWMgcmVhZG9ubHkgd2lkdGg6IG51bWJlcjtcbiAgcHVibGljIHJlYWRvbmx5IGhlaWdodDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBTcGFjZXJQcm9wcyA9IHt9KSB7XG4gICAgdGhpcy53aWR0aCA9IHByb3BzLndpZHRoIHx8IDE7XG4gICAgdGhpcy5oZWlnaHQgPSBwcm9wcy5oZWlnaHQgfHwgMTtcbiAgfVxuXG4gIHB1YmxpYyBwb3NpdGlvbihfeDogbnVtYmVyLCBfeTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gRG9uJ3QgbmVlZCB0byBkbyBhbnl0aGluZywgbm90IGEgcGh5c2ljYWwgd2lkZ2V0XG4gIH1cblxuICBwdWJsaWMgdG9Kc29uKCk6IGFueVtdIHtcbiAgICByZXR1cm4gW107XG4gIH1cbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgcmVwcmVzZW50aW5nIGEgMkQgdmVjdG9yIChmb3IgaW50ZXJuYWwgdXNlKVxuICovXG5pbnRlcmZhY2UgVmVjdG9yIHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBzdW0gb2YgYSBsaXN0IG9mIG51bWJlcnNcbiAqL1xuZnVuY3Rpb24gc3VtKC4uLnhzOiBudW1iZXJbXSkge1xuICBsZXQgcmV0ID0gMDtcbiAgZm9yIChjb25zdCB4IG9mIHhzKSB7XG4gICAgcmV0ICs9IHg7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cbiJdfQ==