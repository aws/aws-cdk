import { ITransitGateway } from "./transit-gateway";

export interface ITransitGatewayAttachment {
  readonly transitGatewayAttachmentId: string;
  readonly transitGatewayId: string;
}