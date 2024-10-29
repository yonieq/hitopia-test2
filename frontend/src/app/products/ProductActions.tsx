// src/app/products/ProductActions.tsx

import React from "react";
import { Menu } from "antd";

interface ProductActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  onEdit,
  onDelete,
}) => (
  <Menu>
    <Menu.Item key="edit" onClick={onEdit}>
      Edit
    </Menu.Item>
    <Menu.Item key="delete" onClick={onDelete}>
      Delete
    </Menu.Item>
  </Menu>
);

export default ProductActions;
