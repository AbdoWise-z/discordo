"use client";

import * as z from 'zod';
import React from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Plus} from "lucide-react";
import qs from 'query-string';
import axios from "axios";
import {ModalType, useModal} from "@/hooks/use-modal";
import EmojiPickerButton from "@/components/chat/emoji-picker-button";
import {useRouter} from "next/navigation";
import {useAutoResize} from "@/hooks/use-auto-resize";


const formSchema = z.object({
  content: z.string().min(1),
})

interface ChatInputProps {
  apiUrl: string;
  query: Record<string , any>,
  name: string,
  type: 'conversation' | 'channel',
}

const ChatInput = (
  {
    apiUrl,
    query,
    name,
    type,
  } : ChatInputProps
) => {

  const router = useRouter();
  const {ref, fitToSize , onInput} = useAutoResize();

  const form = useForm<z.infer<typeof formSchema>>(
    {
      defaultValues: {
        content: "",
      },
      resolver: zodResolver(formSchema),
    }
  )

  const handleKeyDown = (e: any) => {
    if (e.key == 'Enter'){
      if (e.shiftKey){
        return;
      }
      form.handleSubmit(onSubmit)();
    }
  };

  const modal = useModal();

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {

      const url = qs.stringifyUrl({
        url: apiUrl,
        query: query,
      });

      await axios.post(url, {
        "content": values.content,
      });

      form.reset();
      setTimeout(fitToSize , 10);
      //router.refresh();

    } catch (error){
      console.log(error);
    } finally {

    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({field}) => {
            return (
              <FormItem>
                <FormControl>
                  <div className="relative p-4 pb-6">
                    <button
                      type="button"
                      onClick={() => {
                        modal.open(ModalType.MESSAGE_FILE , {
                          apiUrl,
                          query
                        });
                      }}
                      className="absolute top-7 left-8 h-[24px] w-[24px]
                       bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600
                       dark:hover:bg-zinc-300 transition rounded-full
                       p-1 flex items-center"
                    >
                      <Plus className="text-white dark:text-[#313338]"/>
                    </button>

                    <textarea
                      onInput={onInput}
                      onKeyDown={handleKeyDown}
                      {...field}
                      disabled={isLoading}
                      rows={1}
                      ref={ref as any}
                      className="px-14 py-3 bg-zinc-200/90 dark:bg-zinc-700/75
                      border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0
                      text-zinc-600 dark:text-zinc-200 w-full rounded-md resize-none
                      max-h-[300px]"
                      placeholder={`Message ${type == 'channel' ? ('#' + name) : name}`}
                    />

                    <div className="absolute top-7 right-8">
                      <EmojiPickerButton
                        onChange={(v) => {
                          field.onChange(`${field.value}${v}`)
                        }}
                      />
                    </div>
                  </div>
                </FormControl>
              </FormItem>
              )
            }}
        />
      </form>
    </Form>
  );
};

export default ChatInput;