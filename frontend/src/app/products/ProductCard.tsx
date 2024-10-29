// src/app/products/ProductCard.tsx

import React from "react";
import { Card, Button, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    sku: string;
    categories: string;
    price: number;
    image: string;
  };
  imageUrl: string;
  actionMenu: JSX.Element;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  imageUrl,
  actionMenu,
}) => (
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
      <Dropdown overlay={actionMenu} trigger={["click"]}>
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
);

export default ProductCard;
