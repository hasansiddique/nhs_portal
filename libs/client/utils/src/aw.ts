import { isClerkAPIResponseError } from '@clerk/clerk-react/errors';

export const aw = async <TData, TError extends Error = Error>(
  promise: Promise<TData>
): Promise<readonly [TData, null] | readonly [null, TError]> => {
  try {
    const res = await promise;
    return [res, null];
  } catch (err) {
    return [null, err as TError];
  }
};

export const getAuthErrorMessage = (err: unknown) => {
  if (isClerkAPIResponseError(err)) {
    return err.errors[0].longMessage || err.message;
  }
  return String(err);
};
