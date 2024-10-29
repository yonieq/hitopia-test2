"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Form, Input, Button, InputNumber, Upload, message, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Layout from "@/components/Layout";

const CreateProduct: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_URL_SERVER;

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append all form fields to formData
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      // Check if an image is uploaded; if not, set "image" to null
      if (fileList.length > 0 && fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      } else {
        formData.append("image", ""); // Adds a blank value for image if none is uploaded
      }

      // Ambil token dari localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Unauthorized. Please log in.");
        router.push("/auth/login"); // Arahkan ke halaman login jika token tidak ada
        return;
      }

      await axios.post(`${apiUrl}/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Tambahkan token ke header
        },
      });

      message.success("Product created successfully");
      router.push("/products");
    } catch (error) {
      console.error("Error creating product:", error);
      message.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Create Product</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="categories"
          label="Categories"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="image" label="Image">
          <Upload
            name="image"
            listType="picture"
            maxCount={1}
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false} // Prevents auto-upload
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="px-6"
          >
            Submit
          </Button>
          <Button danger onClick={() => router.back()} className="px-6">
            Back
          </Button>
        </Space>
      </Form>
    </Layout>
  );
};

export default CreateProduct;
