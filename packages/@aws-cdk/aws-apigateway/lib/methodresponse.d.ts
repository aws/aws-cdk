import { IModel } from './model';
export interface MethodResponse {
    /**
     * The method response's status code, which you map to an IntegrationResponse.
     * Required.
     */
    readonly statusCode: string;
    /**
     * Response parameters that API Gateway sends to the client that called a method.
     * Specify response parameters as key-value pairs (string-to-Boolean maps), with
     * a destination as the key and a Boolean as the value. Specify the destination
     * using the following pattern: method.response.header.name, where the name is a
     * valid, unique header name. The Boolean specifies whether a parameter is required.
     * @default None
     */
    readonly responseParameters?: {
        [destination: string]: boolean;
    };
    /**
     * The resources used for the response's content type. Specify response models as
     * key-value pairs (string-to-string maps), with a content type as the key and a Model
     * resource name as the value.
     * @default None
     */
    readonly responseModels?: {
        [contentType: string]: IModel;
    };
}
