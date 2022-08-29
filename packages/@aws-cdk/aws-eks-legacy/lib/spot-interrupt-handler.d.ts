export declare enum LifecycleLabel {
    ON_DEMAND = "OnDemand",
    SPOT = "Ec2Spot"
}
export declare function spotInterruptHandler(nodeSelector?: {
    [name: string]: string;
}): ({
    kind: string;
    apiVersion: string;
    metadata: {
        name: string;
        namespace: string;
    };
    rules: {
        apiGroups: string[];
        resources: string[];
        verbs: string[];
    }[];
    subjects?: undefined;
    roleRef?: undefined;
    spec?: undefined;
} | {
    apiVersion: string;
    kind: string;
    metadata: {
        name: string;
        namespace?: undefined;
    };
    rules?: undefined;
    subjects?: undefined;
    roleRef?: undefined;
    spec?: undefined;
} | {
    kind: string;
    apiVersion: string;
    metadata: {
        name: string;
        namespace: string;
    };
    subjects: {
        kind: string;
        name: string;
        namespace: string;
    }[];
    roleRef: {
        kind: string;
        name: string;
        apiGroup: string;
    };
    rules?: undefined;
    spec?: undefined;
} | {
    apiVersion: string;
    kind: string;
    metadata: {
        name: string;
        namespace: string;
    };
    spec: {
        selector: {
            matchLabels: {
                app: string;
            };
        };
        template: {
            metadata: {
                labels: {
                    app: string;
                };
            };
            spec: {
                serviceAccountName: string;
                containers: {
                    name: string;
                    image: string;
                    imagePullPolicy: string;
                    env: {
                        name: string;
                        valueFrom: {
                            fieldRef: {
                                fieldPath: string;
                            };
                        };
                    }[];
                    resources: {
                        requests: {
                            memory: string;
                            cpu: string;
                        };
                        limits: {
                            memory: string;
                            cpu: string;
                        };
                    };
                }[];
                nodeSelector: {
                    [name: string]: string;
                };
            };
        };
    };
    rules?: undefined;
    subjects?: undefined;
    roleRef?: undefined;
})[];
