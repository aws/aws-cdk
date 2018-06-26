import { expect, haveResource, isSuperObject } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Dashboard, TextWidget } from '../lib';

export = {
    'widgets in different adds are laid out underneath each other'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const dashboard = new Dashboard(stack, 'Dash');

        // WHEN
        dashboard.add(new TextWidget({
            width: 10,
            height: 2,
            markdown: "first"
        }));
        dashboard.add(new TextWidget({
            width: 1,
            height: 4,
            markdown: "second"
        }));
        dashboard.add(new TextWidget({
            width: 4,
            height: 1,
            markdown: "third"
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
        dashboard.add(
            new TextWidget({
                width: 10,
                height: 2,
                markdown: "first"
            }),
            new TextWidget({
                width: 1,
                height: 4,
                markdown: "second"
            }),
            new TextWidget({
                width: 4,
                height: 1,
                markdown: "third"
            }),
        );

        // THEN
        expect(stack).to(haveResource('AWS::CloudWatch::Dashboard', thatHasWidgets([
            { type: 'text', width: 10, height: 2, x: 0, y: 0, properties: { markdown: 'first' } },
            { type: 'text', width: 1, height: 4, x: 10, y: 0, properties: { markdown: 'second' } },
            { type: 'text', width: 4, height: 1, x: 11, y: 0, properties: { markdown: 'third' } },
        ])));

        test.done();
    }
};

/**
 * Returns a property predicate that checks that the given Dashboard has the indicated widgets
 */
function thatHasWidgets(widgets: any): (props: any) => boolean {
    return (props: any) => {
        const actualWidgets = JSON.parse(props.DashboardBody).widgets;
        return isSuperObject(actualWidgets, widgets);
    };
}