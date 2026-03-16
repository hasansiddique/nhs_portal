import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useId, useState } from 'react';

import {
  Form,
  Input,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
  Spinner,
  ShowPasswordStrength,
} from '@your-props/client/ui';
import {
  request,
  setPasswordSchema,
  useAuthDialogStore,
  type ClientSetPasswordSchema,
} from '@your-props/client/utils';

import { ForgotPassword } from './ForgotPassword';

export const SetPassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    verifyToken();
  }, []);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/auth');

  const formId = useId();
  const { toggleDialogVisibility } = useAuthDialogStore();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordLinkUnVerified, setPasswordLinkUnVerified] = useState(false);

  const form = useForm<ClientSetPasswordSchema>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      confirmPassword: '',
      password: '',
    },
  });

  const { errors } = form.formState;
  const password = form.getValues('password');

  const verifyToken = async () => {
    setIsLoading(true);
    try {
      const { data } = await request.post('/auth/verify-reset-token', {
        reset_token: token,
      });
      setPasswordLinkUnVerified(!data?.status);
      toast.success('Reset token verified successfully!');
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: ClientSetPasswordSchema) => {
    setIsLoading(true);
    try {
      const { data } = await request.post('/auth/reset-password', {
        ...formData,
        reset_token: token,
      });
      toast.success('Password updated successfully!');
      navigate('/auth/protected-signin');
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="my-10">
          <Spinner />
        </div>
      ) : passwordLinkUnVerified ? (
        <>
          <h2 className="tf-title-heading ct style-1">Update Password</h2>

          <div className="box-login-email flex items-center flex-col">
            <p className="text-[20px] font-[600] leading-[26px] text-center">
              The reset link has expired. Click below to request a new link.
            </p>

            <p className="py-[12px] text-[#C5B6B3] text-[18px] leading-[28px] text-center">
              Please follow instructions in email to set your password.
            </p>

            {isAuthPage ? (
              <Link
                to="/auth/forgot-password"
                className="submit rounded-[10px] social-login-submit mt-12 focus:text-white hover:text-white inline-block text-center"
              >
                Request new reset link
              </Link>
            ) : (
              <button
                onClick={() => toggleDialogVisibility(true, <ForgotPassword />)}
                className="submit rounded-[10px] social-login-submit mt-12 focus:text-white hover:text-white"
              >
                Reset Password
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="tf-title-heading ct style-1">Update Password</h2>

          <div className="box-login-email">
            <p className="text-[20px] font-[600] leading-[26px]">
              Forgot your password?
            </p>

            <p className="py-[12px] text-[#C5B6B3] text-[18px] leading-[28px]">
              Please enter your new password to reset your password.
            </p>

            <div className="form-inner">
              <Form {...form}>
                <form
                  className="flex w-full flex-col justify-between"
                  onSubmit={form.handleSubmit(handleSubmit)}
                  id={formId}
                >
                  <div className="mt-4">
                    <FormField
                      name="password"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="New Password"
                              withError={!!errors.password}
                              className="h-[48px]"
                              type="password"
                              {...field}
                            />
                          </FormControl>

                          {password.length > 0 && (
                            <ShowPasswordStrength form={form} errors={errors} />
                          )}

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-10">
                    <FormField
                      name="confirmPassword"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              withError={!!errors.confirmPassword}
                              placeholder="Confirm Password"
                              className="h-[48px]"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <button className="mt-12 submit rounded-[10px] social-login-submit focus:text-white hover:text-white disabled:opacity-50">
                    Reset Password
                  </button>
                </form>
              </Form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
