import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { isEmpty, merge } from 'lodash';

import transformKeys from './transform-keys';
import { CREATE_FORM_DATA } from './form-data';

// const baseURL = 'http://localhost:8080/';
// When unset, use same origin so Vite proxy can forward /auth, /check-username, /check-email to the API
const baseURL = import.meta.env.VITE_API_URL ?? '';

const axiosInstance = axios.create({
  baseURL: baseURL,
});

const getHeaders = (headers: object) => {
  const defaultHeaders = {
    Accept: 'application/json',
    ...(!isEmpty(Cookies.get('token')) && {
      Authorization: `${Cookies.get('token')}`,
    }),
  };
  return merge({}, defaultHeaders, headers);
};

// Queue to hold all pending requests during token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: AxiosResponse) => void;
  reject: (error: unknown) => void;
}> = [];

// Function to process queued requests once the token is refreshed
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshAuthToken = async () => {
  const currentUser = JSON.parse(localStorage.getItem('user') as string);

  try {
    const response = await request.post(`${baseURL}auth/refresh-token`, {
      user_id: currentUser.id,
      email: currentUser.email,
    });
    const newToken = response.data.newToken;
    Cookies.set('token', `Bearer ${newToken}`);
    return newToken;
  } catch (error) {
    console.error('Failed to refresh token', error);
    throw error;
  }
};

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is a 401, handle token refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.startsWith('/auth')
    ) {
      if (isRefreshing) {
        // If token is currently being refreshed, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest); // Retry the original request
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAuthToken();
        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // Retry the original request with new token
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const request = {
  get: (url: string, headers = {}, signal?: AbortSignal) => {
    return axiosInstance({
      url,
      method: 'GET',
      headers: getHeaders(headers),
      signal, // Pass the signal here
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      transformResponse: axios.defaults.transformResponse.concat((data) =>
        transformKeys.toCamelCase(data)
      ),
    });
  },
  post: (
    url: string,
    payload: object,
    headers = {},
    transform = true,
    createFormData = true,
    signal?: AbortSignal // Add signal as an optional parameter
  ) => {
    const updatedPayload = createFormData ? CREATE_FORM_DATA(payload) : payload;
    return axiosInstance({
      url,
      method: 'POST',
      data: transform
        ? transformKeys.toSnakeCase(updatedPayload)
        : updatedPayload,
      headers: getHeaders(headers),
      signal, // Pass the signal here
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      transformResponse: axios.defaults.transformResponse.concat((data) =>
        transformKeys.toCamelCase(data)
      ),
    });
  },
  patch: (url: string, payload: object, headers = {}, transform = true) => {
    const updatedPayload = CREATE_FORM_DATA(payload);
    return axiosInstance({
      url,
      method: 'PATCH',
      data: transform
        ? transformKeys.toSnakeCase(updatedPayload)
        : updatedPayload,
      headers: getHeaders(headers),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      transformResponse: axios.defaults.transformResponse.concat((data) =>
        transformKeys.toCamelCase(data)
      ),
    });
  },
  put: (url: string, payload: object, headers = {}, transform = true) => {
    const updatedPayload = CREATE_FORM_DATA(payload);
    return axiosInstance({
      url,
      method: 'PUT',
      data: transform
        ? transformKeys.toSnakeCase(updatedPayload)
        : updatedPayload,
      headers: getHeaders(headers),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      transformResponse: axios.defaults.transformResponse.concat((data) =>
        transformKeys.toCamelCase(data)
      ),
    });
  },
  delete: (url: string, headers = {}) => {
    return axiosInstance({
      url,
      method: 'DELETE',
      headers: getHeaders(headers),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      transformResponse: axios.defaults.transformResponse.concat((data) =>
        transformKeys.toCamelCase(data)
      ),
    });
  },
};
