import React, { useCallback, useEffect, useId, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import { toast } from 'sonner';

import {
  PaymentCheckPopup,
  request,
  useAuthDialogStore,
} from '@your-props/client/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  PropCard,
  Textarea,
  Breadcrumbs,
  Spinner,
  Tooltip,
  FullPageSpinner,
} from '@your-props/client/ui';
import {
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import {
  CalendarIcon,
  SvgCloseIcon,
  SvgExclamationIcon,
  SvgInfoIcon,
} from '@your-props/client/icons';

import { ScreenMatchPop } from '../partials/ScreenMatchPopup';
import img1 from '../../theme/assets/images/avatar/avt-3.jpg';
import { ActorTagInput } from '../partials/ActorTags';
import { reactSelectStyles } from '../partials/utils';
import DateTimePicker from 'react-datetime-picker';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { propSchema, PropSchema } from './PropSchema';
import { COATagInput } from '../partials/COATags';
import { toZonedTime } from 'date-fns-tz';
import { MovieTagInput } from '../partials/MovieTags';

export const PropForm = () => {
  const formId = useId();
  const navigate = useNavigate();
  const params = useParams();

  const { toggleDialogVisibility } = useAuthDialogStore();
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const shippingOptions = [
    { id: 'self_collect', label: 'Local Pickup' },
    { id: 'domestic', label: 'Domestic Shipping' },
    { id: 'international', label: 'International Delivery' },
  ];

  const [propDataSet, setPropDataSet] = useState({
    movies: [],
    categories: [],
    productTypes: [],
    productSaleType: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [creatingProp, setCreatingProp] = useState(false);
  const [isAcceptingOffers, setAcceptingOffers] = useState(true);

  const [listingType, setListingType] = useState('showcase_only');
  const [selectedMovieOption, setSelectedMovieOption] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [auctionStarted, setAuctionStarted] = useState(false);
  const [startAuctionImmediately, setStartAuctionImmediately] = useState(true);

  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [actorTags, setActorTags] = useState<string[]>([]);
  const [movieTags, setMovieTags] = useState<string[]>([]);
  const [coaTags, setCOATags] = useState<string[]>([]);
  const [shippingMethod, setShippingMethod] = useState<string[]>([]);
  const [isOriginal, setIsOriginal] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') as string);

  const [itemDetails, setItemDetails] = useState({
    images: [{ imageDefault: '', storage: '', id: '' }],
    details: { title: '', shortDescription: '', description: '' },
    product: {
      productTypeId: '',
      categoryName: '',
      productType: '',
      listingType: '',
      categoryId: '',
      actorName: '',
      movieName: '',
      movieId: '',
      price: '',
      stock: '',
      id: '',
    },
    auctionDetails: {},
    shippingDetails: {},
    vendorProducts: [],
    vendorDetails: {},
  });

  const [loadingPropDetails, setLoadingPropDetails] = useState(false);
  const duration = [3, 5, 7, 10, 14, 30];
  const propId = params.id || '';

  useEffect(() => {
    if (propId) {
      getPropsDetails(propId);
    }
  }, [params.id]);

  useEffect(() => {
    getPropDataSet();
  }, []);

  const form = useForm<PropSchema>({
    resolver: zodResolver(propSchema),
    defaultValues: {
      listing_type: 'showcase_only',
      file: [],
      title: '',
      product_category: '',
      product_type: '',
      description: '',
      price: '',
      minimum_offer: '',
      character_name: '',
      starting_bid: '',
      reserve_price: '',
      stock: '1',
      movie_id: '',
      start_date: new Date().toLocaleString('en-US', { hour12: false }),
      duration: undefined,
      scheduled_start: false,
      shipping_self_collect: false,

      ...shippingOptions.reduce((acc, method) => {
        acc[`shipping_${method.id}`] = false;
        acc[`shipping_${method.id}_days`] = undefined;
        acc[`shipping_${method.id}_fee`] = '';
        return acc;
      }, {} as Partial<PropSchema>),
    },
    mode: 'onChange',
  });

  const { reset } = form;
  const { errors } = form.formState;

  const getPropDataSet = useCallback(async () => {
    try {
      const { data } = await request.get('/create-props-dataset');
      setPropDataSet(data);
    } catch (err: any) {
      Object.values(err.response.data.messages).map((message) =>
        toast.error(String(message))
      );
    }
  }, []);

  const handleSubmit = async (formData: PropSchema) => {
    setCreatingProp(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('is_original', isOriginal ? '1' : '0');
      formDataToSend.set('accepting_offer', isAcceptingOffers ? '1' : '0');

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'start_date' && value) {
          const startTimeUTC = new Date(value).toISOString();
          formDataToSend.append(key, String(startTimeUTC));
        } else if (key !== 'file') {
          formDataToSend.append(key, String(value));
        }
      });

      files.forEach((file: string | Blob, index: number) => {
        formDataToSend.append(`file[${index}]`, file);
      });

      actorTags.forEach((tag: string, index: number) => {
        formDataToSend.append(`tags[${index}]`, tag);
      });

      coaTags.forEach((tag: string, index: number) => {
        formDataToSend.append(`coa[${index}]`, tag);
      });

      const { data } = await request.post(
        propId ? `/update-prop/${propId}` : '/create-prop',
        formDataToSend,
        {},
        true,
        false
      );

      toast.success(
        data.message ||
          `Product ${propId ? 'updated' : 'created'} successfully!`
      );

      navigate('/dashboard/props');
    } catch (err: any) {
      Object.values(err.response.data.messages).map((message) =>
        toast.error(String(message))
      );
    } finally {
      setCreatingProp(false);
    }
  };

  const handleScreenMatchCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setShowModal(true); // Show the modal when checkbox is checked
    } else {
      setIsOriginal(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const allowedFormats = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
      ];
      const maxFileSize = 200 * 1024 * 1024;
      const selectedFiles = Array.from(e.target.files || []);

      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      selectedFiles.forEach((file) => {
        if (!allowedFormats.includes(file.type)) {
          invalidFiles.push(`${file.name} has an unsupported format.`);
        } else if (file.size > maxFileSize) {
          invalidFiles.push(`${file.name} exceeds the size limit of 100MB.`);
        } else {
          validFiles.push(file);
        }
      });

      if (invalidFiles.length) {
        toast.error(`File upload error:\n${invalidFiles.join('\n')}`);
      }

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));

      if (validFiles.length) {
        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
        setFilePreviews((prevPreviews) => [
          ...prevPreviews,
          ...validFiles.map((file) => URL.createObjectURL(file)),
        ]);
      }
      form.setValue('file', selectedFiles);
      form.trigger('file'); // Validate the file field
    }
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = filePreviews.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setFilePreviews(updatedPreviews);

    form.setValue('file', updatedFiles);
  };

  const handleShippingMethodChange = (method: string, checked: boolean) => {
    const updatedList = [...shippingMethod];

    if (!checked) {
      const index = updatedList.indexOf(method);

      if (index !== -1) {
        updatedList.splice(index, 1);
      }

      form.setValue(`shipping_${method}`, false);
    } else {
      updatedList.push(method);

      form.setValue(`shipping_${method}`, true);
    }

    setShippingMethod(updatedList);
  };

  const handleScheduledAuction = (checked: boolean) => {
    form.setValue('scheduled_start', checked);
    setStartAuctionImmediately(!checked);
  };

  const getPropsDetails = async (propId: string) => {
    setLoadingPropDetails(true);

    try {
      const { data } = await request.get(`/edit-prop-details/${propId}`);
      const apiData = data?.data;

      setItemDetails(apiData);
      setIsOriginal(apiData?.product?.isOriginal === '1');
      setAcceptingOffers(apiData?.product?.listingType === 'accepting_offer');
      setListingType(
        apiData?.product?.listingType === 'accepting_offer'
          ? 'showcase_only'
          : apiData?.product?.listingType
      );

      setSelectedMovieOption({
        value: apiData?.product?.movieId,
        label: apiData?.product?.movieName,
      });

      if (apiData?.product?.coa) {
        setCOATags(apiData?.product?.coa.split(','));
      }

      if (apiData?.product?.actorName) {
        setActorTags(apiData?.product?.actorName.split(','));
      }

      if (apiData?.product?.movieId) {
        setMovieTags(apiData?.product?.movieId.split(','));
      }

      const startTimeUTC = apiData?.auctionsDetails?.auction?.startTime
        ? new Date(apiData.auctionsDetails.auction.startTime + 'Z')
        : null;
      const startTimeLocal = startTimeUTC
        ? toZonedTime(startTimeUTC, localTimeZone)
        : null;

      const isScheduledStart =
        startTimeLocal &&
        startTimeLocal > toZonedTime(new Date(), localTimeZone);
      const isStarted =
        startTimeLocal &&
        startTimeLocal < toZonedTime(new Date(), localTimeZone);

      setStartAuctionImmediately(!isScheduledStart);
      setAuctionStarted(isStarted || false);

      reset({
        listing_type: apiData?.product?.listingType || '',
        file: apiData?.images || [],
        title: apiData?.details?.title || '',
        movie_id: apiData?.product?.movieId || undefined,
        product_category: apiData?.product?.categoryId || '',
        product_type: apiData?.product?.productTypeId || '',
        description: apiData?.details?.description || '',
        character_name: apiData?.product?.characterName || '',
        price: apiData?.product?.price ? String(apiData?.product?.price) : '',
        minimum_offer: apiData?.product?.minimumOffer
          ? String(apiData?.product?.minimumOffer)
          : '',
        starting_bid: apiData?.auctionsDetails?.auction?.startingPrice
          ? String(apiData?.auctionsDetails?.auction?.startingPrice)
          : '',
        reserve_price: apiData?.auctionsDetails?.reservePrice || '',
        stock: apiData?.product?.stock || '',
        duration:
          Number(apiData?.auctionsDetails?.auction?.duration) || undefined,
        start_date: startTimeLocal ? String(startTimeLocal) : '',
        end_date: apiData?.auctionsDetails?.auction?.endTime || '',
        scheduled_start: isScheduledStart || false,

        shipping_self_collect: apiData?.shippingDetails?.selfCollect == 1,

        ...Object.fromEntries(
          shippingOptions
            .filter((method) => method.id !== 'self_collect')
            .flatMap((method) => [
              [
                `shipping_${method.id}`,
                apiData?.shippingDetails?.[method.id] || false,
              ],
              [
                `shipping_${method.id}_days`,
                Number(apiData?.shippingDetails?.[method.id]?.days) ||
                  undefined,
              ],
              [
                `shipping_${method.id}_fee`,
                apiData?.shippingDetails?.[method.id]?.fee || '',
              ],
            ])
        ),
      });

      const shippingSelected: string[] = [];

      shippingOptions.forEach((method) => {
        if (method.id === 'self_collect') {
          if (apiData?.shippingDetails?.selfCollect === 1) {
            shippingSelected.push(method.id);
          }
        } else if (apiData?.shippingDetails?.[method.id] !== null) {
          const shippingDetails = apiData?.shippingDetails?.[method.id];

          form.setValue(`shipping_${method.id}`, true);
          form.setValue(
            `shipping_${method.id}_days`,
            Number(shippingDetails?.days)
          );
          form.setValue(`shipping_${method.id}_fee`, shippingDetails?.fee);

          shippingSelected.push(method.id);
        }
      });

      setShippingMethod(shippingSelected);
    } catch (err: any) {
      toast.error(
        err.response?.data.message || err.message || 'Something went wrong.'
      );

      if (err.status === 404 || err.status === 403) {
        navigate('/dashboard/props');
      }
    } finally {
      setLoadingPropDetails(false);
    }
  };

  const handleListingTypeChange = (type: string) => {
    if (currentUser?.paypalMerchantAccount) {
      form.setValue('listing_type', type);
      setListingType(type);
    } else {
      toggleDialogVisibility(true, <PaymentCheckPopup />);
    }
  };

  const breadCrumbs = [
    {
      label: 'All Items',
      isActive: false,
      redirectUrl: '/props?sorting=1',
    },
    {
      label: 'Your Props',
      isActive: false,
      redirectUrl: `/dashboard/props`,
    },
    {
      label: propId ? 'Update Item' : 'Add Item',
      isActive: true,
    },
  ];

  const propCardTitle = form.watch('title');
  const propMovieTitle = selectedMovieOption?.label || '';

  const getCategoriesWithReplicaTitle = () => {
    return (
      propDataSet?.categories
        ?.filter((category: { name: string }) =>
          category.name.toLowerCase().includes('replica'.toLowerCase())
        )
        .map((category: { id: string }) => category.id) || []
    );
  };

  const deleteImageFromApi = async (imageId: string) => {
    try {
      await request.delete(`/delete-prop-image/${imageId}`);
      getPropsDetails(propId);
      toggleDialogVisibility(false, null);
    } catch (err: any) {
      Object.values(err.response.data.messages).map((message) =>
        toast.error(String(message))
      );
    }
  };

  useEffect(() => {
    const productCategory = form.watch('product_category');
    const categoriesWithReplicas = getCategoriesWithReplicaTitle();
  }, [form.watch('product_category')]);

  const categories = propDataSet?.categories.map(
    (category: { id: string; name: string }) => ({
      value: category.id,
      label: category.name,
    })
  );

  const productCategory = form.watch('product_category');

  const productTypes = propDataSet?.productTypes.map(
    (productType: { id: string; name: string }) => ({
      value: productType.id,
      label: productType.name,
    })
  );

  const productType = form.watch('product_type');
  const startingBid = form.watch('starting_bid');
  const price = form.watch('price');

  const selectedProductTypeLabel =
    productTypes.find((type) => type.value === productType)?.label ||
    'Unknown Product Type';

  const isTypeReplica = selectedProductTypeLabel
    .toLowerCase()
    .includes('replica'.toLowerCase());

  const isTypeOriginal = selectedProductTypeLabel
    .toLowerCase()
    .includes('original'.toLowerCase());

  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Breadcrumbs breadCrumbs={breadCrumbs} />

      {showModal && (
        <ScreenMatchPop
          showModal={showModal}
          setShowModal={setShowModal}
          handleDelete={() => setIsOriginal(!isOriginal)}
        />
      )}

      {loadingPropDetails ? (
        <FullPageSpinner />
      ) : (
        <div className="create-item">
          <div className="tf-create-item tf-section featured-props-section pt-[20px] lg:pt-[30px]">
            <div className="themesflat-container">
              <div className="flex flex-col lg:flex-row items-start justify-center">
                <div className="w-full max-w-[340px] mb-20">
                  <h4 className="title-create-item mb-[20px]">Preview</h4>

                  <PropCard
                    item={{
                      movieName: propMovieTitle,
                      title: propCardTitle,
                      listingType:
                        listingType === 'showcase_only' && isAcceptingOffers
                          ? 'accepting_offer'
                          : listingType,
                      image:
                        itemDetails?.images[0]?.imageDefault ||
                        filePreviews[0] ||
                        img1,
                      price: listingType === 'bidding' ? startingBid : price,
                    }}
                  />
                </div>

                <div className="w-full flex-grow lg:w-auto lg:pl-[40px]">
                  <Form {...form}>
                    <form
                      className="flex gap-[3rem] w-full flex-col justify-between"
                      onSubmit={form.handleSubmit(handleSubmit)}
                      id={formId}
                    >
                      <div>
                        <h4 className="title-create-item">
                          Photo & Video Upload
                        </h4>

                        <div className="mb-[20px] flex flex-wrap gap-6">
                          {itemDetails?.images &&
                          itemDetails.images.some(
                            (image) =>
                              image.imageDefault !== '' ||
                              image.storage !== '' ||
                              image.id !== ''
                          )
                            ? itemDetails.images.map((f) => (
                                <div
                                  image-id={f.imageDefault}
                                  className="w-[140px] h-[140px] bg-[#393939]/90 p-[12px] rounded-[10px]"
                                  key={f.imageDefault}
                                >
                                  <div className="rounded-[10px] w-full h-full overflow-hidden relative">
                                    <img
                                      className=" rounded-[10px] object-cover h-full w-full aspect-[1/1]"
                                      src={f.imageDefault}
                                      alt="Product"
                                    />
                                    <div className="absolute top-1/2 left-1/2 rounded-full bg-white bg-opacity-20 p-2 -translate-x-1/2 -translate-y-1/2 hover:bg-opacity-40 transition">
                                      <p
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() =>
                                          toggleDialogVisibility(
                                            true,
                                            <div className="flex flex-col justify-center items-center">
                                              {itemDetails?.images?.length ===
                                                1 && files.length === 0 ? (
                                                <>
                                                  <div className="w-[55px] h-[55px] rounded-[80px] flex items-center justify-center bg-[red]/20">
                                                    <div className="w-[40px] h-[40px] rounded-[80px] flex items-center justify-center bg-red-700">
                                                      <SvgExclamationIcon />
                                                    </div>
                                                  </div>
                                                  <h1 className="text-[20px] mt-20">
                                                    You cannot delete this image
                                                  </h1>
                                                  <p className="text-[16px] text-center mt-20">
                                                    You should have at least one
                                                    image for the prop.
                                                  </p>
                                                </>
                                              ) : (
                                                <>
                                                  <h1 className="text-[20px]">
                                                    Are you sure?
                                                  </h1>
                                                  <p className="text-[16px] text-center mt-20">
                                                    Are you sure you want to
                                                    delete image?
                                                  </p>
                                                </>
                                              )}

                                              <div
                                                className={`"flex flex-row ${
                                                  itemDetails?.images?.length >
                                                  1
                                                    ? 'mt-[3rem]'
                                                    : 'mt-[3rem]'
                                                }`}
                                              >
                                                {(itemDetails?.images?.length >
                                                  1 ||
                                                  (itemDetails?.images
                                                    ?.length === 1 &&
                                                    files.length >= 1)) && (
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      deleteImageFromApi(f.id)
                                                    }
                                                    className={`px-[45px] py-[13px] rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:text-white hover:border-white disabled:opacity-70 disabled:border-none`}
                                                  >
                                                    <span>Delete</span>
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        }
                                      >
                                        <SvgCloseIcon fill="#ffffff" />
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            : null}

                          {files.length ? (
                            <>
                              {files.map((f, i) => (
                                <div
                                  className="w-[140px] h-[140px] bg-[#393939]/90 p-[12px] rounded-[10px]"
                                  key={f.name}
                                >
                                  <div className="rounded-[10px] w-full h-full overflow-hidden relative">
                                    <img
                                      className="rounded-[10px] object-cover h-full w-full"
                                      src={filePreviews[i]}
                                      alt="Product"
                                    />
                                    <div className="absolute top-1/2 left-1/2 rounded-full bg-white bg-opacity-20 p-2 -translate-x-1/2 -translate-y-1/2 hover:bg-opacity-40 transition">
                                      <div
                                        className="cursor-pointer"
                                        onClick={() => handleRemoveFile(i)}
                                      >
                                        <SvgCloseIcon fill="#676767" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : null}
                        </div>

                        {/* browse image section */}
                        <label className="uploadFile flex flex-col justify-center items-center">
                          <FormField
                            name="file"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    style={{
                                      position: 'relative',
                                      right: 0,
                                      left: 0,
                                      top: 45,
                                    }}
                                    className="inputfile form-control !top-[55px]"
                                    {...form.register('file', {
                                      onChange: (e) => {
                                        handleFileChange(e);
                                      },
                                    })}
                                    withError={!!errors.file}
                                    type="file"
                                    multiple
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <span className="filename h-[85px]">
                            PNG, JPG or WEBP. Max 200mb.
                          </span>
                        </label>
                        <FormMessage>
                          {(form.formState.errors.file?.message as string) ||
                            ''}
                        </FormMessage>
                      </div>

                      <div>
                        <h4 className="title-create-item">
                          Movie / TV Show Title{' '}
                        </h4>

                        <div className="no-button">
                          <FormField
                            name="movie_id"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <ReactSelect
                                  onChange={(selectedOption) => {
                                    if (selectedOption) {
                                      field.onChange(selectedOption.value);
                                      form.setValue(
                                        'movie_id',
                                        selectedOption.value
                                      );
                                      setSelectedMovieOption(selectedOption);
                                    } else {
                                      setSelectedMovieOption(null);
                                    }
                                  }}
                                  defaultValue={
                                    selectedMovieOption ??
                                    itemDetails?.product?.movieId
                                      ? {
                                          value: itemDetails?.product?.movieId,
                                          label:
                                            itemDetails?.product?.movieName,
                                        }
                                      : undefined
                                  }
                                  placeholder={'Select Movie'}
                                  classNamePrefix={'custom-select'}
                                  options={propDataSet?.movies.map(
                                    (t: { id: string; title: string }) => ({
                                      value: t.id,
                                      label: t.title,
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

                                {/*<MovieTagInput
                                  movieTags={movieTags}
                                  setMovieTags={setMovieTags}
                                />*/}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="title-create-item">Item Title</h4>

                        <FormField
                          name="title"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Enter Item Title"
                                  withError={!!errors.title}
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
                      <div className="flex gap-[3rem] md:flex-row flex-col">
                        <div className="w-full">
                          <h4 className="title-create-item">Category </h4>
                          <FormField
                            name="product_category"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <ReactSelect
                                  onChange={(selectedOption: any) => {
                                    const value = selectedOption?.value || '';
                                    field.onChange(value);
                                    form.setValue('product_category', value);
                                  }}
                                  defaultValue={
                                    itemDetails?.product?.categoryId
                                      ? {
                                          value:
                                            itemDetails?.product?.categoryId,
                                          label:
                                            itemDetails?.product?.categoryName,
                                        }
                                      : undefined
                                  }
                                  isSearchable={true}
                                  classNamePrefix={'custom-select'}
                                  options={
                                    propDataSet?.categories?.map(
                                      (t: { id: string; name: string }) => ({
                                        value: t.id,
                                        label: t.name,
                                      })
                                    ) || []
                                  }
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
                                  styles={reactSelectStyles}
                                  placeholder={'Select a category'}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="w-full">
                          <h4 className="title-create-item">Type</h4>
                          <FormField
                            name="product_type"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <ReactSelect
                                  defaultValue={
                                    itemDetails?.product?.productTypeId
                                      ? {
                                          value:
                                            itemDetails?.product?.productTypeId,
                                          label:
                                            itemDetails?.product?.productType,
                                        }
                                      : undefined
                                  }
                                  onChange={(selectedOption: any) => {
                                    const value = selectedOption?.value || '';
                                    field.onChange(value);
                                    form.setValue('product_type', value);
                                    setIsOriginal(false);
                                  }}
                                  isSearchable={false}
                                  classNamePrefix={'custom-select'}
                                  placeholder="Select a product type"
                                  options={
                                    propDataSet?.productTypes?.map(
                                      (t: { id: string; name: string }) => ({
                                        value: t.id,
                                        label: t.name,
                                      })
                                    ) || []
                                  }
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
                                  styles={reactSelectStyles}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* screen matched */}
                      {isTypeOriginal ? (
                        <div className="form-inner flex gap-4">
                          <label>
                            <input
                              type="checkbox"
                              checked={isOriginal}
                              onChange={handleScreenMatchCheckboxChange}
                            />
                            <span className="btn-checkbox"></span>
                            <span>Screen-matched</span>
                          </label>

                          <span className="cursor-pointer ml-2">
                            <TooltipProvider
                              delayDuration={isMobile ? 100 : 300}
                            >
                              <Tooltip open={isMobile ? open : undefined}>
                                <TooltipTrigger asChild>
                                  <span
                                    aria-label="Info"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (isMobile) setOpen((prev) => !prev);
                                    }}
                                  >
                                    <SvgInfoIcon />
                                  </span>
                                </TooltipTrigger>
                                {open || !isMobile ? (
                                  <TooltipContent
                                    side={!isMobile ? 'right' : 'top'}
                                    className={`border-[#C5B6B3] ${
                                      isMobile
                                        ? 'w-[300px] bg-[#393939]'
                                        : 'w-[500px] bg-[#393939]/90'
                                    } rounded-[4px] p-0`}
                                    align="center"
                                  >
                                    <div className="px-[16px] py-[15px]">
                                      <p
                                        className={`text-[14px] leading-[130%] ${
                                          isMobile ? 'w-auto' : 'w-[490px]'
                                        } `}
                                      >
                                        "screen-matched" means this EXACT item
                                        (and not an identical item) can be
                                        IDENTIFIED on screen due to scratches,
                                        marks, dents, flaws, etc.. If you do not
                                        state the identifiable marks in the
                                        description, we will REMOVE the
                                        screen-matched status!
                                      </p>
                                    </div>
                                    <TooltipArrow
                                      className="TooltipArrow"
                                      fill="#393939E5"
                                      width={20}
                                      height={12}
                                    />
                                  </TooltipContent>
                                ) : null}
                              </Tooltip>
                            </TooltipProvider>
                          </span>
                        </div>
                      ) : null}

                      <div className="flex gap-[3rem] md:flex-row flex-col">
                        <div className="w-full">
                          <h4 className="title-create-item">
                            Actor/Actress Name{' '}
                            <span className="text-[#8A8AA0] font-normal">
                              (Optional)
                            </span>
                          </h4>

                          <ActorTagInput
                            actorTags={actorTags}
                            setActorTags={setActorTags}
                          />
                        </div>
                        {/* implement the functionality*/}
                        <div className="w-full">
                          <h4 className="title-create-item">
                            Character Name{' '}
                            <span className="text-[#8A8AA0] font-normal">
                              (Optional)
                            </span>
                          </h4>

                          <FormField
                            name="character_name"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. Indiana Jones, Harry Potter etc."
                                    withError={!!errors.character_name}
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

                      <div className="flex gap-[3rem] md:flex-row flex-col">
                        <div className="md:w-[50%] md:pr-6">
                          <h4 className="title-create-item">
                            Certificate of Authenticity{' '}
                            <span className="text-[#8A8AA0] font-normal">
                              (Optional)
                            </span>
                          </h4>

                          <COATagInput
                            coaTags={coaTags}
                            setCOATags={setCOATags}
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="title-create-item">Description</h4>

                        <FormField
                          name="description"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  className="text-[14px] border-[#8a8aa04d]"
                                  placeholder="e.g. “This is very limited item”"
                                  {...field}
                                  withError={!!errors.description}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {isTypeReplica && (
                        <div className="flex gap-[3rem] md:flex-row flex-col">
                          <div className="w-full md:w-1/2">
                            <h4 className="title-create-item">
                              Quantity Available
                            </h4>
                            <FormField
                              name="stock"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      withError={!!errors.stock}
                                      placeholder="Quantity"
                                      className="h-[48px]"
                                      type="number"
                                      value={field.value}
                                      min={1}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      <div className="">
                        <h4 className="title-create-item font-weight-normal text-[18px]">
                          Listing Type:
                        </h4>

                        <div className="">
                          {propDataSet?.productSaleType?.map(
                            (
                              item: { filterFlag: string; name: string },
                              index
                            ) => {
                              if (item.filterFlag === 'accepting_offer') {
                                return null;
                              }

                              return (
                                <div className="mb-[30px]" key={index}>
                                  <div className="flex items-start gap-10">
                                    <label className="flex-shrink-0 cursor-pointer">
                                      <input
                                        disabled={
                                          item.name === 'Showcase Only' &&
                                          !currentUser?.paypalMerchantAccount
                                        }
                                        type="checkbox"
                                        checked={
                                          listingType === item.filterFlag
                                        }
                                        onChange={() =>
                                          handleListingTypeChange(
                                            item.filterFlag
                                          )
                                        }
                                        className="!hidden"
                                      />
                                      <div
                                        className={`w-[40px] h-[20px] rounded-full p-[2px] transition select-none ${
                                          listingType === item.filterFlag
                                            ? 'bg-[#EF6A3B]'
                                            : 'bg-[#4b5563]'
                                        }`}
                                      >
                                        <div
                                          className={`w-[16px] h-[16px] bg-white rounded-full shadow-md transform transition select-none ${
                                            listingType === item.filterFlag
                                              ? 'translate-x-[20px]'
                                              : ''
                                          }`}
                                        ></div>
                                      </div>
                                    </label>

                                    <div className="text-[20px] flex flex-col">
                                      <span className="font-[700]">
                                        {item.name === 'Auctions'
                                          ? 'Auction'
                                          : item.name}
                                      </span>
                                      <span className="text-[16px] text-[#8A8AA0] mt-[10px]">
                                        {item.name === 'Auctions'
                                          ? 'Set a starting bid and allow buyers to bid against each other for your item.'
                                          : item.name === 'Buy it Now'
                                          ? 'Buyers can buy instantly at this price.'
                                          : item.name === 'Showcase Only'
                                          ? 'Not looking to sell but want to share your collection. You can allow people to send you offers.'
                                          : ''}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="">
                                    {((item.filterFlag === 'showcase_only' &&
                                      listingType === 'showcase_only') ||
                                      (isAcceptingOffers &&
                                        listingType === 'accepting_offer')) && (
                                      <div className="bg-[#393939] p-[20px] md:py-[40px] md:px-[66px] mt-[20px] rounded-xl">
                                        <div className="md:flex items-start gap-10">
                                          <label className="flex-shrink-0 cursor-pointer mb-[10px] md:mb-0">
                                            <input
                                              type="checkbox"
                                              checked={isAcceptingOffers}
                                              onChange={(e) =>
                                                setAcceptingOffers(
                                                  e.target.checked
                                                )
                                              }
                                              className="!hidden"
                                            />
                                            <div
                                              className={`w-[40px] h-[20px] rounded-full p-[2px] transition select-none ${
                                                isAcceptingOffers
                                                  ? 'bg-[#EF6A3B]'
                                                  : 'bg-[#4b5563]'
                                              }`}
                                            >
                                              <div
                                                className={`w-[16px] h-[16px] bg-white rounded-full shadow-md transform transition select-none ${
                                                  isAcceptingOffers
                                                    ? 'translate-x-[20px]'
                                                    : ''
                                                }`}
                                              ></div>
                                            </div>
                                          </label>

                                          <div className="flex-grow">
                                            <div className="flex flex-col text-[20px]">
                                              <span className="font-[700]">
                                                Allow Offers
                                              </span>
                                              <span className="text-[16px] text-[#8A8AA0] mt-[10px]">
                                                Buyers interested in your item
                                                can make you offers - you can
                                                always accept or decline.
                                              </span>
                                            </div>

                                            {isAcceptingOffers && (
                                              <div className="w-full mt-[30px]">
                                                <h4 className="title-create-item">
                                                  Minimum Acceptable Offer
                                                </h4>
                                                <FormField
                                                  name="minimum_offer"
                                                  control={form.control}
                                                  render={({ field }) => (
                                                    <FormItem>
                                                      <FormControl>
                                                        <Input
                                                          {...field}
                                                          placeholder={
                                                            'Minimum offer'
                                                          }
                                                          onKeyDown={(e) => {
                                                            if (
                                                              e.key === '-' ||
                                                              e.key === 'e' ||
                                                              e.key === '.'
                                                            ) {
                                                              e.preventDefault();
                                                            }
                                                          }}
                                                          withError={
                                                            !!errors.minimum_offer
                                                          }
                                                          className="h-[48px] !bg-[#222222]"
                                                          value={field.value}
                                                          type="number"
                                                          min={1}
                                                          prefix={'$'}
                                                          onChange={(e) => {
                                                            const value =
                                                              e.target.value;
                                                            const intValue =
                                                              Math.floor(
                                                                Number(value)
                                                              );
                                                            field.onChange(
                                                              intValue.toString()
                                                            );
                                                          }}
                                                        />
                                                      </FormControl>
                                                      <FormMessage />
                                                    </FormItem>
                                                  )}
                                                />
                                                <p className="text-[16px] leading-[16px] text-[#8A8AA0] mt-[10px] ml-[4px]">
                                                  Enter minimum price you would
                                                  consider
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {item.filterFlag === 'sell_on_site' &&
                                      listingType === 'sell_on_site' && (
                                        <div className="bg-[#393939] p-[20px] md:py-[40px] md:px-[66px] mt-[20px] rounded-xl">
                                          <div className="w-full">
                                            <h4 className="title-create-item">
                                              Buy Now Price
                                            </h4>
                                            <FormField
                                              name="price"
                                              control={form.control}
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormControl>
                                                    <Input
                                                      placeholder="Price"
                                                      onKeyDown={(e) => {
                                                        if (
                                                          e.key === '-' ||
                                                          e.key === 'e' ||
                                                          e.key === '.'
                                                        ) {
                                                          e.preventDefault();
                                                        }
                                                      }}
                                                      withError={!!errors.price}
                                                      className="h-[48px] !bg-[#222222]"
                                                      type="number"
                                                      {...field}
                                                      onChange={(e) => {
                                                        const value =
                                                          e.target.value;
                                                        const intValue =
                                                          Math.floor(
                                                            Number(value)
                                                          );
                                                        field.onChange(
                                                          intValue.toString()
                                                        );
                                                      }}
                                                      min={1}
                                                      prefix={'$'}
                                                    />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                        </div>
                                      )}

                                    {item.filterFlag === 'bidding' &&
                                      listingType === 'bidding' && (
                                        <div className="bg-[#393939] p-[20px] md:py-[40px] md:px-[66px] mt-[20px] rounded-xl">
                                          <div className="w-full ">
                                            <h4 className="title-create-item">
                                              Starting Bid
                                            </h4>
                                            <FormField
                                              name="starting_bid"
                                              control={form.control}
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormControl>
                                                    <Input
                                                      placeholder="Starting Bid"
                                                      withError={
                                                        !!errors.starting_bid
                                                      }
                                                      onKeyDown={(e) => {
                                                        if (
                                                          e.key === '-' ||
                                                          e.key === 'e' ||
                                                          e.key === '.'
                                                        ) {
                                                          e.preventDefault();
                                                        }
                                                      }}
                                                      className="h-[48px] !bg-[#222222]"
                                                      type="number"
                                                      {...field}
                                                      onChange={(e) => {
                                                        const value =
                                                          e.target.value;
                                                        const intValue =
                                                          Math.floor(
                                                            Number(value)
                                                          );
                                                        field.onChange(
                                                          intValue.toString()
                                                        );
                                                      }}
                                                      min={1}
                                                      prefix={'$'}
                                                    />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                          </div>

                                          <div className="w-full mt-[30px]">
                                            {propId && auctionStarted ? (
                                              <div className="w-full ">
                                                <h4 className="title-create-item">
                                                  Auction Started on
                                                </h4>
                                                <FormField
                                                  name="start_date"
                                                  control={form.control}
                                                  render={({ field }) => (
                                                    <FormItem>
                                                      <FormControl>
                                                        <Input
                                                          {...field}
                                                          type="text"
                                                          disabled={true}
                                                          className="h-[48px] !bg-[#222222]"
                                                          aria-label="Date and time"
                                                          value={field.value}
                                                        />
                                                      </FormControl>
                                                      <FormMessage />
                                                    </FormItem>
                                                  )}
                                                />
                                              </div>
                                            ) : (
                                              <div className="md:flex items-start gap-10">
                                                <label className="flex-shrink-0 cursor-pointer">
                                                  <input
                                                    name="scheduled_start"
                                                    type="checkbox"
                                                    checked={
                                                      !startAuctionImmediately
                                                    }
                                                    onChange={(e) =>
                                                      handleScheduledAuction(
                                                        e.target.checked
                                                      )
                                                    }
                                                    className="!hidden"
                                                  />
                                                  <div
                                                    className={`w-[40px] h-[20px] rounded-full p-[2px] transition select-none flex-shrink-0 ${
                                                      !startAuctionImmediately
                                                        ? 'bg-[#EF6A3B]'
                                                        : 'bg-[#4b5563]'
                                                    }`}
                                                  >
                                                    <div
                                                      className={`w-[16px] h-[16px] bg-white rounded-full shadow-md transform transition select-none ${
                                                        !startAuctionImmediately
                                                          ? 'translate-x-[20px]'
                                                          : ''
                                                      }`}
                                                    ></div>
                                                  </div>
                                                </label>

                                                <div className="flex-grow mt-[10px] md:mt-0">
                                                  <div className="text-[20px] flex flex-col">
                                                    <span className="font-[700]">
                                                      Schedule starting time
                                                    </span>
                                                    <span className="text-[16px] text-[#8A8AA0] mt-[10px]">
                                                      Select when your listing
                                                      goes live or it will go
                                                      live immediately.
                                                    </span>
                                                  </div>

                                                  {!startAuctionImmediately && (
                                                    <div className="w-full mt-[20px]">
                                                      <FormField
                                                        name="start_date"
                                                        control={form.control}
                                                        render={({ field }) => (
                                                          <FormItem>
                                                            <FormControl>
                                                              <DateTimePicker
                                                                {...field}
                                                                disableClock={
                                                                  true
                                                                }
                                                                className={`block h-[48px] rounded-[10px] !bg-[#222222]`}
                                                                aria-label="Date and time"
                                                                onChange={(
                                                                  date
                                                                ) => {
                                                                  if (date) {
                                                                    const utcDate =
                                                                      new Date(
                                                                        date
                                                                      ).toISOString();
                                                                    form.setValue(
                                                                      'start_date',
                                                                      utcDate
                                                                    );
                                                                    field.onChange(
                                                                      utcDate
                                                                    );
                                                                  } else {
                                                                    field.onChange(
                                                                      null
                                                                    );
                                                                  }
                                                                }}
                                                                value={
                                                                  field.value ||
                                                                  new Date()
                                                                }
                                                                minDate={
                                                                  !field.value
                                                                    ? new Date()
                                                                    : undefined
                                                                }
                                                                calendarIcon={
                                                                  <CalendarIcon />
                                                                }
                                                                clearIcon={null}
                                                                format="dd:M:y h:mm a"
                                                                // withError={!!errors.start_date}
                                                                // dayPlaceholder="dd"
                                                                // monthPlaceholder="mm"
                                                                // yearPlaceholder="yyyy"
                                                                // hourPlaceholder="hh"
                                                                // minutePlaceholder="mm"
                                                              />
                                                            </FormControl>
                                                            <FormMessage />
                                                          </FormItem>
                                                        )}
                                                      />
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </div>

                                          <div className="w-full mt-[30px]">
                                            <h4 className="title-create-item">
                                              Auction duration
                                            </h4>

                                            <FormField
                                              name="duration"
                                              control={form.control}
                                              render={({ field }) => (
                                                <FormItem>
                                                  <ReactSelect
                                                    placeholder="Select an auction duration"
                                                    isSearchable={false}
                                                    classNamePrefix={
                                                      'custom-select'
                                                    }
                                                    className="rounded-[10px] !bg-[#222222]"
                                                    onChange={(
                                                      selectedOption
                                                    ) => {
                                                      field.onChange(
                                                        selectedOption?.value ||
                                                          null
                                                      );
                                                    }}
                                                    defaultValue={
                                                      duration
                                                        .map((t) => ({
                                                          value: t,
                                                          label: t + ' Days',
                                                        }))
                                                        .find(
                                                          (option) =>
                                                            option.value ===
                                                            +(field.value ?? 0)
                                                        ) || null
                                                    }
                                                    options={
                                                      duration.map((t) => ({
                                                        value: t,
                                                        label: t + ' Days',
                                                      })) || []
                                                    }
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
                                                    styles={reactSelectStyles}
                                                  />
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>

                      {/* shipping */}
                      {(listingType !== 'showcase_only' ||
                        isAcceptingOffers) && (
                        <div>
                          <h4 className="title-create-item font-weight-normal text-[18px]">
                            Shipping:{' '}
                            <span className="text-[#8A8AA0] font-normal">
                              (Optional)
                            </span>
                          </h4>

                          <div>
                            {shippingOptions.map((method) => (
                              <div className="mb-[30px]" key={method.id}>
                                <div className="flex items-center gap-10">
                                  <label className="flex-shrink-0 cursor-pointer">
                                    <input
                                      name={`shipping_${method.id}`}
                                      type="checkbox"
                                      onChange={(e) =>
                                        handleShippingMethodChange(
                                          method.id,
                                          e.target.checked
                                        )
                                      }
                                      checked={shippingMethod.includes(
                                        method.id
                                      )}
                                      className="!hidden"
                                    />
                                    <div
                                      className={`w-[40px] h-[20px] rounded-full p-[2px] transition select-none ${
                                        shippingMethod.includes(method.id)
                                          ? 'bg-[#EF6A3B]'
                                          : 'bg-[#4b5563]'
                                      }`}
                                    >
                                      <div
                                        className={`w-[16px] h-[16px] bg-white rounded-full shadow-md transform transition select-none ${
                                          shippingMethod.includes(method.id)
                                            ? 'translate-x-[20px]'
                                            : ''
                                        }`}
                                      ></div>
                                    </div>
                                  </label>

                                  <div className="text-[20px] font-[700]">
                                    {method.label}
                                  </div>
                                </div>

                                {/* Render fields for 'domestic' and 'international' */}
                                {(method.id === 'domestic' ||
                                  method.id === 'international') &&
                                  shippingMethod.includes(method.id) && (
                                    <div className="bg-[#393939] p-[40px] mt-[20px] rounded-xl">
                                      <div className="w-full">
                                        <h4 className="title-create-item">
                                          Expected Delivery
                                        </h4>
                                        <FormField
                                          name={`shipping_${method.id}_days`}
                                          control={form.control}
                                          render={({ field }) => {
                                            const options = duration.map(
                                              (t) => ({
                                                value: t,
                                                label: `${t} Days`,
                                              })
                                            );

                                            const selectedOption =
                                              options.find(
                                                (option) =>
                                                  option.value ===
                                                  Number(field.value)
                                              ) || null;

                                            return (
                                              <FormItem>
                                                <FormControl>
                                                  <ReactSelect
                                                    isSearchable={false}
                                                    classNamePrefix="custom-select"
                                                    className="rounded-[10px] !bg-[#222222]"
                                                    defaultValue={
                                                      selectedOption
                                                    } // Use the selected option object
                                                    onChange={(
                                                      selectedOption
                                                    ) => {
                                                      field.onChange(
                                                        selectedOption?.value ||
                                                          null
                                                      );
                                                    }}
                                                    options={options} // Reuse the options array
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
                                                    styles={reactSelectStyles}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            );
                                          }}
                                        />
                                      </div>

                                      <div className="w-full mt-[30px]">
                                        <h4 className="title-create-item">
                                          Shipping Fee
                                        </h4>
                                        <FormField
                                          name={`shipping_${method.id}_fee`}
                                          control={form.control}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormControl>
                                                <Input
                                                  withError={
                                                    !!errors[
                                                      `${method.id}_shipping_fee`
                                                    ]
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.key === '-' ||
                                                      e.key === 'e' ||
                                                      e.key === '.'
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                  placeholder="Shipping Fee"
                                                  className="h-[48px] !bg-[#222222]"
                                                  type="number"
                                                  prefix={'$'}
                                                  min={0}
                                                  {...field}
                                                  value={field.value}
                                                  onChange={(e) => {
                                                    const value =
                                                      e.target.value;
                                                    const intValue = Math.floor(
                                                      Number(value)
                                                    );
                                                    field.onChange(
                                                      intValue.toString()
                                                    );
                                                  }}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* buttons */}
                      <div className="flex flex-row mt-[2rem]">
                        <button
                          type="submit"
                          disabled={creatingProp}
                          className={`w-full md:w-auto px-[24px] py-2 h-[48px] rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:text-white hover:opacity-90 disabled:opacity-70 disabled:border-none`}
                        >
                          {creatingProp ? (
                            <Spinner />
                          ) : (
                            <span>
                              {propId ? 'Update Item' : 'List Item Now'}
                            </span>
                          )}
                        </button>

                        {/* <button
                        type="button"
                        disabled={creatingProp}
                        onClick={() => navigate('/dashboard/props')}
                        className={`ml-6 px-[24px] py-2 h-[48px] rounded-[10px] bg-[#676767] border-[#676767] focus:text-white hover:text-white hover:opacity-90 disabled:opacity-70 disabled:border-none`}
                      >
                        <span>Cancel</span>
                      </button> */}
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
