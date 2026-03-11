import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import React, { useId, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  Input,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from '@your-props/client/ui';
import {
  request,
  useAuthDialogStore,
  forgotPasswordSchema,
  type ClientForgotPasswordSchema,
} from '@your-props/client/utils';
import { SignIn } from './SignIn';

export const ForgotPassword = () => {
  const formId = useId();

  const [passwordLinkSent, setPasswordLinkSent] = useState(false);

  const form = useForm<ClientForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const { errors } = form.formState;
  const { toggleDialogVisibility } = useAuthDialogStore();
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/auth');

  const handleSubmit = async (formData: ClientForgotPasswordSchema) => {
    try {
      const { data } = await request.post('/auth/forgot-password', {
        ...formData,
        redirectUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/set-password`,
      });
      setPasswordLinkSent(true);
      // toast.success(data?.message || 'Email sent successfully!');
      // toggleDialogVisibility(false, null);
    } catch (err: any) {
      Object.values(err.response.data.messages).map((message) =>
        toast.error(String(message))
      );
    }
  };

  return (
    <div className="w-full">
      {passwordLinkSent ? (
        <>
          <h2 className="tf-title-heading ct style-1">
            Reset Your Password
          </h2>

          <div className="box-login-email">
            <p className="text-[20px] font-[600] leading-[26px] text-center">
              If your email address is registered, you will receive a
              password reset link in your email.
            </p>

            <p className="py-[12px] text-[#C5B6B3] text-[18px] leading-[28px] text-center">
              Please follow instructions in email to set your password.
            </p>

            {isAuthPage ? (
              <Link
                to="/auth/signin"
                className="submit rounded-[10px] social-login-submit focus:text-white hover:text-white mt-12 w-full inline-block text-center"
              >
                Back to sign in
              </Link>
            ) : (
              <button
                onClick={() => toggleDialogVisibility(true, <SignIn />)}
                className="submit rounded-[10px] social-login-submit focus:text-white hover:text-white mt-12 w-full"
              >
                Close
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="tf-title-heading ct style-1">
            Reset Your Password
          </h2>

          <div className="box-login-email">
            <p className="text-[20px] font-[600] leading-[26px]">
              Forgot your password?
            </p>

            <p className="py-[12px] text-[#C5B6B3] text-[18px] leading-[28px]">
              Please enter your email so we can share a link for you to
              reset your password.
            </p>

            <div className="form-inner">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  id={formId}
                >
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <button
                    type="submit"
                    className="submit rounded-[10px] social-login-submit mt-12"
                  >
                    Reset
                  </button>

                  <div className="box-title-login my-10">
                    <h5>Or login to account</h5>
                  </div>

                  {isAuthPage ? (
                    <Link
                      to="/auth/signin"
                      className="sc-button style-2 w-full fl-button pri-3 social-icon !bg-[#676767] rounded-[10px] flex items-center justify-center"
                    >
                      <span className="ml-3">Login</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => toggleDialogVisibility(true, <SignIn />)}
                      className="sc-button style-2 w-full fl-button pri-3 social-icon !bg-[#676767] rounded-[10px]"
                    >
                      <span className="ml-3">Login</span>
                    </button>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
