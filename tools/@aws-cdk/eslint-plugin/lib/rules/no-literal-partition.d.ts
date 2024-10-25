import { Rule } from 'eslint';
export declare const meta: {
    messages: {
        hardcodedArn: string;
    };
};
export declare function create(context: Rule.RuleContext): Rule.NodeListener;
