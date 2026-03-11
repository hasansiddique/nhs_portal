import { default as axios } from 'axios';

export declare const request: {
    get: (url: string, headers?: {}, signal?: AbortSignal) => Promise<axios.AxiosResponse<any, any>>;
    post: (url: string, payload: object, headers?: {}, transform?: boolean, createFormData?: boolean, signal?: AbortSignal) => Promise<axios.AxiosResponse<any, any>>;
    patch: (url: string, payload: object, headers?: {}, transform?: boolean) => Promise<axios.AxiosResponse<any, any>>;
    put: (url: string, payload: object, headers?: {}, transform?: boolean) => Promise<axios.AxiosResponse<any, any>>;
    delete: (url: string, headers?: {}) => Promise<axios.AxiosResponse<any, any>>;
};
