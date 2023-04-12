import { GRID_WIDTH, IWidget } from './widget';

// This file contains widgets that exist for layout purposes

/**
 * A widget that contains other widgets in a horizontal row
 *
 * Widgets will be laid out next to each other
 */
export class Row implements IWidget {
  /**
   * Same as width, but writable inside class methods
   */
  private _width: number;

  /**
   * Same as height, but writable inside class methods
   */
  private _height: number;

  /**
   * List of contained widgets
   */
  public readonly widgets: IWidget[];

  /**
   * Relative position of each widget inside this row
   */
  private readonly offsets: Vector[] = [];

  constructor(...widgets: IWidget[]) {
    this.widgets = widgets;

    this._width = 0;
    this._height = 0;
    let x = 0;
    let y = 0;
    for (const widget of widgets) {
      // See if we need to horizontally wrap to add this widget
      if (x + widget.width > GRID_WIDTH) {
        y = this._height;
        x = 0;
      }

      this.updateDimensions(x, y, widget);

      x += widget.width;
    }
  }

  public get width() : number {
    return this._width;
  }

  public get height() : number {
    return this._height;
  }

  private updateDimensions(x: number, y: number, widget: IWidget): void {
    this.offsets.push({ x, y });
    this._width = Math.max(this.width, x + widget.width);
    this._height = Math.max(this.height, y + widget.height);
  }

  /**
   * Add the widget to this container
   */
  public addWidget(w: IWidget): void {
    this.widgets.push(w);

    let x = this.width;
    let y = this.height;
    if (x + w.width > GRID_WIDTH) {
      y = this.height;
      x = 0;
    }

    this.updateDimensions(x, y, w);
  }

  public position(x: number, y: number): void {
    for (let i = 0; i < this.widgets.length; i++) {
      this.widgets[i].position(x + this.offsets[i].x, y + this.offsets[i].y);
    }
  }

  public toJson(): any[] {
    const ret: any[] = [];
    for (const widget of this.widgets) {
      ret.push(...widget.toJson());
    }
    return ret;
  }
}

/**
 * A widget that contains other widgets in a vertical column
 *
 * Widgets will be laid out next to each other
 */
export class Column implements IWidget {
  /**
   * Same as width, but writable inside class methods
   */
  private _width: number;

  /**
   * Same as height, but writable inside class methods
   */
  private _height: number;

  /**
   * List of contained widgets
   */
  public readonly widgets: IWidget[];

  constructor(...widgets: IWidget[]) {
    this.widgets = widgets;

    // There's no vertical wrapping so this one's a lot easier
    this._width = Math.max(...this.widgets.map(w => w.width));
    this._height = sum(...this.widgets.map(w => w.height));
  }

  public get width() : number {
    return this._width;
  }

  public get height() : number {
    return this._height;
  }

  /**
   * Add the widget to this container
   */
  public addWidget(w: IWidget): void {
    this.widgets.push(w);
    this._width = Math.max(this.width, w.width);
    this._height += w.height;
  }

  public position(x: number, y: number): void {
    let widgetY = y;
    for (const widget of this.widgets) {
      widget.position(x, widgetY);
      widgetY += widget.height;
    }
  }

  public toJson(): any[] {
    const ret: any[] = [];
    for (const widget of this.widgets) {
      ret.push(...widget.toJson());
    }
    return ret;
  }
}

/**
 * Props of the spacer
 */
export interface SpacerProps {
  /**
   * Width of the spacer
   *
   * @default 1
   */
  readonly width?: number;

  /**
   * Height of the spacer
   *
   * @default: 1
   */
  readonly height?: number;
}

/**
 * A widget that doesn't display anything but takes up space
 */
export class Spacer implements IWidget {
  public readonly width: number;
  public readonly height: number;

  constructor(props: SpacerProps = {}) {
    this.width = props.width || 1;
    this.height = props.height || 1;
  }

  public position(_x: number, _y: number): void {
    // Don't need to do anything, not a physical widget
  }

  public toJson(): any[] {
    return [];
  }
}

/**
 * Interface representing a 2D vector (for internal use)
 */
interface Vector {
  x: number;
  y: number;
}

/**
 * Return the sum of a list of numbers
 */
function sum(...xs: number[]) {
  let ret = 0;
  for (const x of xs) {
    ret += x;
  }
  return ret;
}
