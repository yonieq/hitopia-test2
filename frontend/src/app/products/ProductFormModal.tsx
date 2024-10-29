// src/app/products/ProductFormModal.tsx

import React from "react";
import { Modal, Form, Input, Upload, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Image from "next/image";

const { TextArea } = Input;

interface ProductFormModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  loading: boolean;
  editingProduct: any;
  imageUrl: string;
  setUploadedImage: (file: File | null) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isVisible,
  onCancel,
  onFinish,
  loading,
  editingProduct,
  imageUrl,
  setUploadedImage,
}) => {
  const [form] = Form.useForm();

  const handleImageChange = (file: any) => {
    setUploadedImage(file);
    return false;
  };

  return (
    <Modal
      title={editingProduct ? "Edit Product" : "Create Product"}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={editingProduct}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="sku"
          label="SKU"
          rules={[{ required: true, message: "Please enter SKU" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="categories"
          label="Categories"
          rules={[{ required: true, message: "Please enter categories" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Price">
          <Input type="number" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <TextArea rows={4} />
        </Form.Item>
        {editingProduct && editingProduct.image && (
          <div className="mb-4">
            <p>Current Image:</p>
            <Image
              src={`${imageUrl}/${editingProduct.image}`}
              alt="Current Product Image"
              width={150}
              height={100}
            />
          </div>
        )}
        <Form.Item name="image" label="Image">
          <Upload
            listType="picture"
            beforeUpload={handleImageChange}
            accept=".jpg,.jpeg,.png,.webp,.gif"
            maxCount={1}
          >
            <Button icon={<PlusOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {editingProduct ? "Update Product" : "Create Product"}
        </Button>
      </Form>
    </Modal>
  );
};

export default ProductFormModal;
