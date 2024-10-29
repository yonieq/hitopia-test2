"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Dropdown,
  Menu,
  Modal,
  message,
  Pagination,
  Input,
  Select,
  Space,
  Spin,
} from "antd";
import {
  DownOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Image from "next/image";
import { debounce } from "lodash";

const { confirm } = Modal;
const { Option } = Select;

interface Product {
  id: number;
  name: string;
  sku: string;
  categories: string;
  price: number;
  image: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search,
          limit,
          page,
        },
      });

      setProducts(response.data.data);
      setTotalItems(response.data.total); // Set total items for pagination
      setCurrentPage(response.data.current_page); // Update current page
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product.id !== id));
      message.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Failed to delete product");
    }
  };

  const actionMenu = (id: number) => (
    <Menu>
      <Menu.Item key="detail" onClick={() => router.push(`/products/${id}`)}>
        Detail
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => router.push(`/products/${id}/edit`)}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => showDeleteConfirm(id)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="flex justify-between mb-4">
        <Button type="primary" onClick={() => router.push("/products/create")}>
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
              <Card
                key={product.id}
                cover={
                  <Image
                    src={
                      product.image
                        ? `${imageUrl}/${product.image}`
                        : "/images/no-pictures.png"
                    }
                    alt="product"
                    width={300}
                    height={200}
                    className="object-cover rounded-t-md"
                  />
                }
                actions={[
                  <Dropdown
                    overlay={actionMenu(product.id)}
                    trigger={["click"]}
                  >
                    <Button>
                      Actions <DownOutlined />
                    </Button>
                  </Dropdown>,
                ]}
              >
                <Card.Meta
                  title={product.name}
                  description={
                    <>
                      <p>SKU: {product.sku}</p>
                      <p>Categories: {product.categories}</p>
                      <p>Price: Rp. {product.price}</p>
                    </>
                  }
                />
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false} // Disable size changer if not needed
            />
          </div>
        </>
      )}
    </Layout>
  );
};

export default Products;
