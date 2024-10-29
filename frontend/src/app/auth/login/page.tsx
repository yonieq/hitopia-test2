// src/app/auth/login.tsx

"use client";

import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";
import AuthLayout from "@/components/AuthLayout";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_URL_SERVER;

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/login`, values);
      const { status, user, token } = response.data;

      if (status === "success") {
        // Simpan token di localStorage atau state management
        localStorage.setItem("token", token);

        message.success(`Welcome, ${user.name}`);
        router.push("/products");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      message.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <Form
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: 360 }}
        onFinish={handleLogin}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input your Email!",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-between items-center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="#">Forgot password</a>
          </div>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading}>
            Log in
          </Button>
          <div className="text-center mt-2">
            or <a href="/auth/register">Register now!</a>
          </div>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
};

export default Login;
