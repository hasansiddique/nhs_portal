import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import React, { useId, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  request,
  signInSchema,
  useAuthDialogStore,
  type ClientSignInSchema,
} from '@your-props/client/utils';
import {
  SvgAppleIcon,
  SvgFacebookIcon,
  SvgGoogleIcon,
  SvgPaypalIcon,
} from '@your-props/client/icons';

import { Input } from './input';
import { SignUp } from './sign-up';
import { Form, FormItem, FormField, FormControl, FormMessage } from './form';

export const SignIn = () => {
  const formId = useId();

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
      window.location.href = redirectUrl;
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <h2 className="tf-title-heading ct style-1">Log In to YourProps</h2>

        {loginWithSocial ? (
          <iframe width="600" height="450" src={socialLoginLink} />
        ) : (
          <>
            <div className="box-login-social">
              <div className="box-title-login">
                <h5>Log In with social</h5>
              </div>
              <ul className="mb-0">
                <li>
                  <button
                    disabled
                    // onClick={() => getSocialLoginLink('google')}
                    className="sc-button style-2 w-full fl-button pri-3 social-icon rounded-[10px]"
                  >
                    <SvgGoogleIcon />
                    <span className="ml-3 social-btns">Google</span>
                  </button>
                </li>
                <li>
                  <button
                    disabled
                    // onClick={() => getSocialLoginLink('facebook')}
                    className="sc-button style-2 w-full fl-button pri-3 social-icon rounded-[10px]"
                  >
                    <SvgFacebookIcon />
                    <span className="ml-3 social-btns">Facebook</span>
                  </button>
                </li>
              </ul>
              <ul>
                <li>
                  <button
                    disabled
                    // onClick={() => getSocialLoginLink('apple')}
                    className="sc-button style-2 w-full fl-button pri-3 social-icon rounded-[10px]"
                  >
                    <SvgAppleIcon />
                    <span className="ml-3 social-btns">Apple</span>
                  </button>
                </li>
                <li>
                  <button
                    disabled
                    // onClick={() => getSocialLoginLink('paypal')}
                    className="sc-button style-2 w-full fl-button pri-3 social-icon rounded-[10px]"
                  >
                    <SvgPaypalIcon />
                    <span className="ml-3 social-btns">Paypal</span>
                  </button>
                </li>
              </ul>
            </div>

            <div className="box-login-email">
              <div className="box-title-login">
                <h5>Or login with email</h5>
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
                              placeholder="Email Address"
                              withError={!!errors.username}
                              className="h-[48px]"
                              type="email"
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
                          <FormControl>
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
                      <Link to="#" className="forgot-pass">
                        Forgot Password?
                      </Link>
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

              <button
                onClick={() => toggleDialogVisibility(true, <SignUp />)}
                className="sc-button style-2 w-full fl-button pri-3 social-icon rounded-[10px]"
              >
                <span className="ml-3">Register</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
