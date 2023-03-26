function _aws_cdk_aws_amplifyuibuilder_CfnComponentProps(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnComponent(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnComponent_ActionParametersProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentBindingPropertiesValueProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentBindingPropertiesValuePropertiesProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentChildProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentConditionPropertyProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentDataConfigurationProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentEventProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentPropertyProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentPropertyBindingPropertiesProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentVariantProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnComponent_FormBindingElementProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnComponent_MutationActionSetStateParameterProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnComponent_PredicateProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnComponent_SortPropertyProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnFormProps(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnForm(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnForm_FieldConfigProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnForm_FieldInputConfigProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnForm_FieldPositionProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnForm_FieldValidationConfigurationProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnForm_FormButtonProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnForm_FormCTAProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnForm_FormDataTypeConfigProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnForm_FormInputValuePropertyProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnForm_FormStyleProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnForm_FormStyleConfigProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnForm_SectionalElementProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnForm_ValueMappingProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnForm_ValueMappingsProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnThemeProps(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnTheme(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnTheme_ThemeValueProperty(p) {
}
function _aws_cdk_aws_amplifyuibuilder_CfnTheme_ThemeValuesProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_amplifyuibuilder_CfnComponentProps, _aws_cdk_aws_amplifyuibuilder_CfnComponent, _aws_cdk_aws_amplifyuibuilder_CfnComponent_ActionParametersProperty, _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentBindingPropertiesValueProperty, _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentBindingPropertiesValuePropertiesProperty, _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentChildProperty, _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentConditionPropertyProperty, _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentDataConfigurationProperty, _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentEventProperty, _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentPropertyProperty, _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentPropertyBindingPropertiesProperty, _aws_cdk_aws_amplifyuibuilder_CfnComponent_ComponentVariantProperty, _aws_cdk_aws_amplifyuibuilder_CfnComponent_FormBindingElementProperty, _aws_cdk_aws_amplifyuibuilder_CfnComponent_MutationActionSetStateParameterProperty, _aws_cdk_aws_amplifyuibuilder_CfnComponent_PredicateProperty, _aws_cdk_aws_amplifyuibuilder_CfnComponent_SortPropertyProperty, _aws_cdk_aws_amplifyuibuilder_CfnFormProps, _aws_cdk_aws_amplifyuibuilder_CfnForm, _aws_cdk_aws_amplifyuibuilder_CfnForm_FieldConfigProperty, _aws_cdk_aws_amplifyuibuilder_CfnForm_FieldInputConfigProperty, _aws_cdk_aws_amplifyuibuilder_CfnForm_FieldPositionProperty, _aws_cdk_aws_amplifyuibuilder_CfnForm_FieldValidationConfigurationProperty, _aws_cdk_aws_amplifyuibuilder_CfnForm_FormButtonProperty, _aws_cdk_aws_amplifyuibuilder_CfnForm_FormCTAProperty, _aws_cdk_aws_amplifyuibuilder_CfnForm_FormDataTypeConfigProperty, _aws_cdk_aws_amplifyuibuilder_CfnForm_FormInputValuePropertyProperty, _aws_cdk_aws_amplifyuibuilder_CfnForm_FormStyleProperty, _aws_cdk_aws_amplifyuibuilder_CfnForm_FormStyleConfigProperty, _aws_cdk_aws_amplifyuibuilder_CfnForm_SectionalElementProperty, _aws_cdk_aws_amplifyuibuilder_CfnForm_ValueMappingProperty, _aws_cdk_aws_amplifyuibuilder_CfnForm_ValueMappingsProperty, _aws_cdk_aws_amplifyuibuilder_CfnThemeProps, _aws_cdk_aws_amplifyuibuilder_CfnTheme, _aws_cdk_aws_amplifyuibuilder_CfnTheme_ThemeValueProperty, _aws_cdk_aws_amplifyuibuilder_CfnTheme_ThemeValuesProperty };
