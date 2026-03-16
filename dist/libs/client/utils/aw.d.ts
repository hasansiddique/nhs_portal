export declare const aw: <TData, TError extends Error = Error>(promise: Promise<TData>) => Promise<readonly [TData, null] | readonly [null, TError]>;
export declare const getAuthErrorMessage: (err: unknown) => string;
