export const QUEUE_GET_ACTIONS = [
    "sqs:ReceiveMessage",
];

export const QUEUE_CONSUME_ACTIONS = [
    "sqs:ChangeMessageVisibility",
    "sqs:DeleteMessage",
];

export const QUEUE_PUT_ACTIONS = [
    "sqs:SendMessage",
];