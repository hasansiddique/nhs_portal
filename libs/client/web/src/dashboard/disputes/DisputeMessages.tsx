import { toast } from 'sonner';
import React, { useId, useState } from 'react';

import { request } from '@your-props/client/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from '@your-props/client/ui';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema, MessageSchema } from '../messages/Messages';

export const DisputeMessages = ({
  disputeId,
  getDisputeMessagesList,
}: {
  disputeId: string;
  getDisputeMessagesList: (param: boolean) => void;
}) => {
  const [updatingDispute, setUpdatingDispute] = useState(false);

  const sendDisputeMessage = async (formData: MessageSchema) => {
    setUpdatingDispute(true);

    try {
      const { data } = await request.post(`/dispute-reply/${disputeId}`, {
        message: formData,
      });
      getDisputeMessagesList(false);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setUpdatingDispute(false);
    }
  };

  const formId = useId();

  const form = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: '',
    },
  });

  const { errors } = form.formState;

  return (
    <div className="py-[3rem] relative bottom-0">
      <Form {...form}>
        <form
          id={formId}
          className="form-submit"
          onSubmit={form.handleSubmit((data) => {
            sendDisputeMessage(data);
            form.reset();
          })}
        >
          <FormField
            name="message"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex items-center">
                    <Input
                      placeholder="Start typing here..."
                      withError={!!errors.message}
                      className="email h-[46px] pr-[50px]"
                      disabled={updatingDispute}
                      type="text"
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit((data) => {
                            sendDisputeMessage(data);
                            form.reset();
                          })();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        form.handleSubmit((data) => {
                          sendDisputeMessage(data);
                          form.reset();
                        })();
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-[35px] px-[14px] py-[5px] rounded-[6px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70"
                      disabled={updatingDispute}
                    >
                      <i className={'fa fa-paper-plane'}></i>
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
