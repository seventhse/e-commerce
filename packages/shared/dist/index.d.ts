declare const ResponseCode: {
    readonly UNKNOWN_ERROR: 1;
    readonly SUCCESS: 200;
    readonly VALIDATION_ERROR: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly METHOD_NOT_ALLOWED: 405;
    readonly INTERNAL_SERVER_ERROR: 500;
};
interface IResponse<T> {
    code: number;
    data: T | null;
    message: string;
    timestamp: string;
}
interface ErrorResponse extends IResponse<null> {
    path: string;
    method: string;
}

export { ResponseCode };
export type { ErrorResponse, IResponse };
