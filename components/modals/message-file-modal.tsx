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
  FormMessage,
} from "@/components/ui/form";

import { FileUpload } from "@/components/utility/file-upload";

import { Button } from "../ui/button";

import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {ModalType, useModal} from "@/hooks/use-modal";
import qs from "query-string";

const formSchema = z.object({
  fileUrl: z.string().min(1 , {
    message: "Attachment is required",
  }),
});

export const MessageFileModal = (

) => {

  const router = useRouter();

  const modal = useModal();
  const isOpen = modal.isOpen && modal.type == ModalType.MESSAGE_FILE;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: ""
    }
  });


  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const {apiUrl , query} = modal.data;

      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query: query,
      });

      await axios.post(url, {
        "content": values.fileUrl,
        "fileUrl": values.fileUrl,
      });

      form.reset();
      modal.close();
    } catch (error){
      console.log(error);
    } finally {

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
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            select a file to be sent as a message attachment.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-8 py-4">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <div>
                        <FileUpload
                          endpoint="messageAttachmentUploader"
                          value={field.value}
                          onChange={field.onChange}
                        />
                        </div>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-2 py-6">
              <Button disabled={isLoading} variant="primary">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}