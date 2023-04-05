export declare const resources: ({
    apiVersion: string;
    kind: string;
    metadata: {
        name: string;
    };
    spec: {
        type: string;
        ports: {
            port: number;
            targetPort: number;
        }[];
        selector: {
            app: string;
            matchLabels?: undefined;
        };
        replicas?: undefined;
        template?: undefined;
    };
} | {
    apiVersion: string;
    kind: string;
    metadata: {
        name: string;
    };
    spec: {
        replicas: number;
        selector: {
            matchLabels: {
                app: string;
            };
            app?: undefined;
        };
        template: {
            metadata: {
                labels: {
                    app: string;
                };
            };
            spec: {
                containers: {
                    name: string;
                    image: string;
                    ports: {
                        containerPort: number;
                    }[];
                }[];
            };
        };
        type?: undefined;
        ports?: undefined;
    };
})[];
