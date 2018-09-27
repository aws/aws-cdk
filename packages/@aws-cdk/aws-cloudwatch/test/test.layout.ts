import { Test } from 'nodeunit';
import { Column, IWidget, Row, Spacer, TextWidget } from '../lib';

export = {
  'row has the height of the tallest element'(test: Test) {
    // WHEN
    const row = new Row(
      new Spacer({ width: 10, height: 1 }),
      new Spacer({ width: 10, height: 4 }),
    );

    // THEN
    test.equal(4, row.height);
    test.equal(20, row.width);

    test.done();
  },

  'column has the width of the tallest element'(test: Test) {
    // WHEN
    const col = new Column(
      new Spacer({ width: 1, height: 1 }),
      new Spacer({ width: 4, height: 4 }),
    );

    // THEN
    test.equal(4, col.width);
    test.equal(5, col.height);

    test.done();
  },

  'row wraps to width of 24, taking tallest widget into account while wrapping'(test: Test) {
    // Try the tall box in all positions
    for (const heights of [[4, 1, 1], [1, 4, 1], [1, 1, 4]]) {
      // GIVEN
      const widgets = [
        new TextWidget({ width: 7, height: heights[0], markdown: 'a' }),
        new TextWidget({ width: 7, height: heights[1], markdown: 'b' }),
        new TextWidget({ width: 7, height: heights[2], markdown: 'c' }),
        new TextWidget({ width: 7, height: 1, markdown: 'd' }),
      ];

      // WHEN
      const row = new Row(...widgets);
      row.position(1000, 1000);  // Check that we correctly offset all inner widgets

      // THEN
      test.equal(21, row.width);
      test.equal(5, row.height);

      function assertWidgetPos(x: number, y: number, w: IWidget) {
        const json = w.toJson()[0];
        test.equal(x, json.x);
        test.equal(y, json.y);
      }

      assertWidgetPos(1000, 1000, widgets[0]);
      assertWidgetPos(1007, 1000, widgets[1]);
      assertWidgetPos(1014, 1000, widgets[2]);
      assertWidgetPos(1000, 1004, widgets[3]);
    }

    test.done();
  },

  'row can fit exactly 3 8-wide widgets without wrapping'(test: Test) {
    // Try the tall box in all positions
    for (const heights of [[4, 1, 1], [1, 4, 1], [1, 1, 4]]) {
      // WHEN
      const row = new Row(
        new TextWidget({ width: 8, height: heights[0], markdown: 'a' }),
        new TextWidget({ width: 8, height: heights[1], markdown: 'b' }),
        new TextWidget({ width: 8, height: heights[2], markdown: 'c' }),
      );

      // THEN
      test.equal(24, row.width);
      test.equal(4, row.height);
    }

    test.done();
  }
};
