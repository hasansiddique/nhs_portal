import { toast } from 'sonner';
import ReactSelect from 'react-select';
import { useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';

import { SvgCloseIcon } from '@your-props/client/icons';
import { request } from '@your-props/client/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Spinner,
} from '@your-props/client/ui';

import { DashboardLayout } from '../Dashboard';
import { reactSelectStyles } from '../../props/partials/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const bulkUploadSchema = z.object({
  file: z.any(),
});

export type bulkUpload = z.infer<typeof bulkUploadSchema>;

export const BulkUpload = () => {
  useEffect(() => {
    getPropDataSet();
  }, []);

  const navigate = useNavigate();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('');

  const [listingType, setListingType] = useState('showcase_only');
  const [fetchingDataSet, setFetchingDataSet] = useState(true);
  const [propDataSet, setPropDataSet] = useState({
    movies: [],
    categories: [],
    productTypes: [],
    productSaleType: [],
  });

  const form = useForm<bulkUpload>({
    resolver: zodResolver(bulkUploadSchema),
    defaultValues: {
      file: [],
    },
    mode: 'onChange',
  });

  const { reset } = form;
  const { errors } = form.formState;

  const getPropDataSet = useCallback(async () => {
    setFetchingDataSet(true);
    try {
      const { data } = await request.get('/create-props-dataset');
      setPropDataSet(data);
    } catch (err: any) {
      Object.values(err.response.data.messages).map((message) =>
        toast.error(message as string)
      );
    } finally {
      setFetchingDataSet(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const allowedFormats = ['text/csv'];
      const maxFileSize = 200 * 1024 * 1024;
      const selectedFiles = Array.from(e.target.files || []);

      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      selectedFiles.forEach((file) => {
        if (!allowedFormats.includes(file.type)) {
          invalidFiles.push(`${file.name} has an unsupported format.`);
        } else if (file.size > maxFileSize) {
          invalidFiles.push(`${file.name} exceeds the size limit of 200MB.`);
        } else {
          validFiles.push(file);
        }
      });

      if (invalidFiles.length) {
        toast.error(`File upload error:\n${invalidFiles.join('\n')}`);
      }

      if (validFiles.length) {
        setUploadedFiles((prevFiles) => [...prevFiles, ...validFiles]);
      }
    }
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
  };

  const handleSubmit = async (formData: bulkUpload) => {
    if (uploadedFiles.length > 0) {
      try {
        await request.post('/bulk-upload-props', {
          product_csv: uploadedFiles[0],
        });
        toast.success('File uploaded successfully!');
        navigate('/dashboard/props');
      } catch (err: any) {
        const message =
          err.response?.data?.message || 'Upload failed. Please try again.';
        toast.error(String(message));
      }
    } else {
      toast.error('Please specify a valid file upload');
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
    {
      label: 'Bulk Upload',
      isActive: true,
    },
  ];

  const handleCancel = () => {
    reset();
    setListingType('');
    setUploadedFiles([]);
    setSelectedMovie('');
    setSelectedCategory('');
    setSelectedProductCategory('');
  };

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        {fetchingDataSet ? (
          <div className="flex justify-center items-center my-60 w-full">
            <Spinner
              loadingText="Loading..."
              className="text-primary text-[32px]"
            />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="row p-0">
                <div className="col-md-7 col-xl-8  lg:pr-[15px] lg:pl-0">
                  <div className="bg-[#3939394D] rounded-[8px] p-[20px] sm:p-[26px]">
                    <div className="mb-[25px]">
                      <h4 className="title-create-item">Listing Type </h4>
                      <div className="flex gap-6 flex-wrap">
                        {propDataSet?.productSaleType?.map(
                          (item: { filterFlag: string; name: string }) => (
                            <div
                              key={item.filterFlag}
                              onClick={() => setListingType(item.filterFlag)}
                              className="text-[16px] leading-[24px] font-[700]"
                            >
                              <div
                                className={`hover:bg-[#EF6A3B] ${
                                  listingType === item.filterFlag
                                    ? 'bg-[#EF6A3B]'
                                    : 'bg-[#393939]'
                                } px-[14px] py-[8px] hover:cursor-pointer hover:text-white rounded-2xl active:bg-[#EF6A3B]`}
                              >
                                {item.name}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      {listingType && (
                        <p className="text-left mt-10">
                          <span className="font-bold mr-1">Listing Type:</span>
                          {listingType}
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="title-create-item">Upload Excel</h4>

                      <div>
                        {uploadedFiles.length > 0 && (
                          <ul className="my-10">
                            {uploadedFiles.map((file, index) => (
                              <li key={index} className="text-[16px]">
                                <span
                                  className="cursor-pointer flex flex-row mr-2 items-center"
                                  onClick={() => handleRemoveFile(index)}
                                >
                                  <p>
                                    {file.name} ({(file.size / 1024).toFixed(2)}{' '}
                                    KB)
                                  </p>
                                  <SvgCloseIcon fill="#676767" />
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

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
                                  accept=".csv"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <span className="filename h-[85px]">
                          Only Excel files (.csv). Max 200MB.
                        </span>
                      </label>
                      <FormMessage>
                        {(form.formState.errors.file?.message as string) || ''}
                      </FormMessage>
                    </div>

                    <div className="flex flex-row mt-[2rem]">
                      <button
                        type="submit"
                        className={`w-full md:w-[130px] px-[24px] py-2 h-[48px] rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:text-white hover:opacity-90 disabled:opacity-70 disabled:border-none`}
                      >
                        Add Props
                      </button>

                      <button
                        type="button"
                        onClick={handleCancel}
                        className={`w-full md:w-[130px] ml-6 px-[24px] py-2 h-[48px] rounded-[10px] bg-[#676767] border-[#676767] focus:text-white hover:text-white hover:opacity-90 disabled:opacity-70 disabled:border-none`}
                      >
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-md-5 col-xl-4 md:pl-0 lg:p-0 mt-10 md:mt-0">
                  <div className="bg-[#3939394D] rounded-[8px] p-[20px] sm:p-[26px]">
                    <div>
                      <h4 className="title-create-item">Help Documents</h4>
                      <p className="text-[20px] leading-[26px] mt-[12px]">
                        You can use these documents to generate your CSV file.
                      </p>

                      <div className="flex flex-col justify-center items-center mt-[40px]">
                        <button
                          type="button"
                          className={`mt-[12px] w-full px-[24px] py-2 h-[48px] rounded-[10px] bg-transparent border-white focus:text-[#EF6A3B] hover:text-[#EF6A3B] hover:opacity-90 disabled:opacity-70 disabled:border-none`}
                        >
                          Download CSV Template
                        </button>

                        <button
                          type="button"
                          className={`mt-[12px] w-full px-[24px] py-2 h-[48px] rounded-[10px] bg-transparent border-white focus:text-[#EF6A3B] hover:text-[#EF6A3B] hover:opacity-90 disabled:opacity-70 disabled:border-none`}
                        >
                          Download CSV Example
                        </button>

                        <button
                          type="button"
                          className={`mt-[12px] w-full px-[24px] py-2 h-[48px] rounded-[10px] bg-transparent border-white focus:text-[#EF6A3B] hover:text-[#EF6A3B] hover:opacity-90 disabled:opacity-70 disabled:border-none`}
                        >
                          Documentation
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#3939394D] rounded-[8px] p-[20px] sm:p-[26px] mt-10">
                    <div>
                      <h4 className="title-create-item">Category ID Finder</h4>
                      <p className="text-[20px] leading-[26px] mt-[12px]">
                        You can use this section to find out the id of a
                        category.
                      </p>

                      <div className="flex flex-col mt-[40px]">
                        <ReactSelect
                          value={
                            selectedCategory
                              ? propDataSet?.categories
                                  ?.map((t: { id: string; name: string }) => ({
                                    value: t.id,
                                    label: t.name,
                                  }))
                                  .find(
                                    (option) =>
                                      option.value === selectedCategory
                                  ) || null
                              : null
                          }
                          onChange={(selectedOption: any) => {
                            setSelectedCategory(selectedOption?.value);
                          }}
                          isSearchable={true}
                          className="w-full"
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

                        {selectedCategory && (
                          <p className="text-left mt-10">
                            <span className="font-bold mr-1">Category Id:</span>
                            {selectedCategory}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#3939394D] rounded-[8px] p-[20px] sm:p-[26px] mt-10">
                    <div>
                      <h4 className="title-create-item">Movie ID Finder</h4>
                      <p className="text-[20px] leading-[26px] mt-[12px]">
                        You can use this section to find out the id of a movie.
                      </p>

                      <div className="flex flex-col mt-[40px]">
                        <ReactSelect
                          value={
                            selectedMovie
                              ? propDataSet?.movies
                                  ?.map((t: { id: string; title: string }) => ({
                                    value: t.id,
                                    label: t.title,
                                  }))
                                  .find(
                                    (option) => option.value === selectedMovie
                                  ) || null
                              : null
                          }
                          onChange={(selectedOption: any) => {
                            setSelectedMovie(selectedOption?.value);
                          }}
                          isSearchable={true}
                          className="w-full"
                          classNamePrefix={'custom-select'}
                          options={
                            propDataSet?.movies?.map(
                              (t: { id: string; title: string }) => ({
                                value: t.id,
                                label: t.title,
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
                          placeholder={'Select a movie'}
                        />

                        {selectedMovie && (
                          <p className="text-left mt-10">
                            <span className="font-bold mr-1">Movie Id:</span>
                            {selectedMovie}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#3939394D] rounded-[8px] p-[20px] sm:p-[26px] mt-10">
                    <div>
                      <h4 className="title-create-item">
                        Product Category ID Finder
                      </h4>
                      <p className="text-[20px] leading-[26px] mt-[12px]">
                        You can use this section to find out the id of a product
                        category.
                      </p>

                      <div className="flex flex-col mt-[40px]">
                        <ReactSelect
                          value={
                            selectedProductCategory
                              ? propDataSet?.productTypes
                                  ?.map((t: { id: string; name: string }) => ({
                                    value: t.id,
                                    label: t.name,
                                  }))
                                  .find(
                                    (option) =>
                                      option.value === selectedProductCategory
                                  ) || null
                              : null
                          }
                          onChange={(selectedOption: any) => {
                            setSelectedProductCategory(selectedOption?.value);
                          }}
                          isSearchable={true}
                          className="w-full"
                          classNamePrefix={'custom-select'}
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
                          placeholder={'Select a product category'}
                        />

                        {selectedProductCategory && (
                          <p className="text-left mt-10">
                            <span className="font-bold mr-1">
                              Product Category Id:
                            </span>
                            {selectedProductCategory}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        )}
      </div>
    </DashboardLayout>
  );
};
