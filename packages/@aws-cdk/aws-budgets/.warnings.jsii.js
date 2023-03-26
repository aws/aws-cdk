function _aws_cdk_aws_budgets_CfnBudgetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.budget))
            _aws_cdk_aws_budgets_CfnBudget_BudgetDataProperty(p.budget);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_budgets_CfnBudget(p) {
}
function _aws_cdk_aws_budgets_CfnBudget_AutoAdjustDataProperty(p) {
}
function _aws_cdk_aws_budgets_CfnBudget_BudgetDataProperty(p) {
}
function _aws_cdk_aws_budgets_CfnBudget_CostTypesProperty(p) {
}
function _aws_cdk_aws_budgets_CfnBudget_HistoricalOptionsProperty(p) {
}
function _aws_cdk_aws_budgets_CfnBudget_NotificationProperty(p) {
}
function _aws_cdk_aws_budgets_CfnBudget_NotificationWithSubscribersProperty(p) {
}
function _aws_cdk_aws_budgets_CfnBudget_SpendProperty(p) {
}
function _aws_cdk_aws_budgets_CfnBudget_SubscriberProperty(p) {
}
function _aws_cdk_aws_budgets_CfnBudget_TimePeriodProperty(p) {
}
function _aws_cdk_aws_budgets_CfnBudgetsActionProps(p) {
}
function _aws_cdk_aws_budgets_CfnBudgetsAction(p) {
}
function _aws_cdk_aws_budgets_CfnBudgetsAction_ActionThresholdProperty(p) {
}
function _aws_cdk_aws_budgets_CfnBudgetsAction_DefinitionProperty(p) {
}
function _aws_cdk_aws_budgets_CfnBudgetsAction_IamActionDefinitionProperty(p) {
}
function _aws_cdk_aws_budgets_CfnBudgetsAction_ScpActionDefinitionProperty(p) {
}
function _aws_cdk_aws_budgets_CfnBudgetsAction_SsmActionDefinitionProperty(p) {
}
function _aws_cdk_aws_budgets_CfnBudgetsAction_SubscriberProperty(p) {
}
function print(name, deprecationMessage) {
    const deprecated = process.env.JSII_DEPRECATED;
    const deprecationMode = ["warn", "fail", "quiet"].includes(deprecated) ? deprecated : "warn";
    const message = `${name} is deprecated.\n  ${deprecationMessage.trim()}\n  This API will be removed in the next major release.`;
    switch (deprecationMode) {
        case "fail":
            throw new DeprecationError(message);
        case "warn":
            console.warn("[WARNING]", message);
            break;
    }
}
function getPropertyDescriptor(obj, prop) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor) {
        return descriptor;
    }
    const proto = Object.getPrototypeOf(obj);
    const prototypeDescriptor = proto && getPropertyDescriptor(proto, prop);
    if (prototypeDescriptor) {
        return prototypeDescriptor;
    }
    return {};
}
const visitedObjects = new Set();
class DeprecationError extends Error {
    constructor(...args) {
        super(...args);
        Object.defineProperty(this, "name", {
            configurable: false,
            enumerable: true,
            value: "DeprecationError",
            writable: false,
        });
    }
}
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_budgets_CfnBudgetProps, _aws_cdk_aws_budgets_CfnBudget, _aws_cdk_aws_budgets_CfnBudget_AutoAdjustDataProperty, _aws_cdk_aws_budgets_CfnBudget_BudgetDataProperty, _aws_cdk_aws_budgets_CfnBudget_CostTypesProperty, _aws_cdk_aws_budgets_CfnBudget_HistoricalOptionsProperty, _aws_cdk_aws_budgets_CfnBudget_NotificationProperty, _aws_cdk_aws_budgets_CfnBudget_NotificationWithSubscribersProperty, _aws_cdk_aws_budgets_CfnBudget_SpendProperty, _aws_cdk_aws_budgets_CfnBudget_SubscriberProperty, _aws_cdk_aws_budgets_CfnBudget_TimePeriodProperty, _aws_cdk_aws_budgets_CfnBudgetsActionProps, _aws_cdk_aws_budgets_CfnBudgetsAction, _aws_cdk_aws_budgets_CfnBudgetsAction_ActionThresholdProperty, _aws_cdk_aws_budgets_CfnBudgetsAction_DefinitionProperty, _aws_cdk_aws_budgets_CfnBudgetsAction_IamActionDefinitionProperty, _aws_cdk_aws_budgets_CfnBudgetsAction_ScpActionDefinitionProperty, _aws_cdk_aws_budgets_CfnBudgetsAction_SsmActionDefinitionProperty, _aws_cdk_aws_budgets_CfnBudgetsAction_SubscriberProperty };
