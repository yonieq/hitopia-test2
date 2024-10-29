"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { Button, Spin, message, Space } from "antd";
import Layout from "@/components/Layout";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Product {
  id: number;
  name: string;
  sku: string;
  categories: string;
  price: number;
  image: string;
}

const ProductDetail: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
          router.push("/auth/login"); // Redirect ke halaman login jika tidak ada token
          return;
        }

        const response = await axios.get<Product>(`${apiUrl}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        message.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [apiUrl, id]);

  if (loading) return <LoadingSpinner />;

  if (!product) return <p>Product not found</p>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Product Details</h1>
      <div className="mb-4">
        <Image
          src={`${imageUrl}/${product.image}`}
          alt="product"
          width={100}
          height={100}
          className="object-cover rounded"
        />
        <h2 className="text-2xl font-semibold">{product.name}</h2>
        <p>
          <strong>SKU:</strong> {product.sku}
        </p>
        <p>
          <strong>Categories:</strong> {product.categories}
        </p>
        <p>
          <strong>Price:</strong> ${product.price}
        </p>
      </div>
      <Space>
        <Button
          danger
          onClick={() => router.push(`/products/${product.id}/edit`)}
        >
          Edit Product
        </Button>
        <Button type="primary" onClick={() => router.back()} className="px-6">
          Back
        </Button>
      </Space>
    </Layout>
  );
};

export default ProductDetail;
