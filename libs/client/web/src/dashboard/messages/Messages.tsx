import { z } from 'zod';
import { format, parse } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useId, useState, useRef } from 'react';

import { BackIcon, ChevronRightIcon, SvgEmptyInbox } from '@your-props/client/icons';
import {
  MessageProps,
  useInboxState,
  useInboxActions,
  WebSocketManager, getUserId,
} from '@your-props/client/utils';
import {
  Form,
  Input,
  Spinner,
  FormItem,
  FormField,
  FormMessage,
  FormControl,
  NoContentPage,
} from '@your-props/client/ui';

import { MessagesUser } from './partials/MessageUser';
import { MessagesReply } from './partials/MessageReply';
import defaultProfileImage from '../../theme/assets/images/avatar/user-img.png';

export const messageSchema = z.object({
  message: z
    .string()
    .min(1, { message: 'Message cannot be empty!' })
    .max(250, {
      message: 'Message is too long (maximum 250 characters).',
    }),
});
export type MessageSchema = z.infer<typeof messageSchema>;

export const MessagesPage = () => {
  const userId = getUserId();

  const messageTimestamps = useRef<number[]>([]);
  const messageQueue = useRef<MessageSchema[]>([]);
  const isProcessingQueue = useRef(false);

  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');

  const { isInitialized, activeChat, isFetchingUserMessages, isFetchingChats, chats } = useInboxState();
  const { markChatAsRead, fetchChats, setActiveChat } = useInboxActions();

  useEffect(() => {
    if (userId && !isInitialized) {
      fetchChats();
    }
  }, [userId]);

  const activeChatData = chats.find((chat) => chat.id === activeChat) || null;

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const markAsRead = () => {
    if(activeChatData.id)
      markChatAsRead(activeChatData.id)
  }

  useEffect(() => {
    if(activeChatData) {
      scrollToBottom();
      markAsRead();
    }
  }, [activeChatData]);

  const processMessageQueue = () => {
    const now = Date.now();

    // Filter timestamps that are still within the last 10 seconds
    messageTimestamps.current = messageTimestamps.current.filter(
      (timestamp) => now - timestamp < 10_000
    );

    while (messageQueue.current.length > 0 && messageTimestamps.current.length < 3) {
      const nextMessage = messageQueue.current.shift()!; // Take first message from queue
      messageTimestamps.current.push(now);

      WebSocketManager.send(`chat-${activeChat}`, {
        action: 'chatMessage',
        chat_id: activeChat,
        ...nextMessage,
      });

      if (nextMessage.message === pendingMessage) {
        setPendingMessage('');
        setIsInputDisabled(false);
      }
    }

    if (messageQueue.current.length > 0) {
      setTimeout(processMessageQueue, 1000); // Retry every second
    } else {
      isProcessingQueue.current = false;
    }
  };

  const sendMessage = (formData: MessageSchema) => {
    if(activeChat) {
      messageQueue.current.push(formData);

      if (messageTimestamps.current.length >= 3) {
        setIsInputDisabled(true);
        setPendingMessage(formData.message);
      }

      if (!isProcessingQueue.current) {
        isProcessingQueue.current = true;
        processMessageQueue(); // Start processing queue
      }
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

  const [isChat, setIsChat] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenChat = () => {
    setIsChat(true);
  };

  const handleCloseChat = () => {
    setIsChat(false);
    setActiveChat(0); //reset section
  };

  return isFetchingChats ? (
    <div className="flex justify-center items-center my-60 w-full">
      <Spinner loadingText="Loading..." className="text-primary text-[32px]" />
    </div>
  ) : chats?.length > 0 ? (
    <div className="bg-[#3939394D]">
      <div className="row relative h-[90vh] max-h-[800px] overflow-hidden">

        {/* left side -- message list */}
        <div
          className={`${isMobile && isChat  ? 'hidden' : 'flex'} col-md-4 bg-[#2E2E2E] flex-col h-full`}
          style={{
            boxShadow: '4px 0px 4px 0px #00000033',
          }}
        >
          <h2 className="text-[24px] leading-[36px] font-bold px-10 py-7">
            Inbox
          </h2>

          <div className="flex flex-col overflow-y-scroll flex-grow px-4 pb-10">
            {chats?.map((chatData, index) => (
              <MessagesUser
                key={index}
                chatData={chatData}
                onClick={handleOpenChat} // Click to open chat - mobile
              />
            ))}
          </div>
        </div>

        {/* right side -- message  */}
        {activeChat && activeChatData ? (
          <div className={`${isMobile && isChat  ? 'flex' : 'hidden'} col-md-8 h-full bg-[#2E2E2E] p-0 m-0 flex flex-col justify-between`}>
            <div
              style={{
                boxShadow: '4px 0px 4px 0px #00000033',
              }}
              className="flex justify-between items-center right-[15px] left-0 py-[10px] pl-[25px] pr-[18px] bg-[#2E2E2E]"
            >
              <div className="flex flex-row items-center">
                <button onClick={handleCloseChat} className='md:hidden bg-transparent rounded-none border-0 p-2 hover:opacity-90'>
                  <BackIcon/>
                </button>
                <img
                  alt="User"
                  width={48}
                  height={48}
                  src={activeChatData?.recipientAvatar || defaultProfileImage}
                  className="w-[48px] h-[48px] object-cover rounded-[10px] default_image "
                />

                <p className="text-[14px] leading-[18px] font-bold ml-8">
                  {activeChatData?.recipientUsername}
                </p>
              </div>
            </div>

            {isFetchingUserMessages ? (
              <div className="flex justify-center items-center my-60 w-full">
                <Spinner
                  loadingText="Loading..."
                  className="text-primary text-[32px]"
                />
              </div>
            ) : (
              <>
                <div
                  ref={messagesContainerRef}
                  className="flex flex-col flex-grow overflow-y-scroll px-4 "
                >
                  {activeChatData?.messages.map((message: MessageProps, index: any) => {
                    return (
                      <MessagesReply
                        isReceived={Number(message.senderId) !== Number(userId)}
                        messageText={message.message}
                        messageTime={message?.createdAt}
                        key={index}
                      />
                    );
                  })}
                </div>

                <div className="px-6 py-[3rem] relative bottom-0">
                  <Form {...form}>
                    <form
                      id={formId}
                      className="form-submit"
                      onSubmit={form.handleSubmit((data) => {
                        sendMessage(data);
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
                                  withError={!!errors.message || isInputDisabled}
                                  className="email h-[46px] pr-[50px]"
                                  type="text"
                                  disabled={isInputDisabled}
                                  {...field}
                                  value={pendingMessage || form.watch('message')}
                                  onChange={(e) => {
                                    form.setValue('message', e.target.value);
                                    setPendingMessage(e.target.value);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      form.handleSubmit((data) => {
                                        sendMessage(data);
                                        if (!isInputDisabled) form.reset();
                                      })();
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    form.handleSubmit((data) => {
                                      sendMessage(data);
                                      form.reset();
                                    })();
                                  }}
                                  disabled={isInputDisabled}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-[35px] px-[14px] py-[5px] rounded-[6px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70"
                                >
                                  <i className={'fa fa-paper-plane'}></i>
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                            {isInputDisabled && <p className="error-text font-normal text-destructive leading-[15px]">Slow down, you're typing too fast. Please wait a few seconds.</p>}
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="col-10 col-md-8 flex flex-col bg-[#2E2E2E] p-0 m-0 items-center justify-center">
            <SvgEmptyInbox />
            <h2 className="text-[28px] mt-12">Select user from list</h2>
          </div>
        )}
      </div>
    </div>
  ) : (
    <NoContentPage
      subText="No messages found"
      showBackgroundColor={false}
      isSpacing={false}
    />
  );
};
