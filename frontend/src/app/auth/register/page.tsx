// src/app/auth/register.tsx

"use client";

import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_URL_SERVER;

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/register`, values);
      const { status, user } = response.data;

      if (status === "success") {
        message.success(
          `Welcome, ${user.name}! Your account has been created.`
        );
        router.push("/auth/login"); // Redirect to login page after registration
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      message.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      <Form layout="vertical" onFinish={handleRegister}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, min: 6 }]}
        >
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Register
        </Button>
      </Form>
      <div className="text-center mt-4">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-500 hover:underline">
          Login here!
        </Link>
      </div>
    </div>
  );
};

export default Register;
