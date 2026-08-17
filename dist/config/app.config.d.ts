declare const _default: () => {
    app: {
        name: string;
        port: number;
        url: string;
        client_app_url: string;
    };
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        name: string;
        max: number;
        idleTimeoutMillis: number;
        connectionTimeoutMillis: number;
    };
    security: {
        salt: number;
    };
    jwt: {
        secret: string;
        expiry: string;
    };
};
export default _default;
