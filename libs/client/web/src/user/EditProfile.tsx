/* eslint-disable @nx/enforce-module-boundaries */
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { request } from '@your-props/client/utils';
import { SvgFacebookIcon, SvgTrashIcon } from '@your-props/client/icons';
import { Breadcrumbs, Input, Spinner, Textarea } from '@your-props/client/ui';

import defaultProfileImage from '../theme/assets/images/avatar/user-img.png';
import { reactSelectStyles } from '../props/partials/utils';
import ReactSelect from 'react-select';

export const EditProfile = () => {
  const params = useParams();
  const navigate = useNavigate();

  const loggedInUserId = params.id;

  const user = JSON.parse(localStorage.getItem('user') as string);
  const userId = user?.id;

  useEffect(() => {
    if (loggedInUserId !== userId) {
      navigate(`/dashboard/props`);
    }
  }, [loggedInUserId, userId]);

  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [facebookLink, setFacebookLink] = useState('');
  const [profileData, setProfileData] = useState({
    userDetails: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      aboutMe: '',
      avatar: '',
      countryId: '',
      stateId: '',
      cityId: '',
    },
  });

  const [updatingUserDetails, setUpdatingUserDetails] = useState(false);
  const [initialProfileData, setInitialProfileData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    avatar: '',
    countryId: '',
    stateId: '',
    cityId: '',
    aboutMe: '',
  });

  const [userData, setUserData] = useState({
    aboutMe: '',
    firstName: '',
    lastName: '',
    countryId: '',
    stateId: '',
    cityId: '',
  });

  const [initialLocationData, setInitialLocationData] = useState({
    country:
      {
        id: '',
        name: '',
      } || null,
    city:
      {
        id: '',
        name: '',
      } || null,
    state:
      {
        id: '',
        name: '',
      } || null,
  });

  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [validatedImage, setValidatedImage] = useState(defaultProfileImage);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    country?: string;
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

  useEffect(() => {
    const validateImage = (url: unknown, defaultImage: unknown) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => resolve(defaultImage);
        if (typeof url === 'string') {
          img.src = url;
        }
      });
    };

    validateImage(profileImage, defaultProfileImage).then((validUrl) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setValidatedImage(validUrl);
    });
  }, [profileImage]);

  useEffect(() => {
    getCountriesList();
    getProfileDetails();
  }, []);

  useEffect(() => {
    if (selectedCountry && selectedCountry?.value) {
      getStatesListByCountry(selectedCountry?.value);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState && selectedState?.value) {
      getCitiesListByState(selectedState?.value);
    }
  }, [selectedState]);

  useEffect(() => {
    setUserData({
      aboutMe: profileData?.userDetails?.aboutMe,
      firstName: profileData?.userDetails?.firstName,
      lastName: profileData?.userDetails?.lastName,
      cityId: profileData?.userDetails?.cityId,
      countryId: profileData?.userDetails?.countryId,
      stateId: profileData?.userDetails?.stateId,
    });

    setProfileImage(profileData?.userDetails?.avatar);
  }, [profileData]);

  const getCountriesList = async () => {
    try {
      const { data } = await request.get('/countries');
      setCountriesList(data?.countries);
      return data?.countries;
    } catch (err: any) {
      const message = err.response?.data?.message;
      toast.error(String(message));
    }
  };

  const getStatesListByCountry = async (countryId: string) => {
    try {
      const { data } = await request.get(`/states/country/${countryId}`);
      setStatesList(data?.states);
      return data?.states;
    } catch (err: any) {
      const message = err.response?.data?.message;
      toast.error(String(message));
    }
  };

  const getCitiesListByState = async (stateId: string) => {
    try {
      const { data } = await request.get(`/cities/state/${stateId}`);
      setCitiesList(data?.cities);
      return data?.cities;
    } catch (err: any) {
      const message = err.response?.data?.message;
      toast.error(String(message));
    }
  };

  const getProfileDetails = async () => {
    setFetchingProfile(true);

    try {
      const { data } = await request.post(`/profile/${loggedInUserId}`, {
        listing_type: 'all',
      });
      setProfileData(data?.data);
      setInitialProfileData(data?.data?.userDetails);

      const userDetails = data?.data?.userDetails;
      let updatedInitialLocData = { ...initialLocationData };

      // Set default selected country
      if (userDetails?.countryId) {
        const countries = await getCountriesList();
        const matchingCountry: { id: string; name: string } = countries.find(
          (country: { id: string }) => country.id === userDetails.countryId
        );
        if (matchingCountry) {
          setSelectedCountry({
            value: matchingCountry.id,
            label: matchingCountry.name,
          });

          updatedInitialLocData = {
            ...updatedInitialLocData,
            country: { id: matchingCountry.id, name: matchingCountry.name },
          };
        }
      }

      // Set default selected state
      if (userDetails?.stateId) {
        const states = await getStatesListByCountry(userDetails.countryId);
        const matchingState: { id: string; name: string } = states.find(
          (state: { id: string }) => state.id === userDetails.stateId
        );
        if (matchingState) {
          setSelectedState({
            value: matchingState.id,
            label: matchingState.name,
          });
          updatedInitialLocData = {
            ...updatedInitialLocData,
            state: { id: matchingState.id, name: matchingState.name },
          };
        }
      }

      // Set default selected city
      if (userDetails?.cityId) {
        const cities = await getCitiesListByState(userDetails.stateId);
        const matchingCity: { id: string; name: string } = cities?.find(
          (city: { id: string }) => city.id === userDetails.cityId
        );
        if (matchingCity) {
          setSelectedCity({
            value: matchingCity.id,
            label: matchingCity.name,
          });

          updatedInitialLocData = {
            ...updatedInitialLocData,
            city: { id: matchingCity.id, name: matchingCity.name },
          };
        }
      }
      setInitialLocationData(updatedInitialLocData);
    } catch (err: any) {
      console.log(err);
      // toast.error(err.response.data.message);
    } finally {
      setFetchingProfile(false);
    }
  };

  const updateUsersDetails = async () => {
    setUpdatingUserDetails(true);
    const validationErrors: {
      firstName?: string;
      lastName?: string;
      country?: string;
    } = {};

    if (!userData?.firstName)
      validationErrors.firstName = 'First name is required';
    if (!userData?.lastName)
      validationErrors.lastName = 'Last name is required';
    if (!selectedCountry?.value)
      validationErrors.country = 'Country is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setUpdatingUserDetails(false);
      return;
    }

    try {
      const { data } = await request.post(`/update-profile`, {
        about_me: userData?.aboutMe,
        first_name: userData?.firstName,
        last_name: userData?.lastName,
        profile_image: profileImage,
        cover_image: '',
        country: selectedCountry?.value || '',
        state: selectedState?.value || '',
        city: selectedCity?.value || '',
      });
      localStorage.setItem('user', JSON.stringify(data?.data));
      toast.success(data.message);
      setErrors({}); // Clear errors on successful submission
    } catch (err: any) {
      console.log(err);
      // Object.values(err.response.data.messages).map((message) =>
      //   toast.error(String(message))
      // );
    } finally {
      setUpdatingUserDetails(false);
    }
  };

  const handleUserDataUpdate = (event: {
    target: { value: any; name: any };
  }) => {
    const { value, name } = event.target;

    //will accept characters only
    const validValue = value.replace(/[^a-zA-Z\s]/g, '');

    setUserData({ ...userData, [name]: validValue });
  };

  const handleProfileImageChange = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setProfileImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetDefaultProfileImage = async () => {
    try {
      const response = await fetch(defaultProfileImage);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Image = reader.result as string;
        // Set the base64 image wherever needed
        setProfileImage(base64Image);
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error converting image to base64:', error);
    }
  };

  const handleUndoChanges = () => {
    if (initialProfileData) {
      setUserData({
        firstName: initialProfileData.firstName,
        lastName: initialProfileData.lastName,
        aboutMe: initialProfileData.aboutMe || '',
        cityId: initialProfileData.cityId || '',
        countryId: initialProfileData.countryId || '',
        stateId: initialProfileData.stateId || '',
      });

      setFacebookLink('');
      setProfileImage(initialProfileData.avatar || defaultProfileImage);

      setSelectedCountry(
        initialLocationData?.country?.id
          ? {
              value: initialLocationData?.country?.id,
              label: initialLocationData?.country?.name,
            }
          : null
      );
      setSelectedState(
        initialLocationData?.state?.id
          ? {
              value: initialLocationData?.state?.id,
              label: initialLocationData?.state?.name,
            }
          : null
      );
      setSelectedCity(
        initialLocationData?.city?.id
          ? {
              value: initialLocationData?.city?.id,
              label: initialLocationData?.city?.name,
            }
          : null
      );
    }
  };

  const breadCrumbs = [
    {
      label: 'Home',
      isActive: false,
      redirectUrl: '/',
    },
    {
      label: 'Dashboard',
      isActive: false,
      redirectUrl: '/dashboard/props',
    },
    { label: 'Edit Profile', isActive: true },
  ];

  return (
    <div
      className={`${
        document.body.style.overflow === 'hidden'
          ? 'overflow-y-auto h-[100vh]'
          : ''
      }`}
    >
      <Breadcrumbs breadCrumbs={breadCrumbs} />

      {fetchingProfile ? (
        <div className="my-10">
          <Spinner />
        </div>
      ) : (
        <section className="tf-section featured-props-section pb-28 pt-[30px] md:pt-0">
          <div className="themesflat-container">
            <div className="w-full flex flex-col lg:flex-row items-start">
              <div className="w-full max-w-[340px] mb-20">
                <div className="rounded-3xl sc-card-product p-4">
                  <div
                    className={`${
                      validatedImage === defaultProfileImage
                        ? 'w-full h-[295px] bg-[#303030] rounded-2xl'
                        : ''
                    }`}
                  >
                    <img
                      alt="profile"
                      src={
                        validatedImage === defaultProfileImage
                          ? defaultProfileImage
                          : validatedImage
                      }
                      className={`${
                        validatedImage === defaultProfileImage
                          ? 'h-full object-contain'
                          : 'h-[295px] object-cover'
                      } w-full rounded-2xl`}
                    />
                  </div>

                  <div className="pt-10">
                    <button className="w-full h-[48px] py-0 bg-transparent rounded-[10px] border-[#EF6A3B] text-white border-[1px] hover:border-white hover:text-white focus:bg-transparent focus:text-white focus:border-[#EF6A3B]">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="profile-image-upload"
                        onChange={handleProfileImageChange}
                      />
                      <label
                        htmlFor="profile-image-upload"
                        className="text-[14px] w-full bg-transparent rounded-[10px] border-[#EF6A3B] text-white border-[1px] hover:border-white hover:text-white focus:bg-transparent active:bg-transparent focus:text-white focus:border-[#EF6A3B] cursor-pointer p-2 text-center"
                      >
                        Upload New Photo
                      </label>
                    </button>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleSetDefaultProfileImage}
                      className="flex flex-row justify-center items-center text-[14px] w-full bg-transparent rounded-[10px] border-transparent text-white border-[1px] hover:border-transparent focus:bg-transparent focus:text-white focus:border-transparent"
                    >
                      <SvgTrashIcon />
                      <span className="ml-2">Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className={`w-full lg:pl-[40px]`}>
                <div className="flex justify-end mb-3">
                  <button
                    onClick={() =>
                      navigate(`/user/${userId}/details`, {
                        state: { showPublicBtn: true },
                      })
                    }
                    className="sc-button style-2 fl-button pri-3 social-icon px-4 rounded-[10px] h-[40px] py-0 focus:text-white hover:text-white hover:opacity-90"
                  >
                    Public View
                  </button>
                </div>

                <div className="w-full flex flex-col lg:flex-row gap-[40px]">
                  <div className="w-full">
                    <h2 className="text-[20px] font-[700] leading-[26px]">
                      Account Info
                    </h2>

                    <div className="pt-8" />

                    <div className="flex flex-col">
                      <p className="text-[14px] text-white leading-[22px] font-bold">
                        Email
                      </p>
                      <Input
                        className="h-[40px] text-white text-[14px] mt-2"
                        value={profileData?.userDetails.email}
                        placeholder="Email"
                        name="email"
                        type="text"
                        disabled
                      />
                    </div>

                    <div className="pt-8" />

                    <div className="flex flex-col">
                      <p className="text-[14px] text-white leading-[22px] font-bold">
                        Username
                      </p>
                      <Input
                        className="h-[40px] text-white text-[14px] mt-2"
                        value={profileData?.userDetails.username}
                        placeholder="Username"
                        name="username"
                        type="text"
                        disabled
                      />
                    </div>

                    <div className="pt-8" />

                    <div className="flex gap-4">
                      <div className="flex flex-col w-full">
                        <p className="text-[14px] text-white leading-[22px] font-bold">
                          First Name
                        </p>
                        <Input
                          className="h-[40px] text-white text-[14px] mt-2"
                          onChange={handleUserDataUpdate}
                          value={userData?.firstName}
                          placeholder="First Name"
                          name="firstName"
                          type="text"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-[12px] mt-1">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-[14px] text-white leading-[22px] font-bold">
                          Last Name
                        </p>
                        <Input
                          className="h-[40px] text-white text-[14px] mt-2"
                          onChange={handleUserDataUpdate}
                          value={userData?.lastName}
                          placeholder="Last Name"
                          name="lastName"
                          type="text"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-[12px] mt-1">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] pt-1 pl-1">
                      First and Last Name won't be displayed publicly
                    </p>

                    <div className="pt-8" />

                    <div className="flex flex-col">
                      <p className="text-[14px] leading-[22px] font-bold">
                        Bio <span className="text-muted">(Optional)</span>
                      </p>
                      <Textarea
                        maxLength={225}
                        rows={5}
                        name="aboutMe"
                        placeholder="Tell us about yourself..."
                        value={userData?.aboutMe}
                        onChange={handleUserDataUpdate}
                        className="mt-2 border-[#8a8aa04d] text-white text-[14px]"
                      />
                    </div>

                    <div className="pt-8" />

                    <div className="flex flex-col">
                      <p className="text-[14px] text-white leading-[22px] font-bold mb-2">
                        Country
                      </p>
                      <ReactSelect
                        value={selectedCountry}
                        onChange={(selectedOption) => {
                          setSelectedCountry(selectedOption);
                          setSelectedState(null);
                          setSelectedCity(null);
                        }}
                        placeholder="Select Country"
                        classNamePrefix="custom-select"
                        options={
                          countriesList.map(
                            (t: { id: string; name: string }) => ({
                              value: t.id,
                              label: t.name,
                            })
                          ) || []
                        }
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
                      {errors.country && (
                        <p className="text-red-500 text-[12px] mt-1">
                          {errors.country}
                        </p>
                      )}
                    </div>

                    <div className="pt-8" />

                    <div className="flex flex-col">
                      <p className="text-[14px] text-white leading-[22px] font-bold mb-2">
                        State
                      </p>
                      <ReactSelect
                        value={selectedState}
                        onChange={(selectedOption) => {
                          setSelectedState(selectedOption);
                        }}
                        placeholder="Select State"
                        classNamePrefix="custom-select"
                        options={
                          statesList?.map(
                            (t: { id: string; name: string }) => ({
                              value: t.id,
                              label: t.name,
                            })
                          ) || []
                        }
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
                    </div>

                    <div className="pt-8" />

                    <div className="flex flex-col">
                      <p className="text-[14px] text-white leading-[22px] font-bold mb-2">
                        City
                      </p>
                      <ReactSelect
                        value={selectedCity}
                        onChange={(selectedOption) => {
                          setSelectedCity(selectedOption);
                        }}
                        placeholder="Select City"
                        classNamePrefix="custom-select"
                        options={
                          citiesList?.map(
                            (t: { id: string; name: string }) => ({
                              value: t.id,
                              label: t.name,
                            })
                          ) || []
                        }
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
                    </div>
                  </div>

                  <div className="w-full">
                    <h2 className="text-[20px] font-bold leading-[26px]">
                      Your Social Media
                    </h2>

                    <div className="pt-8" />

                    <div className="flex flex-col">
                      <p className="text-[14px] leading-[22px] font-bold">
                        Facebook
                      </p>
                      <Input
                        onChange={(e) => setFacebookLink(e.target.value)}
                        className="h-[40px] text-[14px] text-white mt-2"
                        placeholder="Facebook username"
                        value={facebookLink}
                        type="text"
                      />
                    </div>

                    <div className="pt-16" />

                    <div className="flex flex-col items-start">
                      <Link
                        to="#"
                        className="sc-button style-2 fl-button pri-3 social-icon rounded-[10px] h-[40px] w-[219px]"
                      >
                        <SvgFacebookIcon />
                        <span className="ml-3">Connect to Facebook</span>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="pt-16" />

                <div className="flex flex-col items-center gap-6 w-full sm:w-auto sm:gap-0 sm:flex-row">
                  <button
                    onClick={updateUsersDetails}
                    disabled={updatingUserDetails}
                    className="w-full sm:w-auto submit rounded-[10px] social-login-submit h-[48px] text-[14px] leading-[10px] hover:text-white focus:text-white"
                  >
                    Update Profile
                  </button>

                  <button
                    onClick={handleUndoChanges}
                    className="w-full sm:w-auto sm:ml-4 style-2 fl-button pri-3 social-icon rounded-[10px] px-16 h-[48px] text-[14px] leading-[10px]"
                  >
                    <span>Undo Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
