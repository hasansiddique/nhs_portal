import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import React, { useId, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
  signInSchema,
  useAuthDialogStore,
  type ClientSignInSchema,
} from '@your-props/client/utils';
import {
  SvgFacebookIcon,
  SvgGoogleIcon,
  SvgPaypalIcon,
} from '@your-props/client/icons';

import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';

export const SignIn = ({ redirectUrl }: { redirectUrl?: string }) => {
  const formId = useId();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/auth');

  const { toggleDialogVisibility } = useAuthDialogStore();

  const [loginWithSocial, setLoginWithSocial] = useState(false);
  const [socialLoginLink, setSocialLoginLink] = useState('');

  const form = useForm<ClientSignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { errors } = form.formState;

  const handleSubmit = async (formData: ClientSignInSchema) => {
    try {
      const { data } = await request.post(
        '/auth/login',
        formData,
        {},
        true,
        false // send JSON so API receives body
      );
      const sessionId = data.token;
      const user = data.user;

      toast.success('Logged in successfully!');

      Cookies.set('token', `Bearer ${sessionId}`);
      localStorage.setItem('user', JSON.stringify(user));
      toggleDialogVisibility(false, <span />);

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      Object.values(err.response.data.messages).map((message) =>
        toast.error(String(message))
      );
    }
  };

  const getSocialLoginLink = async (loginType: string) => {
    setLoginWithSocial(true);

    try {
      const { data } = await request.post(`/auth/sso-login/${loginType}`, {
        redirect_url: loginType,
      });
      const redirectUrl = data.redirectUrl;
      setSocialLoginLink(redirectUrl);
      window.open(redirectUrl, '_blank', 'noopener,noreferrer');

      // window.location.href = redirectUrl;
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="w-full">
      <h2 className="tf-title-heading ct style-1">Sign in</h2>

      <div className="box-login-social">
          <div className="box-title-login sm mb-0">
            <h5>Login with</h5>
          </div>
          <div className="flex gap-6 justify-center items-center my-4">
            <div>
              <button
                disabled
                title="Google"
                onClick={() => getSocialLoginLink('google')}
                className="sc-button style-2 w-full !p-[8px] fl-button pri-3 social-icon rounded-[100px]"
              >
                <SvgGoogleIcon />
              </button>
            </div>
            <div>
              <button
                disabled
                title="Facebook"
                onClick={() => getSocialLoginLink('facebook')}
                className="sc-button style-2 w-full !p-[8px] fl-button pri-3 social-icon rounded-[100px]"
              >
                <SvgFacebookIcon />
              </button>
            </div>
            <div>
              <button
                title="Paypal"
                onClick={() => getSocialLoginLink('paypal')}
                className="sc-button style-2 w-full !p-[8px] fl-button pri-3 social-icon rounded-[100px]"
              >
                <SvgPaypalIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="box-login-email">
          <div className="box-title-login">
            <h5>Or login with Username</h5>
          </div>

          <div className="form-inner">
            <Form {...form}>
              <form
                className="flex w-full flex-col justify-between gap-9"
                onSubmit={form.handleSubmit(handleSubmit)}
                id={formId}
              >
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Username or Email"
                          withError={!!errors.username}
                          className="h-[48px]"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="relative">
                        <Input
                          withError={!!errors.password}
                          className="h-[48px]"
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="row-form style-1 mb-0">
                  <label>
                    <input type="checkbox" />
                    <span className="btn-checkbox"></span>
                    <span>Remember me</span>
                  </label>
                  {isAuthPage ? (
                    <Link to="/auth/forgot-password" className="forgot-pass cursor-pointer">
                      Forgot Password?
                    </Link>
                  ) : (
                    <span
                      onClick={() =>
                        toggleDialogVisibility(true, <ForgotPassword />)
                      }
                      className="forgot-pass cursor-pointer"
                    >
                      Forgot Password?
                    </span>
                  )}
                </div>

                <button className="submit rounded-[10px] social-login-submit">
                  Login
                </button>
              </form>
            </Form>
          </div>

          <div className="box-title-login my-10">
            <h5>Or create account</h5>
          </div>

          {isAuthPage ? (
            <Link
              to="/auth/signup"
              className="sc-button style-2 w-full fl-button pri-3 social-icon rounded-[10px] flex items-center justify-center"
            >
              <span className="ml-3">Register</span>
            </Link>
          ) : (
            <button
              onClick={() => toggleDialogVisibility(true, <SignUp />)}
              className="sc-button style-2 w-full fl-button pri-3 social-icon rounded-[10px]"
            >
              <span className="ml-3">Register</span>
            </button>
          )}
        </div>
    </div>
  );
};
