import { z } from 'zod';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { request, useAuthDialogStore } from '@your-props/client/utils';
import {
  SvgCloseIcon,
  SvgStarIcon,
  SvgWhiteStarIcon,
} from '@your-props/client/icons';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Textarea,
} from '@your-props/client/ui';

import { FormLabel } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

const feedbackSchema = z.object({
  file: z.union([z.array(z.any()).optional(), z.object({}).optional()]),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(20, 'Message must be at least 20 characters.'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
});

type FeedbackSchema = z.infer<typeof feedbackSchema>;

interface FileWithId {
  file: File;
  fileId: string;
}

interface FilePreview {
  fileId: string;
  url: string;
}

export const FeedbackForm = ({
  orderId,
  sellerId,
  getOrderDetails,
}: {
  orderId: string,
  sellerId: string,
  getOrderDetails: () => void
}) => {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);

  const { toggleDialogVisibility } = useAuthDialogStore();

  const form = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      file: [],
      subject: '',
      rating: 1,
      message: '',
    },
    mode: 'onChange',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const allowedFormats = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
      ];
      const maxFileSize = 200 * 1024 * 1024;
      const selectedFiles = Array.from(e.target.files);

      const validFiles: { file: File; fileId: string }[] = [];
      const invalidFiles: string[] = [];

      selectedFiles.forEach((file) => {
        if (!allowedFormats.includes(file.type)) {
          invalidFiles.push(`${file.name} has an unsupported format.`);
        } else if (file.size > maxFileSize) {
          invalidFiles.push(`${file.name} exceeds the size limit of 200MB.`);
        } else {
          const fileId = uuidv4();
          validFiles.push({ file, fileId });
        }
      });

      if (invalidFiles.length) {
        toast.error(`File upload error:\n${invalidFiles.join('\n')}`);
      }

      if (validFiles.length) {
        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
        setFilePreviews((prevPreviews) => [
          ...prevPreviews,
          ...validFiles.map(({ file, fileId }) => ({
            fileId,
            url: URL.createObjectURL(file),
          })),
        ]);
      }
    }
    e.target.value = '';
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.fileId !== fileId));
    setFilePreviews((prevPreviews) =>
      prevPreviews.filter((preview) => preview.fileId !== fileId)
    );
  };

  const handleSubmit = async (formData: FeedbackSchema) => {
    console.log('form submitted', formData);
    const formDataToSend = new FormData();

    formDataToSend.append('order_id', String(orderId));
    formDataToSend.append('vendor_id', String(sellerId));
    formDataToSend.append('type', '2');

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'file') {
        formDataToSend.append(key, String(value));
      }
    });

    files.forEach(({ file }, index) => {
      formDataToSend.append(`file[${index}]`, file);
    });

    try {
      const { data } = await request.post(
        '/submit-review',
        formDataToSend,
        {},
        true,
        false
      );

      toast.success(data.message || 'Review submitted successfully!');

      getOrderDetails();

      toggleDialogVisibility(false, <span />);
    } catch (err: any) {
      if (err.response?.data?.messages) {
        Object.values(err.response.data.messages).forEach((message) =>
          toast.error(String(message))
        );
      } else {
        toast.error('An error occurred while submitting the review.');
      }
    }
  };

  return (
    <Form {...form}>
      <form
        className="md:max-w-[700px] m-auto"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <h2 className="font-bold text-[20px] mb-[20px] text-center">
          Post A Review
        </h2>

        <div className="flex gap-6 flex-col">
          <FormField
            name="subject"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-bold leading-[26px] text-white">
                  Subject
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-[40px] text-white text-[14px] mt-2"
                    placeholder="Subject"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="message"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-bold leading-[26px] text-white">
                  What You think about seller?
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    maxLength={225}
                    rows={5}
                    placeholder="Your message"
                    className="mt-2 border-[#8a8aa04d] text-white text-[14px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="rating"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-bold leading-[26px] text-white">
                  Rate Seller
                </FormLabel>
                <FormControl>
                  <div className="flex gap-[10px] mt-2 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className="cursor-pointer"
                        onClick={() => field.onChange(star)}
                      >
                        {field.value >= star ? (
                          <SvgStarIcon width={16} height={16} />
                        ) : (
                          <SvgWhiteStarIcon width={16} height={16} />
                        )}
                      </span>
                    ))}
                    <span className="ml-4 text-[14px] text-white">
                      {field.value === 1 && 'Poor'}
                      {field.value === 2 && 'Fair'}
                      {field.value === 3 && 'Good'}
                      {field.value === 4 && 'Very Good'}
                      {field.value === 5 && 'Excellent'}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <span className="text-[16px] font-bold leading-[26px] text-white">
            Attach Photos (Optional)
          </span>
          <label className="uploadFile bg-[#393939E5] !border-dashed flex flex-col justify-center items-center">
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
                      {...form.register('file', {
                        onChange: handleFileChange,
                      })}
                      className="inputfile form-control !top-[55px]"
                      type="file"
                      multiple
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <span className="filename h-[85px] text-center">
              PNG, JPG, GIF, WEBP or MP4. Max 200MB.
            </span>
          </label>
          <FormMessage>{form.formState.errors.file?.message}</FormMessage>

          <div className="flex flex-wrap gap-6">
            {files.map(({ file, fileId }) => {
              const preview = filePreviews.find(
                (p) => p.fileId === fileId
              )?.url;

              return (
                <div
                  className="w-[140px] h-[140px] bg-[#393939]/90 p-[12px] rounded-[10px]"
                  key={fileId}
                >
                  <div className="rounded-[10px] w-full h-full overflow-hidden relative">
                    {preview && (
                      <img
                        className="rounded-[10px] object-cover h-full w-full"
                        src={preview}
                        alt="Preview"
                      />
                    )}
                    <div
                      className="absolute top-1/2 left-1/2 rounded-full bg-white bg-opacity-20 p-2 -translate-x-1/2 -translate-y-1/2 hover:bg-opacity-40 transition cursor-pointer"
                      onClick={() => handleRemoveFile(fileId)}
                    >
                      <SvgCloseIcon fill="#676767" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              className="w-full rounded-[10px] bg-[#676767] border-[#676767] hover:text-white hover:opacity-90 focus:text-white"
              onClick={() => {
                form.reset();
                toggleDialogVisibility(false, <span />);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-[10px] hover:text-white hover:opacity-90 focus:text-white"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </form>
    </Form>
  );
};
