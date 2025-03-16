// import { AppSidebar } from "@/components/app-sidebar";
import Sidebar from "@/components/sidebarComponent/SidebarComponent";
import MapComponent from "@/widgets/mapComponent/ui/mapComponent";
import React from "react";
import { ToastContainer } from "react-toastify";

const MainComponent = () => {
  return (
    <>
      <ToastContainer />
      <Sidebar>
        <MapComponent></MapComponent>
      </Sidebar>
    </>
  );
};

export default MainComponent;
