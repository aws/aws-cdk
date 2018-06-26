Add alarms and graphs to CDK applications
=========================================


Making Alarms
-------------

Making Dashboards
-----------------

Dashboards are set of Widgets stored server-side which can be accessed quickly
from the AWS console. Available widgets are graphs of a metric over time, the
current value of a metric, or a static piece of Markdown which explains what the
graphs mean.

The following widgets are available:

- `GraphWidget` -- shows any number of metrics on both the left and right
  vertical axes.
- `AlarmWidget` -- shows the graph and alarm line for a single alarm.
- `SingleValueWidget` -- shows the current value of a set of metrics.
- `TextWidget` -- shows some static Markdown.


Dashboard Layout
----------------

The widgets on a dashboard are visually laid out in a grid that is 24 columns
wide. Normally you specify X and Y coordinates for the widgets on a Dashboard,
but because this is inconvenient to do manually, the library contains a simple
layout system to help you lay out your dashboards the way you want them to.

Widgets have a `width` and `height` property, and they will be automatically
laid out either horizontally or vertically stacked to fill out the available
space.

Widgets are added to a Dashboard by calling `add(widget1, widget2, ...)`.
Widgets given in the same call will be laid out horizontally. Widgets given
in different calls will be laid out vertically. To make more complex layouts,
you can use the following widgets to pack widgets together in different ways:

- `Column`: stack two or more widgets vertically.
- `Row`: lay out two or more widgets horizontally.
- `Spacer`: take up empty space
