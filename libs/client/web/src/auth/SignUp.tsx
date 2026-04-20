import { toast } from 'sonner';
import { debounce } from 'lodash';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { z } from 'zod';

import {
  Checkbox,
  Form,
  Input,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
  FormLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@your-props/client/ui';
import { request, useAuthDialogStore } from '@your-props/client/utils';

import { SignIn } from './SignIn';

type ClinicOption = {
  id: string;
  name: string;
  address: string | null;
  postcode: string | null;
};

const accountSchema = z
  .object({
    role: z.enum(['PATIENT', 'PRACTITIONER']),
    postcode: z.string().min(2, 'Enter your postcode').max(16, 'Postcode is too long'),
    username: z.string().min(4, 'Username must be at least 4 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters long'),
    locationIds: z.array(z.string()).min(1, 'Select at least one clinic'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type AccountSchema = z.infer<typeof accountSchema>;

export const SignUp = () => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/auth');
  const { toggleDialogVisibility } = useAuthDialogStore();

  const formId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clinicOptions, setClinicOptions] = useState<ClinicOption[]>([]);
  const [lookupLoading, setLookupLoading] = useState(false);

  const form = useForm<AccountSchema>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      role: 'PATIENT',
      postcode: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      locationIds: [],
    },
    mode: 'onChange',
  });

  const role = form.watch('role');
  const selectedIds = form.watch('locationIds');

  useEffect(() => {
    form.setValue('locationIds', []);
    setClinicOptions([]);
  }, [role, form]);

  const fetchClinics = useMemo(
    () =>
      debounce(async (postcode: string) => {
        const trimmed = postcode.trim();
        if (trimmed.length < 2) {
          setClinicOptions([]);
          setLookupLoading(false);
          return;
        }
        setLookupLoading(true);
        try {
          const { data } = await request.post<{ locations: ClinicOption[] }>(
            '/public/locations-by-postcode',
            { postcode: trimmed },
            {},
            true,
            false
          );
          const next = data?.locations ?? [];
          setClinicOptions(next);

          const allowed = new Set(next.map((l) => l.id));
          const cur = form.getValues('locationIds');
          form.setValue(
            'locationIds',
            cur.filter((id) => allowed.has(id)),
            { shouldValidate: true }
          );
        } catch {
          toast.error('Could not load clinics for that postcode.');
          setClinicOptions([]);
        } finally {
          setLookupLoading(false);
        }
      }, 450),
    [form]
  );

  useEffect(() => {
    return () => {
      fetchClinics.cancel();
    };
  }, [fetchClinics]);

  const validateAvailability = async (
    value: string,
    type: 'username' | 'email'
  ): Promise<{ status: boolean; message: string }> => {
    try {
      const { data } = await request.post(
        type === 'email' ? '/check-email' : '/check-username',
        { [type]: value },
        {},
        true,
        false
      );
      return data;
    } catch {
      return { status: false, message: 'Validation failed. Please try again.' };
    }
  };

  const debouncedValidate = useCallback(
    debounce(
      async (
        value: string,
        type: 'username' | 'email',
        setError: (field: any, opts: { type: string; message: string }) => void,
        clearErrors: (field: any) => void
      ) => {
        if (!value.trim()) return;
        const res = await validateAvailability(value, type);
        if (res.status) clearErrors(type);
        else
          setError(type, {
            type: 'manual',
            message: res.message || (type === 'email' ? 'Email is already taken.' : 'Username is already taken.'),
          });
      },
      500
    ),
    []
  );

  const hasAlreadyInUseError = (errors: Record<string, any>) =>
    Object.values(errors).some((e: any) => e?.type === 'manual');

  const isSubmitDisabled =
    isSubmitting || !form.formState.isValid || hasAlreadyInUseError(form.formState.errors);

  const toggleClinic = (id: string, checked: boolean) => {
    const cur = form.getValues('locationIds');
    if (checked) {
      if (!cur.includes(id)) form.setValue('locationIds', [...cur, id], { shouldValidate: true });
    } else {
      form.setValue(
        'locationIds',
        cur.filter((x) => x !== id),
        { shouldValidate: true }
      );
    }
  };

  const handleSubmit = async (values: AccountSchema) => {
    try {
      setIsSubmitting(true);

      const usernameRes = await validateAvailability(values.username, 'username');
      if (!usernameRes.status) {
        form.setError('username', { type: 'manual', message: usernameRes.message || 'Username is already taken.' });
        return;
      }

      const emailRes = await validateAvailability(values.email, 'email');
      if (!emailRes.status) {
        form.setError('email', { type: 'manual', message: emailRes.message || 'Email is already taken.' });
        return;
      }

      const { data } = await request.post(
        '/auth/signup',
        {
          role: values.role,
          username: values.username,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          postcode: values.postcode.trim(),
          locationIds: values.locationIds,
        },
        {},
        true,
        false
      );

      toast.success(data?.message || 'Account created successfully!');
      form.reset({
        role: 'PATIENT',
        postcode: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        locationIds: [],
      });
      setClinicOptions([]);

      // In modal mode, close. On /auth/signup page, keep the user and offer a login link.
      if (!isAuthPage) toggleDialogVisibility(false, <span />);
    } catch (err: any) {
      Object.values(err?.response?.data?.messages ?? { error: 'Sign up failed' }).forEach((m) => toast.error(String(m)));
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <FormField
                name="role"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-[48px]" withError={!!form.formState.errors.role}>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PATIENT">Patient</SelectItem>
                          <SelectItem value="PRACTITIONER">Doctor</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="postcode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#C5B6B3]">Postcode</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. SW1A 1AA or M1"
                        withError={!!form.formState.errors.postcode}
                        className="h-[48px]"
                        autoComplete="postal-code"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          fetchClinics(e.target.value);
                        }}
                      />
                    </FormControl>
                    <p className="text-xs text-[#C5B6B3]">
                      Enter your postcode, then choose one or more clinics below for appointments.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="text-[#C5B6B3]">Clinic locations</FormLabel>
                {lookupLoading ? (
                  <p className="text-sm text-[#C5B6B3]">Searching clinics…</p>
                ) : clinicOptions.length === 0 ? (
                  <p className="text-sm text-[#C5B6B3]">
                    {form.watch('postcode').trim().length >= 2
                      ? 'No clinics match that postcode. Try a nearby outward code (e.g. M1, SW1).'
                      : 'Type at least two characters of your postcode to see clinics.'}
                  </p>
                ) : role === 'PATIENT' ? (
                  <div className="max-h-[220px] space-y-3 overflow-y-auto rounded-[10px] border border-[#393939] bg-[#222222] p-3">
                    {clinicOptions.map((loc) => {
                      const picked = selectedIds.length === 1 && selectedIds[0] === loc.id;
                      return (
                        <label
                          key={loc.id}
                          className="flex cursor-pointer items-start gap-3 rounded-md px-1 py-1 hover:bg-[#2a2a2a]"
                        >
                          <input
                            type="radio"
                            name="clinic-location"
                            className="mt-1 size-4 accent-[#EF6A3B]"
                            checked={picked}
                            onChange={() => form.setValue('locationIds', [loc.id], { shouldValidate: true })}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-[#EBEBEB]">{loc.name}</span>
                            {loc.postcode ? <span className="block text-xs text-[#C5B6B3]">{loc.postcode}</span> : null}
                            {loc.address ? <span className="mt-0.5 block text-xs text-[#9ca3af]">{loc.address}</span> : null}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="max-h-[220px] space-y-3 overflow-y-auto rounded-[10px] border border-[#393939] bg-[#222222] p-3">
                    {clinicOptions.map((loc) => {
                      const checked = selectedIds.includes(loc.id);
                      return (
                        <label
                          key={loc.id}
                          className="flex cursor-pointer items-start gap-3 rounded-md px-1 py-1 hover:bg-[#2a2a2a]"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) => toggleClinic(loc.id, v === true)}
                            className="mt-1"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-[#EBEBEB]">{loc.name}</span>
                            {loc.postcode ? <span className="block text-xs text-[#C5B6B3]">{loc.postcode}</span> : null}
                            {loc.address ? <span className="mt-0.5 block text-xs text-[#9ca3af]">{loc.address}</span> : null}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {form.formState.errors.locationIds ? (
                  <p className="text-sm text-red-400">{form.formState.errors.locationIds.message}</p>
                ) : null}

                {role === 'PATIENT' ? (
                  <p className="text-xs text-[#C5B6B3]">Patients: choose one registered clinic for appointments.</p>
                ) : (
                  <p className="text-xs text-[#C5B6B3]">Doctors: tick every clinic where you will offer appointments.</p>
                )}
              </FormItem>

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
                            withError={!!form.formState.errors.username}
                            className="h-[48px]"
                            type="text"
                            {...field}
                            onChange={async (event) => {
                              const value = event.target.value;
                              field.onChange(value);
                              form.clearErrors('username');
                              const ok = await form.trigger('username');
                              if (ok && value.trim()) {
                                debouncedValidate(value, 'username', form.setError as any, form.clearErrors as any);
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
                            withError={!!form.formState.errors.email}
                            className="h-[48px]"
                            type="email"
                            {...field}
                            onChange={async (event) => {
                              const value = event.target.value;
                              field.onChange(value);
                              form.clearErrors('email');
                              const ok = await form.trigger('email');
                              if (ok && value.trim()) {
                                debouncedValidate(value, 'email', form.setError as any, form.clearErrors as any);
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
                        withError={!!form.formState.errors.password}
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

              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        withError={!!form.formState.errors.confirmPassword}
                        className="h-[48px]"
                        placeholder="Confirm Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
          <h5>Already have an account?</h5>
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
