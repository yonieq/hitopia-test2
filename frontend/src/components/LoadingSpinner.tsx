// src/components/LoadingSpinner.tsx

"use client";

import React from "react";
import { Spin } from "antd";

const contentStyle: React.CSSProperties = {
  padding: 50,
  background: "#FFFFFF",
  borderRadius: 4,
};

const content = <div style={contentStyle} />;

const LoadingSpinner: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: "#FFFFFF",
      }}
    >
      <Spin tip="Loading Data" size="large">
        {content}
      </Spin>
    </div>
  );
};

export default LoadingSpinner;
