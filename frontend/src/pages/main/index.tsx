"use client";

import React from "react";

import MainComponent from "@/shared/mainComponent/mainComponent";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Index = () => {
  return (
    <ProtectedRoute>
      <MainComponent />
    </ProtectedRoute>
  );
};

export default Index;
