import { Template, Annotations, Match } from '@aws-cdk/assertions';
import { App, Duration, Stack } from '@aws-cdk/core';
import { Dashboard, GraphWidget, PeriodOverride, TextWidget, MathExpression, TextWidgetBackground } from '../lib';

describe('Dashboard', () => {
  test('widgets in different adds are laid out underneath each other', () => {
    // GIVEN
    const stack = new Stack();
    const dashboard = new Dashboard(stack, 'Dash');

    // WHEN
    dashboard.addWidgets(new TextWidget({
      width: 10,
      height: 2,
      markdown: 'first',
      background: TextWidgetBackground.SOLID,
    }));
    dashboard.addWidgets(new TextWidget({
      width: 1,
      height: 4,
      markdown: 'second',
      background: TextWidgetBackground.TRANSPARENT,
    }));
    dashboard.addWidgets(new TextWidget({
      width: 4,
      height: 1,
      markdown: 'third',
    }));

    // THEN
    const resources = Template.fromStack(stack).findResources('AWS::CloudWatch::Dashboard');
    expect(Object.keys(resources).length).toEqual(1);
    const key = Object.keys(resources)[0];
    hasWidgets(resources[key].Properties, [
      { type: 'text', width: 10, height: 2, x: 0, y: 0, properties: { markdown: 'first', background: TextWidgetBackground.SOLID } },
      { type: 'text', width: 1, height: 4, x: 0, y: 2, properties: { markdown: 'second', background: TextWidgetBackground.TRANSPARENT } },
      { type: 'text', width: 4, height: 1, x: 0, y: 6, properties: { markdown: 'third' } },
    ]);


  });

  test('widgets in same add are laid out next to each other', () => {
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
    const resources = Template.fromStack(stack).findResources('AWS::CloudWatch::Dashboard');
    expect(Object.keys(resources).length).toEqual(1);
    const key = Object.keys(resources)[0];
    hasWidgets(resources[key].Properties, [
      { type: 'text', width: 10, height: 2, x: 0, y: 0, properties: { markdown: 'first' } },
      { type: 'text', width: 1, height: 4, x: 10, y: 0, properties: { markdown: 'second' } },
      { type: 'text', width: 4, height: 1, x: 11, y: 0, properties: { markdown: 'third' } },
    ]);


  });

  test('tokens in widgets are retained', () => {
    // GIVEN
    const stack = new Stack();
    const dashboard = new Dashboard(stack, 'Dash');

    // WHEN
    dashboard.addWidgets(
      new GraphWidget({ width: 1, height: 1 }), // GraphWidget has internal reference to current region
    );

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Dashboard', {
      DashboardBody: {
        'Fn::Join': ['', [
          '{"widgets":[{"type":"metric","width":1,"height":1,"x":0,"y":0,"properties":{"view":"timeSeries","region":"',
          { Ref: 'AWS::Region' },
          '","yAxis":{}}}]}',
        ]],
      },
    });


  });

  test('dashboard body includes non-widget fields', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Dashboard', {
      DashboardBody: {
        'Fn::Join': ['', [
          '{"start":"-9H","end":"2018-12-17T06:00:00.000Z","periodOverride":"inherit",\
"widgets":[{"type":"metric","width":1,"height":1,"x":0,"y":0,"properties":{"view":"timeSeries","region":"',
          { Ref: 'AWS::Region' },
          '","yAxis":{}}}]}',
        ]],
      },
    });


  });

  test('defaultInterval test', () => {
    // GIVEN
    const stack = new Stack();
    // WHEN
    const dashboard = new Dashboard(stack, 'Dash', {
      defaultInterval: Duration.days(7),
    });
    dashboard.addWidgets(
      new GraphWidget({ width: 1, height: 1 }), // GraphWidget has internal reference to current region
    );

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Dashboard', {
      DashboardBody: {
        'Fn::Join': ['', [
          '{"start":"-P7D",\
"widgets":[{"type":"metric","width":1,"height":1,"x":0,"y":0,"properties":{"view":"timeSeries","region":"',
          { Ref: 'AWS::Region' },
          '","yAxis":{}}}]}',
        ]],
      },
    });

  });

  test('DashboardName is set when provided', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');

    // WHEN
    new Dashboard(stack, 'MyDashboard', {
      dashboardName: 'MyCustomDashboardName',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Dashboard', {
      DashboardName: 'MyCustomDashboardName',
    });


  });

  test('DashboardName is not generated if not provided', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');

    // WHEN
    new Dashboard(stack, 'MyDashboard');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Dashboard', {});


  });

  test('throws if DashboardName is not valid', () => {
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
    expect(() => toThrow()).toThrow(/field dashboardName contains invalid characters/);
  });

  test('dashboardArn should not include a region', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack', {
      env: {
        region: 'invalid-region',
      },
    });

    // WHEN
    const dashboard = new Dashboard(stack, 'MyStack');

    // THEN
    expect(dashboard.dashboardArn).not.toContain('invalid-region');
  });

  test('metric warnings are added to dashboard', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const m = new MathExpression({ expression: 'oops' });

    // WHEN
    new Dashboard(stack, 'MyDashboard', {
      widgets: [
        [new GraphWidget({ left: [m] }), new TextWidget({ markdown: 'asdf' })],
      ],
    });

    // THEN
    const template = Annotations.fromStack(stack);
    template.hasWarning('/MyStack/MyDashboard', Match.stringLikeRegexp("Math expression 'oops' references unknown identifiers"));
  });
});

/**
 * Returns a property predicate that checks that the given Dashboard has the indicated widgets
 */
function hasWidgets(props: any, widgets: any[]) {
  let actualWidgets: any[] = [];
  try {
    actualWidgets = JSON.parse(props.DashboardBody).widgets;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error parsing', props);
    throw e;
  }
  expect(actualWidgets).toEqual(expect.arrayContaining(widgets));
}
