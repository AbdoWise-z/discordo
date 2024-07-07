"use client";

import React, {useEffect} from 'react';
import {CreateServerModal} from "@/components/modals/create-server-modal";
import TestModel from "@/components/view/test-model";
import {InviteModal} from "@/components/modals/invite-modal";
import {EditServerModal} from "@/components/modals/edit-server-modal";
import {ManageMembersModal} from "@/components/modals/manage-members-modal";
import {CreateChannelModal} from "@/components/modals/create-channel-modal";
import {LeaveServerModel} from "@/components/modals/leave-server-model";
import {DeleteServerModel} from "@/components/modals/delete-server-model";

const ModelProvider = () => {
  const [isMounted, setIsMounted] = React.useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal closable/>
      <InviteModal />
      <EditServerModal />
      <ManageMembersModal />
      <CreateChannelModal />
      <LeaveServerModel />
      <DeleteServerModel />
    </>
  );
};

export default ModelProvider;