import { IPublishProgressListener, EventType, IPublishProgress } from '../lib/progress';
export declare class FakeListener implements IPublishProgressListener {
    private readonly doAbort;
    readonly types: EventType[];
    readonly messages: string[];
    constructor(doAbort?: boolean);
    onPublishEvent(_type: EventType, event: IPublishProgress): void;
}
