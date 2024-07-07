import React from 'react';
import NavigationSidebar from "@/components/nav/navigation-sidebar";
import {CreateServerModal} from "@/components/modals/create-server-modal";

const MainLayout = (
  {
    children,

  } : {
    children: React.ReactNode;
  }
) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[70px] h-full" >
        {children}
      </main>
    </div>
  );
};

export default MainLayout;