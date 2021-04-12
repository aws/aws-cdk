import { expect, haveResource, isSuperObject } from '@aws-cdk/assert-internal';
import { App, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Dashboard, GraphWidget, PeriodOverride, TextWidget } from '../lib';

export = {
  'widgets in different adds are laid out underneath each other'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const dashboard = new Dashboard(stack, 'Dash');

    // WHEN
    dashboard.addWidgets(new TextWidget({
      width: 10,
      height: 2,
      markdown: 'first',
    }));
    dashboard.addWidgets(new TextWidget({
      width: 1,
      height: 4,
      markdown: 'second',
    }));
    dashboard.addWidgets(new TextWidget({
      width: 4,
      height: 1,
      markdown: 'third',
    }));

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Dashboard', thatHasWidgets([
      { type: 'text', width: 10, height: 2, x: 0, y: 0, properties: { markdown: 'first' } },
      { type: 'text', width: 1, height: 4, x: 0, y: 2, properties: { markdown: 'second' } },
      { type: 'text', width: 4, height: 1, x: 0, y: 6, properties: { markdown: 'third' } },
    ])));

    test.done();
  },

  'widgets in same add are laid out next to each other'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const dashboard = new Dashboard(stack, 'Dash');

    // WHEN
    dashboard.addWidgets(
      new TextWidget({
        width: 10,
        height: 2,
        markdown: 'first',
      }),
      new TextWidget({
        width: 1,
        height: 4,
        markdown: 'second',
      }),
      new TextWidget({
        width: 4,
        height: 1,
        markdown: 'third',
      }),
    );

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Dashboard', thatHasWidgets([
      { type: 'text', width: 10, height: 2, x: 0, y: 0, properties: { markdown: 'first' } },
      { type: 'text', width: 1, height: 4, x: 10, y: 0, properties: { markdown: 'second' } },
      { type: 'text', width: 4, height: 1, x: 11, y: 0, properties: { markdown: 'third' } },
    ])));

    test.done();
  },

  'tokens in widgets are retained'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const dashboard = new Dashboard(stack, 'Dash');

    // WHEN
    dashboard.addWidgets(
      new GraphWidget({ width: 1, height: 1 }), // GraphWidget has internal reference to current region
    );

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Dashboard', {
      DashboardBody: {
        'Fn::Join': ['', [
          '{"widgets":[{"type":"metric","width":1,"height":1,"x":0,"y":0,"properties":{"view":"timeSeries","region":"',
          { Ref: 'AWS::Region' },
          '","yAxis":{}}}]}',
        ]],
      },
    }));

    test.done();
  },

  'dashboard body includes non-widget fields'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const dashboard = new Dashboard(stack, 'Dash',
      {
        start: '-9H',
        end: '2018-12-17T06:00:00.000Z',
        periodOverride: PeriodOverride.INHERIT,
      });

    // WHEN
    dashboard.addWidgets(
      new GraphWidget({ width: 1, height: 1 }), // GraphWidget has internal reference to current region
    );

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Dashboard', {
      DashboardBody: {
        'Fn::Join': ['', [
          '{"start":"-9H","end":"2018-12-17T06:00:00.000Z","periodOverride":"inherit",\
"widgets":[{"type":"metric","width":1,"height":1,"x":0,"y":0,"properties":{"view":"timeSeries","region":"',
          { Ref: 'AWS::Region' },
          '","yAxis":{}}}]}',
        ]],
      },
    }));

    test.done();
  },

  'DashboardName is set when provided'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');

    // WHEN
    new Dashboard(stack, 'MyDashboard', {
      dashboardName: 'MyCustomDashboardName',
    });

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Dashboard', {
      DashboardName: 'MyCustomDashboardName',
    }));

    test.done();
  },

  'DashboardName is not generated if not provided'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');

    // WHEN
    new Dashboard(stack, 'MyDashboard');

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Dashboard', {}));

    test.done();
  },

  'throws if DashboardName is not valid'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');

    // WHEN
    const toThrow = () => {
      new Dashboard(stack, 'MyDashboard', {
        dashboardName: 'My Invalid Dashboard Name',
      });
    };

    // THEN
    test.throws(() => toThrow(), /field dashboardName contains invalid characters/);

    test.done();
  },
};

/**
 * Returns a property predicate that checks that the given Dashboard has the indicated widgets
 */
function thatHasWidgets(widgets: any): (props: any) => boolean {
  return (props: any) => {
    try {
      const actualWidgets = JSON.parse(props.DashboardBody).widgets;
      return isSuperObject(actualWidgets, widgets);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error parsing', props);
      throw e;
    }
  };
}
