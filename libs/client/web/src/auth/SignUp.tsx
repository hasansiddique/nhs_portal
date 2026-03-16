import { toast } from 'sonner';
import { debounce } from 'lodash';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useId, useState, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';

import {
  Form,
  Input,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
  ShowPasswordStrength,
} from '@your-props/client/ui';
import {
  request,
  signUpSchema,
  useAuthDialogStore,
  type ClientSignUpSchema,
} from '@your-props/client/utils';

import { SignIn } from './SignIn';

export const SignUp = () => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/auth');
  const { toggleDialogVisibility } = useAuthDialogStore();

  const formId = useId();

  const form = useForm<ClientSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const { errors } = form.formState;
  const password = form.getValues('password');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: ClientSignUpSchema) => {
    try {
      setIsSubmitting(true);

      const usernameValidation = await validateUsername(
        formData.username,
        'username'
      );
      const emailValidation = await validateUsername(formData.email, 'email');

      if (!usernameValidation?.status) {
        form.setError('username', {
          type: 'manual',
          message:
            usernameValidation?.message ||
            'Username is already taken, please choose another.',
        });
        return;
      }

      if (!emailValidation?.status) {
        form.setError('email', {
          type: 'manual',
          message:
            emailValidation?.message ||
            'Email is already taken, please choose another.',
        });
        return;
      }

      const { data } = await request.post(
        '/auth/signup',
        { ...formData, type: '2' },
        {},
        true,
        false // send JSON so API receives body (express.json() does not parse FormData)
      );
      const userMessage = data.message;

      toast.success(userMessage || 'Account created successfully!');

      toggleDialogVisibility(false, <span />);
    } catch (err: any) {
      Object.values(err.response?.data?.messages ?? { error: 'Sign up failed' }).map((message) =>
        toast.error(String(message))
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateUsername = async (
    username: string,
    type: string
  ): Promise<{ status: boolean; message: string }> => {
    try {
      const { data } = await request.post(
        type === 'email' ? '/check-email' : '/check-username',
        { [type]: username },
        {},
        true,
        false // send JSON so API receives body (check-username/check-email expect JSON)
      );
      return data;
    } catch (err: any) {
      toast.error('Failed to validate username. Please try again.');
      return {
        status: false,
        message: 'Failed to validate username. Please try again.',
      };
    }
  };

  const debouncedValidateUsername = useCallback(
    debounce(
      async (
        username: string,
        setError: (field: string, opts: { type: string; message: string }) => void,
        clearErrors: (field: string) => void,
        type: string
      ) => {
        if (username.trim() === '') return;
        const result: { status: boolean; message: string } =
          await validateUsername(username, type);

        if (result?.status) {
          clearErrors(type);
        } else {
          setError(type, {
            type: 'manual',
            message:
              result?.message ||
              (type === 'email' ? 'Email is already taken.' : 'Username is already taken, please choose another.'),
          });
        }
      },
      500
    ),
    []
  );

  // When check-username/check-email return status: false (already in use), we set type: 'manual'
  const hasAlreadyInUseError = (errors: any): boolean => {
    return Object.values(errors).some((error: any) => error?.type === 'manual');
  };
  const isSubmitDisabled =
    isSubmitting ||
    !form.formState.isValid ||
    hasAlreadyInUseError(form.formState.errors);

  return (
    <div className="w-full">
      <h2 className="tf-title-heading ct style-1">Create your account</h2>

      <div className="box-login-email">
          <div className="form-inner">
            <Form {...form}>
              <form
                className="flex w-full flex-col justify-between gap-9"
                onSubmit={form.handleSubmit(handleSubmit)}
                id={formId}
              >
                <div className="flex flex-col gap-9 md:flex-row md:gap-10">
                  <div className="w-full">
                    <FormField
                      name="username"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Choose a Username"
                              withError={!!errors.username}
                              className="h-[48px]"
                              type="text"
                              {...field}
                              onChange={async (event) => {
                                const value = event.target.value;
                                field.onChange(value);
                                form.clearErrors('username');
                                const isValid = await form.trigger('username');
                                if (isValid && value.trim()) {
                                  debouncedValidateUsername(
                                    value,
                                    form.setError,
                                    form.clearErrors,
                                    'username'
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your Email Address"
                              withError={!!errors.email}
                              className="h-[48px]"
                              type="email"
                              {...field}
                              onChange={async (event) => {
                                const value = event.target.value;
                                field.onChange(value);
                                form.clearErrors('email');
                                const isValid = await form.trigger('email');
                                if (isValid && value.trim()) {
                                  debouncedValidateUsername(
                                    value,
                                    form.setError,
                                    form.clearErrors,
                                    'email'
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          withError={!!errors.password}
                          className="h-[48px]"
                          placeholder="Set Your Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>

                      {password.length > 0 && (
                        <ShowPasswordStrength form={form} errors={errors} />
                      )}
                    </FormItem>
                  )}
                />

                <div className="flex justify-center items-center">
                  <p
                    className="text-[12px] leading-[18px] text-[#C5B6B3] text-center"
                    style={{ letterSpacing: '0.1rem' }}
                  >
                    By clicking Create Account or Continue with Google,
                    Facebook, or Paypal, you agree to Yourprops{' '}
                    <a
                      href="https://www.yourprops.com/html/user_agreement.html"
                      target="_blank"
                      rel="noreferrer"
                      className="underline text-[#C5B6B3]"
                    >
                      User Agreement
                    </a>{' '}
                    and{' '}
                    <a
                      href="https://www.yourprops.com/html/privacy_policy.html"
                      target="_blank"
                      rel="noreferrer"
                      className="underline text-[#C5B6B3]"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>

                <button
                  disabled={isSubmitDisabled}
                  className="submit rounded-[10px] social-login-submit disabled:opacity-50"
                >
                  Create Account
                </button>
              </form>
            </Form>
          </div>

          <div className="box-title-login my-10">
            <h5>Or login to account</h5>
          </div>

          {isAuthPage ? (
            <Link
              to="/auth/signin"
              className="sc-button style-2 w-full fl-button pri-3 social-icon rounded-[10px] flex items-center justify-center"
            >
              <span className="ml-3">Login</span>
            </Link>
          ) : (
            <button
              onClick={() => toggleDialogVisibility(true, <SignIn />)}
              className="sc-button style-2 w-full fl-button pri-3 social-icon rounded-[10px]"
            >
              <span className="ml-3">Login</span>
            </button>
          )}
        </div>
    </div>
  );
};
