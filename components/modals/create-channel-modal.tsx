"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


import { Input } from "../ui/input";

import { Button } from "../ui/button";

import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import {zodResolver} from "@hookform/resolvers/zod";
import {useParams, useRouter} from "next/navigation";
import {ModalType, useModal} from "@/hooks/useModal";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ChannelType} from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(1 , {
    message: "channel name is required",
  }),
  type: z.nativeEnum(ChannelType),
});

export const CreateChannelModal = () => {

  const router = useRouter();
  const params = useParams();

  const modal = useModal();
  const isOpen = modal.isOpen && modal.type == ModalType.CREATE_CHANNEL;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    }
  });


  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      const url = qs.stringifyUrl({
        url: `/api/channels`,
        query: {
          serverId: params?.serverId,
        },
      })
      await axios.post(url , values);
      form.reset();
      router.refresh();
      modal.close();
    } catch (err){
      console.log(err);
    }
  };

  const handleClose = () => {
    form.reset();
    modal.close();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open?) => {
      if (!open){
        handleClose();
      }
    }}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6" >
          <DialogTitle className="text-2xl text-center font-bold" >
            Create Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Create Text, Voice & Audio channels to chat with friends.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-8 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Channel name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 space-x-0 space-y-0 px"
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="
                            bg-zinc-300/50 border-0 focus-visible:ring-0 text-black
                            focus-visible:ring-offset-0 space-x-0 space-y-0 px
                            capitalize">
                          <SelectValue
                            placeholder="Select a channel type"/>
                        </SelectTrigger>
                        <SelectContent>
                          {
                            Object.values(ChannelType).map((e) => (
                              <SelectItem
                                key={e}
                                value={e}
                                className="capitalize"
                              >
                                {e.toLowerCase()}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-2 py-6">
              <Button disabled={isLoading} variant="primary">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}