"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import {
  message,
  Spin,
  Input,
  Form,
  InputNumber,
  Upload,
  Button,
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";

const EditProduct: React.FC = () => {
  const [initialValues, setInitialValues] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const router = useRouter();
  const { id } = useParams();

  const apiUrl = process.env.NEXT_PUBLIC_URL_SERVER;
  const imageUrl = process.env.NEXT_PUBLIC_URL_IMAGE;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          message.error("Unauthorized. Please log in.");
          router.push("/auth/login");
          return;
        }

        const response = await axios.get(`${apiUrl}/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setInitialValues({
          ...response.data,
          imageUrl: response.data.image
            ? `${imageUrl}/${response.data.image}`
            : null,
        });
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          message.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          router.push("/auth/login");
        } else {
          console.error("Error fetching product:", error);
          message.error("Failed to load product for editing");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [apiUrl, id, imageUrl, router]);

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("sku", values.sku);
      formData.append("categories", values.categories);
      formData.append("price", values.price);
      formData.append("description", values.description);

      if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj);
      }

      const token = localStorage.getItem("token");
      await axios.post(`${apiUrl}/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Product updated successfully");
      router.push(`/products`);
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Edit Product</h1>
      {initialValues ? (
        <Form
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleSubmit}
        >
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

          <Form.Item label="Current Image">
            {initialValues.imageUrl && (
              <Image
                src={initialValues.imageUrl}
                alt="product"
                width={100}
                height={100}
                className="object-cover rounded"
              />
            )}
          </Form.Item>

          <Form.Item name="image" label="Upload New Image">
            <Upload
              name="image"
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Update Product
            </Button>
            <Button danger onClick={() => router.back()} className="px-6">
              Back
            </Button>
          </Space>
        </Form>
      ) : (
        <p>Failed to load product details</p>
      )}
    </Layout>
  );
};

export default EditProduct;
