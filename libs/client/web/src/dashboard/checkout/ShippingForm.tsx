import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import ReactSelect from 'react-select';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useId, useState } from 'react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  SpinnerSm,
} from '@your-props/client/ui';
import { CartItem, request, useCartState } from '@your-props/client/utils';

import { CheckoutSubmitted } from './CheckoutSubmitted';
import { reactSelectStyles } from '../../props/partials/utils';
import { shippingFormSchema, ShippingSchema } from './shipping.types';

async function validateAddress(value: string) {
  if (!value || value.trim().length === 0) return false;

  /**
   * TODO: ask client for actual API_KEY for google maps geocode api
   * */
  const API_KEY = 'AIzaSyAsUrQcsDroDmpE5jLYzjmx1jCww92wRlU';
  const encodedAddress = encodeURIComponent(value);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.status === 'OK' && data.results.length > 0;
  } catch (error) {
    console.error('Error validating address with Google API:', error);
    return false;
  }
}

export const ShippingForm = ({ setSelectedShippingCosts }: any) => {
  const formId = useId();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') as string);

  const token = Cookies.get('token');
  const isLoggedIn = !isEmpty(token);

  const { cartItems, cartCount } = useCartState();

  const form = useForm<ShippingSchema>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      phone: currentUser?.phone || '',
      country: currentUser?.countryId || '',
      state: currentUser?.stateId || '',
      city: currentUser?.cityId || '',
      zipcode: currentUser?.zipCode || '',
      address: currentUser?.address || '',
    },
    mode: 'onBlur',
  });

  const { errors } = form.formState;

  const [selectedShippingMethods, setSelectedShippingMethods] = useState<{
    [key: string]: string;
  }>({});
  const [countriesList, setCountriesList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [statesList, setStatesList] = useState([]);
  const [selectedState, setSelectedState] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [citiesList, setCitiesList] = useState([]);
  const [selectedCity, setSelectedCity] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [showSubmitted, setShowSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const storedCountryId = currentUser?.countryId;

      if (storedCountryId) {
        getCountriesList(storedCountryId);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getCountriesList();

      if (currentUser?.countryId) {
        form.setValue('country', currentUser.countryId || '');
      }
      if (currentUser?.stateId) {
        form.setValue(
          'state',
          currentUser.stateId !== '0' ? currentUser.stateId : ''
        );
      }
      if (currentUser?.cityId) {
        form.setValue(
          'city',
          currentUser.cityId !== '0' ? currentUser.cityId : ''
        );
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && selectedCountry?.value) {
      const storedStateId = currentUser?.stateId;

      getStatesListByCountry(selectedCountry?.value, storedStateId);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (isLoggedIn && selectedState?.value) {
      const storedCityId = currentUser?.cityId;

      getCitiesListByState(selectedState?.value, storedCityId);
    }
  }, [selectedState]);

  const getCountriesList = async (countryId?: string) => {
    try {
      const { data } = await request.get('/countries');
      setCountriesList(data?.countries);
      if (countryId) {
        const country = data?.countries?.find(
          (c: { id: string }) => c.id === countryId
        );
        setSelectedCountry({
          value: country?.id,
          label: country?.name,
        });
      }
    } catch (err: any) {
      const message = err.response?.data?.message;
      toast.error(String(message));
    }
  };

  const getStatesListByCountry = async (
    countryId: string,
    stateId?: string
  ) => {
    try {
      const { data } = await request.get(`/states/country/${countryId}`);
      setStatesList(data?.states || []);

      if (stateId) {
        const state = data?.states?.find(
          (c: { id: string }) => c.id === stateId
        );
        setSelectedState(state ? { value: state.id, label: state.name } : null);
      }
    } catch (err: any) {
      const message = err.response?.data?.message;
      toast.error(String(message));
    }
  };

  const getCitiesListByState = async (stateId: string, cityId?: string) => {
    try {
      const { data } = await request.get(`/cities/state/${stateId}`);
      setCitiesList(data?.cities || []);
      if (cityId) {
        const city = data?.cities?.find((c: { id: string }) => c.id === cityId);
        setSelectedCity(city ? { value: city?.id, label: city?.name } : null);
      }
    } catch (err: any) {
      const message = err.response?.data?.message;
      toast.error(String(message));
    }
  };

  const handleSubmit = async (formData: ShippingSchema) => {
    setLoading(true);
    try {
      const products: {
        quantity: string;
        productId: string;
        shippingMethod: string | null;
      }[] = [];

      cartItems?.forEach((product: { quantity: string; productId: string }) => {
        const shippingMethod =
          selectedShippingMethods[product.productId] || null;

        if (!shippingMethod) {
          throw new Error(`Please select a shipping method`);
        }

        products.push({
          quantity: product.quantity,
          productId: product.productId,
          shippingMethod: shippingMethod,
        });
      });

      const { data } = await request.post('/place-order', {
        ...formData,
        products,
      });

      if (data?.paymentLink && /^https?:\/\/.+$/.test(data.paymentLink)) {
        toast.info('You are being redirected to PayPal');
        window.location.href = data.paymentLink;
      } else {
        toast.success('Order placed successfully!');
        setShowSubmitted(true);
      }
    } catch (err: any) {
      console.log(err.message);
      if (err.response) {
        Object.values(err.response?.data.messages as string[]).map((message) =>
          toast.error(String(message))
        );
      } else {
        toast.error(err.message || 'Something went wrong.');
      }

      setLoading(false);
    }
  };

  const handleSelectShippingMethod = (itemId: string, methodKey: string) => {
    setSelectedShippingMethods((prev) => ({
      ...prev,
      [itemId]: methodKey,
    }));
  };

  const closeModal = () => {
    setShowSubmitted(false);
    navigate('/dashboard/orders');
  };

  const handleShippingMethod = (productId: string, cost: any) => {
    const cleanPrice = cost ? cost.replace('$', '') : '';
    const formattedPrice = Number(cleanPrice) || 0; // Defaults to 0 if NaN

    setSelectedShippingCosts((prevCosts: any) => {
      const updatedCosts = prevCosts.map((entry: any) =>
        entry.productId === productId
          ? { ...entry, cost: formattedPrice }
          : entry
      );

      if (!updatedCosts.some((entry: any) => entry.productId === productId)) {
        updatedCosts.push({ productId, cost: formattedPrice });
      }

      return updatedCosts;
    });
  };

  return (
    <>
      {showSubmitted && <CheckoutSubmitted closeModal={closeModal} />}

      <p className="text-[24px] font-bold leading-[44px] capitalize">
        Shipping Information
      </p>

      <div className="mt-8">
        <Form {...form}>
          <form
            className="flex w-full flex-col justify-between"
            onSubmit={form.handleSubmit(handleSubmit)}
            id={formId}
          >
            <div className="row">
              <div className="col-md-6">
                <FormField
                  name="firstName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-bold leading-[26px] text-white">
                        First Name
                      </FormLabel>

                      <FormControl>
                        <Input
                          withError={!!errors.firstName}
                          placeholder="First Name"
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
              <div className="col-md-6 sm:mt-0 mt-20">
                <FormField
                  name="lastName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-bold leading-[26px] text-white">
                        Last Name
                      </FormLabel>

                      <FormControl>
                        <Input
                          withError={!!errors.lastName}
                          placeholder="Last Name"
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

              <div className="col-md-12 mt-20">
                <FormField
                  name="address"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-bold leading-[26px] text-white">
                        Address
                      </FormLabel>

                      <FormControl>
                        <Input
                          withError={!!errors.address}
                          placeholder="Address"
                          className="h-[48px]"
                          type="text"
                          {...field}
                          onBlur={async (e) => {
                            const value = e.target.value;
                            const isValid = await validateAddress(value);
                            if (!isValid) {
                              form.setError('address', {
                                type: 'manual',
                                message: 'Please enter a valid address.',
                              });
                            } else {
                              form.clearErrors('address');
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-md-6 mt-20">
                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-bold leading-[26px] text-white">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          withError={!!errors.phone}
                          className="h-[48px]"
                          placeholder="Phone Number"
                          type="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-md-6 mt-20">
                <FormField
                  name="country"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-bold leading-[26px] text-white">
                        Country
                      </FormLabel>
                      <FormControl>
                        <ReactSelect
                          {...field}
                          value={selectedCountry}
                          onChange={(selectedOption) => {
                            form.setValue(
                              'country',
                              selectedOption?.value || ''
                            );
                            form.reset({
                              ...form.getValues(),
                              state: '',
                              city: '',
                            });
                            setSelectedState(null);
                            setSelectedCity(null);
                            setSelectedCountry(selectedOption);
                          }}
                          placeholder="Select Country"
                          classNamePrefix="custom-select"
                          options={countriesList.map(
                            (t: { id: string; name: string }) => ({
                              value: t.id,
                              label: t.name,
                            })
                          )}
                          styles={reactSelectStyles}
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              primary50: '#EF6A3B95',
                              primary25: '#EF6A3B95',
                              primary: '#EF6A3B',
                            },
                          })}
                        />
                      </FormControl>
                      <FormMessage>{errors.country?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-md-6 mt-20">
                <FormField
                  name="state"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-bold leading-[26px] text-white">
                        State
                      </FormLabel>
                      <FormControl>
                        <ReactSelect
                          {...field}
                          value={selectedState || null}
                          onChange={(selectedOption) => {
                            form.setValue('state', selectedOption?.value || '');
                            setSelectedState(selectedOption || null);
                          }}
                          placeholder="Select State"
                          classNamePrefix="custom-select"
                          options={statesList?.map(
                            (t: { id: string; name: string }) => ({
                              value: t.id,
                              label: t.name,
                            })
                          )}
                          styles={reactSelectStyles}
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              primary50: '#EF6A3B95',
                              primary25: '#EF6A3B95',
                              primary: '#EF6A3B',
                            },
                          })}
                        />
                      </FormControl>
                      {!selectedState && (
                        <FormMessage>{errors.state?.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-md-6 mt-20">
                <FormField
                  name="city"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-bold leading-[26px] text-white">
                        City
                      </FormLabel>
                      <FormControl>
                        <ReactSelect
                          {...field}
                          value={selectedCity || null}
                          onChange={(selectedOption) => {
                            form.setValue('city', selectedOption?.value || '');
                            setSelectedCity(selectedOption || null);
                          }}
                          placeholder="Select City"
                          classNamePrefix="custom-select"
                          options={citiesList?.map(
                            (t: { id: string; name: string }) => ({
                              value: t.id,
                              label: t.name,
                            })
                          )}
                          styles={reactSelectStyles}
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              primary50: '#EF6A3B95',
                              primary25: '#EF6A3B95',
                              primary: '#EF6A3B',
                            },
                          })}
                        />
                      </FormControl>
                      <FormMessage>{errors.city?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-md-6 mt-20">
                <FormField
                  name="zipcode"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-bold leading-[26px] text-white">
                        Zip Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          withError={!!errors.zipcode}
                          className="h-[48px]"
                          placeholder="Zipcode"
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

            {cartItems?.map((item: CartItem, index) => {
              if (!item?.shippingDetails) return null;

              const { shippingDetails } = item;

              const availableShippingMethods = [
                (shippingDetails.selfCollect === 1 ||
                  shippingDetails.selfCollect === '1') && {
                  key: 'self_collect',
                  cost: '$0',
                  days: '0 day',
                  heading: 'Local Pickup',
                  subHeading: 'Pick up your prop from the sellers location',
                },
                {
                  key: 'domestic',
                  cost: shippingDetails.domestic
                    ? `$${shippingDetails.domestic.fee}`
                    : null,
                  days: shippingDetails.domestic
                    ? `${shippingDetails.domestic.days} days`
                    : null,
                  heading: 'Domestic Shipping',
                  subHeading: `Prop will be shipped to you domestically.`,
                },
                {
                  key: 'international',
                  cost: shippingDetails.international
                    ? `$${shippingDetails.international.fee}`
                    : null,
                  days: shippingDetails.international
                    ? `${shippingDetails.international.days} days`
                    : null,
                  heading: 'International Shipping',
                  subHeading: `Prop will be shipped to you internationally.`,
                },
              ];

              return (
                cartCount !== 0 && (
                  <div key={index} className="mt-[40px]">
                    <p className="text-[18px] sm:text-[20px] font-bold sm:leading-[28px] capitalize mb-[20px]">
                      Shipping For <i>{item.title}</i>
                    </p>

                    <div className="flex gap-4">
                      <div className="hidden sm:block flex-shrink-0">
                        <img
                          alt=""
                          width={98}
                          height={98}
                          src={item.defaultImage}
                          className="rounded-[10px] object-cover"
                        />
                      </div>
                      <div className="flex-grow flex flex-col gap-5">
                        {availableShippingMethods
                          .filter(
                            (method): method is ShippingMethodInterface =>
                              method !== false
                          )
                          .map((method: ShippingMethodInterface, index) => {
                            if (
                              !method ||
                              (item.propCountryId === selectedCountry?.value &&
                                method.key === 'international') ||
                              (item.propCountryId !== selectedCountry?.value &&
                                (method.key === 'domestic' ||
                                  method.key === 'self_collect'))
                            ) {
                              return null;
                            }

                            const isSelected =
                              selectedShippingMethods[item.productId] ===
                              method.key;

                            return (
                              <ShippingMethodCard
                                method={method}
                                key={index}
                                selected={isSelected}
                                setSelectedShippingMethod={() => {
                                  handleSelectShippingMethod(
                                    item.productId,
                                    method.key
                                  );
                                  handleShippingMethod(
                                    item.productId,
                                    method.cost
                                  );
                                }}
                              />
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )
              );
            })}

            <div className="row mt-16">
              <div className="col-md-6 mt-4">
                <button
                  onClick={() => navigate('/props?sorting=1')}
                  className="pri-3 rounded-[10px] bg-[#676767] border-[#676767] whitespace-nowrap w-full h-full hover:opacity-90 hover:text-white hover:border-[#676767] focus:text-white"
                >
                  <span className="flex flex-row justify-center items-center">
                    Add More Items To Cart
                  </span>
                </button>
              </div>

              <div className="col-md-6 mt-4">
                <button
                  disabled={loading || cartCount === 0}
                  className="submit rounded-[10px] social-login-submit hover: focus:text-white text-white hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed w-full"
                >
                  {loading ? <SpinnerSm /> : 'Place Order'}
                </button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

interface ShippingMethodInterface {
  key: string;
  cost: string | null;
  days: string | null;
  heading: string;
  subHeading: string;
}

const ShippingMethodCard = ({
  method,
  selected,
  setSelectedShippingMethod,
}: {
  selected: boolean;
  method: ShippingMethodInterface;
  setSelectedShippingMethod: () => void;
}) => {
  return (
    <div
      onClick={setSelectedShippingMethod}
      className="flex-grow rounded-[10px] flex items-center py-4 px-5 cursor-pointer gap-10 select-none min-h-[90px]"
      style={{
        border: `1px solid ${selected ? '#EF6A3B' : '#393939E5'}`,
      }}
    >
      <div className="flex justify-center items-center">
        <div
          className="flex justify-center items-center bg-transparent rounded-[100px] w-[20px] h-[20px]"
          style={{
            border: `1px solid ${selected ? '#EF6A3B' : '#FFFFFF'}`,
          }}
        >
          {selected && (
            <div
              className="bg-[#EF6A3B] rounded-[100px] w-[10px] h-[10px]"
              style={{ border: '1px solid #EF6A3B' }}
            />
          )}
        </div>
      </div>
      <div className="flex-grow flex flex-col">
        <p className="text-[16px] font-bold leading-[26px]">{method.heading}</p>
        <p className="text-[16px] font-normal leading-[26px]">
          {method.subHeading}
        </p>
      </div>
      <div className="text-center w-[80px]">
        {method.key !== 'self_collect' && method.cost && method.days ? (
          <>
            <h4 className="mb-3">{method.cost || '-'}</h4>
            <div className="text-[12px] leading-[14px]">
              Delivery in
              <span className="block font-bold">{method?.days || '-'}</span>
            </div>
          </>
        ) : (
          <span className="text-[14px] leading-[18px]">
            To be quoted by the seller
          </span>
        )}
      </div>
    </div>
  );
};
