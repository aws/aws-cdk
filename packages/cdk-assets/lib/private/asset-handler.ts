export interface IAssetHandler {
  publish(): Promise<void>;
}

export type MessageSink = (m: string) => void;