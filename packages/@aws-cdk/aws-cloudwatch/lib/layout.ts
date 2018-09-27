import { GRID_WIDTH, IWidget } from "./widget";

// This file contains widgets that exist for layout purposes

/**
 * A widget that contains other widgets in a horizontal row
 *
 * Widgets will be laid out next to each other
 */
export class Row implements IWidget {
  public readonly width: number;
  public readonly height: number;

  /**
   * List of contained widgets
   */
  private readonly widgets: IWidget[];

  /**
   * Relative position of each widget inside this row
   */
  private readonly offsets: Vector[] = [];

  constructor(...widgets: IWidget[]) {
    this.widgets = widgets;

    this.width = 0;
    this.height = 0;
    let x = 0;
    let y = 0;
    for (const widget of widgets) {
      // See if we need to horizontally wrap to add this widget
      if (x + widget.width > GRID_WIDTH) {
        y = this.height;
        x = 0;
      }

      this.offsets.push({x, y});
      this.width = Math.max(this.width, x + widget.width);
      this.height = Math.max(this.height, y + widget.height);

      x += widget.width;
    }
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
  public readonly width: number;
  public readonly height: number;

  /**
   * List of contained widgets
   */
  private readonly widgets: IWidget[];

  constructor(...widgets: IWidget[]) {
    this.widgets = widgets;

    // There's no vertical wrapping so this one's a lot easier
    this.width = Math.max(...this.widgets.map(w => w.width));
    this.height = sum(...this.widgets.map(w => w.height));
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
  width?: number;

  /**
   * Height of the spacer
   *
   * @default: 1
   */
  height?: number;
}

/**
 * A widget that doesn't display anything but takes up space
 */
export class Spacer implements IWidget {
  public readonly width: number;
  public readonly height: number;

  constructor(props: SpacerProps) {
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
