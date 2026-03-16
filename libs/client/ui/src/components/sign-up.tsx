import { toast } from 'sonner';
import React, { useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  request,
  signUpSchema2,
  useAuthDialogStore,
  type ClientSignUpSchema2,
} from '@your-props/client/utils';
import {
  SvgAppleIcon,
  SvgFacebookIcon,
  SvgGoogleIcon,
  SvgPaypalIcon,
} from '@your-props/client/icons';

import { Input } from './input';
import { SignIn } from './sign-in';
import { Form, FormItem, FormField, FormControl, FormMessage } from './form';

export const SignUp = () => {
  const { toggleDialogVisibility } = useAuthDialogStore();

  const formId = useId();

  const form = useForm<ClientSignUpSchema2>({
    resolver: zodResolver(signUpSchema2),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
  });

  const { errors } = form.formState;

  const handleSubmit = async (formData: ClientSignUpSchema2) => {
    try {
      const { data } = await request.post(
        '/auth/signup',
        { ...formData, type: '2' },
        {},
        true,
        false // send JSON so API receives body
      );
      const userMessage = data.message;

      toast.success(userMessage || 'Account created successfully!');

      toggleDialogVisibility(false, <span />);
    } catch (err: any) {
      Object.values(err.response.data.messages).map((message) =>
        toast.error(String(message))
      );
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <h2 className="tf-title-heading ct style-1">Signup with social</h2>

        <div className="box-login-social">
          <div className="box-title-login">
            <h5>Signup with social</h5>
          </div>
          <ul className="mb-0">
            <li>
              <span
                // to="#"
                className="sc-button style-2 w-full fl-button pri-3 social-icon rounded-[10px]"
              >
                <SvgGoogleIcon />
                <span className="ml-3 social-btns">Google</span>
              </span>
            </li>
            <li>
              <span
                // to="#"
                className="sc-button style-2 w-full fl-button pri-3 social-icon rounded-[10px]"
              >
                <SvgFacebookIcon />
                <span className="ml-3 social-btns">Facebook</span>
              </span>
            </li>
          </ul>
          <ul>
            <li>
              <span
                // to="#"
                className="sc-button style-2 w-full fl-button pri-3 social-icon rounded-[10px]"
              >
                <SvgAppleIcon />
                <span className="ml-3 social-btns">Apple</span>
              </span>
            </li>
            <li>
              <span
                // to="#"
                className="sc-button style-2 w-full fl-button pri-3 social-icon rounded-[10px]"
              >
                <SvgPaypalIcon />
                <span className="ml-3 social-btns">Paypal</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="box-login-email">
          <div className="box-title-login">
            <h5>Or signup with email</h5>
          </div>

          <div className="form-inner">
            <Form {...form}>
              <form
                className="flex w-full flex-col justify-between gap-9"
                onSubmit={form.handleSubmit(handleSubmit)}
                id={formId}
              >
                <div className="row">
                  <div className="col-md-6">
                    <FormField
                      name="first_name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your First Name"
                              withError={!!errors.first_name}
                              className="h-[48px]"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-md-6">
                    <FormField
                      name="last_name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your Last Name"
                              withError={!!errors.last_name}
                              className="h-[48px]"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

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
                </div>

                <button className="submit rounded-[10px] social-login-submit">
                  Sign Up
                </button>
              </form>
            </Form>
          </div>

          <div className="box-title-login my-10">
            <h5>Or login to account</h5>
          </div>

          <button
            onClick={() => toggleDialogVisibility(true, <SignIn />)}
            className="sc-button style-2 w-full fl-button pri-3 social-icon rounded-[10px]"
          >
            <span className="ml-3">Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
