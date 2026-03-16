import { z } from 'zod';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useEffect, useId } from 'react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from '@your-props/client/ui';
import { request } from '@your-props/client/utils';

import logoheader from '../assets/images/logo/logo.svg';

export const contactSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .max(100, { message: 'Email must be at most 100 characters long' })
    .email({ message: 'Invalid email format' }),
});

export type ContactSchema = z.infer<typeof contactSchema>;

export const Footer = () => {
  const resourcesList = [
    {
      title: 'Home',
      link: '/',
    },
    {
      title: 'Book appointment',
      link: '/appointments/book',
    },
    {
      title: 'My appointments',
      link: '/appointments',
    },
  ];
  const companyList = [
    {
      title: 'About Us',
      link: '/',
    },
    {
      title: 'Privacy Policy',
      link: '/',
    },
    {
      title: 'Terms & Conditions',
      link: '/',
    },
  ];
  const socialList = [
    {
      icon: 'fab fa-facebook',
      link: '#',
    },
    {
      icon: 'fab fa-twitter',
      link: '#',
    },
    {
      icon: 'fab fa-google-plus',
      link: '#',
    },
    {
      icon: 'fab fa-twitch',
      link: '#',
    },
  ];

  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const formId = useId();

  const form = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: '',
    },
  });

  const { errors } = form.formState;

  const user = JSON.parse(localStorage.getItem('user') as string);

  const handleSubmit = async (formData: ContactSchema) => {
    try {
      const { data } = await request.post('/contact-us', {
        ...formData,
        subject: 'Subscription',
        message: 'I want to subscribe for news letter',
        name: user?.displayName || '',
      });
      toast.success('Query submitted successfully!');
      form.reset();
    } catch (err: any) {
      Object.values(err.response.data.messages).map((message) =>
        toast.error(message || 'Something went wrong!')
      );
    }
  };

  return (
    <div>
      <footer id="footer" className="footer-light-style clearfix">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-lg-3 col-md-12 col-12">
              <div className="widget-logo">
                <div id="logo-footer">
                  <Link to="/">
                    <div className="flex flex-row content-center items-center">
                      <img
                        src={logoheader}
                        alt="YourNHS"
                        className="w-[30px] h-[41px]"
                      />
                      <h1 className="font-[700] text-[36px] leading-[56px] capitalize ml-[6px]">
                        YourNHS
                      </h1>
                    </div>
                  </Link>
                </div>
                <p className="font-[400] text-[14px] leading-[22px]">
                  Lorem ipsum dolor sit amet,consectetur adipisicing elit. Quis
                  non, fugit totam vel laboriosam vitae.
                </p>
              </div>

              <div className="flex flex-row">
                <div className="widget-social style-1 mg-t32">
                  <ul>
                    {socialList.map((item, index) => (
                      <li key={index}>
                        <Link to={item.link}>
                          <i className={item.icon}></i>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-sm-6 col-7">
              <div className="widget widget-menu style-2">
                <h5 className="title-widget text-[18px] ">Menu</h5>
                <ul>
                  {resourcesList.map((item, index) => (
                    <li key={index}>
                      <Link to={item.link}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-sm-6 col-5">
              <div className="widget widget-menu fl-st-3">
                <h5 className="title-widget text-[18px]">Company</h5>
                <ul>
                  {companyList.map((item, index) => (
                    <li key={index}>
                      <Link to={item.link}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-lg-5 col-md-8 col-12 pl-lg-0">
              <div className="widget widget-subcribe">
                <h5 className="title-widget text-[18px]">Contact Us</h5>
                <p className="my-[20px] text-[14px] font-normal leading-[22px]">
                  Enter your email and we will get back to you shortly.
                </p>
                <Form {...form}>
                  <form id={formId} onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="row">
                      <div className="col-xl-8 col-lg-7 col-sm-8 col-12 pr-lg-0">
                        <FormField
                          name="email"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Email"
                                  withError={!!errors.email}
                                  className="email h-[46px]"
                                  type="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-xl-4 col-lg-5 col-sm-4 mt-sm-0 mt-4 col-12">
                        <button
                          type="submit"
                          className="sc-button fl-button pri-3 px-[25px] rounded-[10px] bg-[#676767] border-[#676767] focus:bg-[#EF6A3B] whitespace-nowrap h-[46px]"
                        >
                          <span style={{ fontWeight: 600 }}>Send Email</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {isVisible && <Link onClick={scrollToTop} to="#" id="scroll-top"></Link>}
    </div>
  );
};
