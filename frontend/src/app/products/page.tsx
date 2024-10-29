// src/app/products/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Pagination,
  Input,
  Select,
  Space,
  message,
  Spin,
  Modal,
  Form,
} from "antd";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import Layout from "@/components/Layout";
import ProductCard from "./ProductCard";
import ProductFormModal from "./ProductFormModal";
import ProductActions from "./ProductActions";
import { useRouter } from "next/navigation";

const { Option } = Select;
const { confirm } = Modal;

interface Product {
  id: number;
  name: string;
  sku: string;
  categories: string;
  price: number;
  image: string;
  description: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_URL_SERVER;
  const imageUrl = process.env.NEXT_PUBLIC_URL_IMAGE;

  const fetchProducts = async (
    search = "",
    page = currentPage,
    limit = pageSize
  ) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Unauthorized. Please log in.");
        router.push("/auth/login");
        return;
      }

      const response = await axios.get(`${apiUrl}/products`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, limit, page },
      });

      setProducts(response.data.data);
      setTotalItems(response.data.total);
      setCurrentPage(response.data.current_page);
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(searchTerm, currentPage, pageSize);
  }, [currentPage, pageSize]);

  const debouncedSearch = useCallback(
    debounce((value: any) => {
      setCurrentPage(1);
      fetchProducts(value, 1, pageSize);
    }, 500),
    [pageSize]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleResetFilter = () => {
    setSearchTerm("");
    setPageSize(10);
    setCurrentPage(1);
    fetchProducts("", 1, 10);
  };

  const handleLimitChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const showDeleteConfirm = (id: number) => {
    confirm({
      title: "Are you sure you want to delete this product?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDelete(id),
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product.id !== id));
      message.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Failed to delete product");
    }
  };

  const openCreateModal = () => {
    form.resetFields();
    setEditingProduct(null);
    setUploadedImage(null);
    setIsModalVisible(true);
  };

  const openEditModal = (id: number) => {
    const product = products.find((p) => p.id === id) || null;
    setEditingProduct(product);
    form.setFieldsValue(product);
    setUploadedImage(null); // Reset the uploaded image state for edit
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    form.resetFields();
    setEditingProduct(null);
    setUploadedImage(null);
    setIsModalVisible(false);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("sku", values.sku);
      formData.append("categories", values.categories);
      formData.append("price", values.price);
      formData.append("description", values.description);

      // Append the image file if it exists
      if (uploadedImage) {
        formData.append("image", uploadedImage);
      }

      if (editingProduct) {
        await axios.post(`${apiUrl}/products/${editingProduct.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Product updated successfully");
      } else {
        await axios.post(`${apiUrl}/products`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Product created successfully");
      }

      fetchProducts(searchTerm, currentPage, pageSize);
      handleModalCancel();
    } catch (error) {
      console.error("Error saving product:", error);
      message.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="flex justify-between mb-4">
        <Button type="primary" onClick={openCreateModal}>
          Create Product
        </Button>

        <Space>
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            suffix={<SearchOutlined />}
          />
          <Select value={pageSize} onChange={handleLimitChange}>
            <Option value={10}>10</Option>
            <Option value={25}>25</Option>
            <Option value={50}>50</Option>
            <Option value={100}>100</Option>
          </Select>
          <Button
            onClick={() => fetchProducts(searchTerm, currentPage, pageSize)}
          >
            Search
          </Button>
          <Button onClick={handleResetFilter}>Reset Filter</Button>
        </Space>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                imageUrl={imageUrl}
                actionMenu={
                  <ProductActions
                    onEdit={() => openEditModal(product.id)}
                    onDelete={() => showDeleteConfirm(product.id)}
                  />
                }
              />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}

      <ProductFormModal
        isVisible={isModalVisible}
        onCancel={handleModalCancel}
        onFinish={handleFormSubmit}
        loading={loading}
        editingProduct={editingProduct}
        imageUrl={imageUrl}
        setUploadedImage={setUploadedImage}
      />
    </Layout>
  );
};

export default Products;
