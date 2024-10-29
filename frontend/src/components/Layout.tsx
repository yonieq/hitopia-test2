import React, { ReactNode } from "react";
import { Layout, Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import type { MenuProps } from "antd";

const { Header, Content, Footer } = Layout;

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const router = useRouter();

  // Dropdown menu for profile and logout
  const profileMenu: MenuProps["items"] = [
    {
      key: "logout",
      label: "Logout",
      onClick: () => {
        localStorage.removeItem("token"); // Remove token
        router.push("/auth/login"); // Redirect to login page
      },
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          className="logo"
          style={{ color: "#fff", fontWeight: "bold", fontSize: "1.5rem" }}
        >
          Product Management
        </div>

        {/* Profile dropdown */}
        <Dropdown overlay={<Menu items={profileMenu} />} trigger={["click"]}>
          <Button type="text" style={{ color: "#fff" }}>
            Account <DownOutlined />
          </Button>
        </Dropdown>
      </Header>
      <Content style={{ padding: "20px 50px", backgroundColor: "#fff" }}>
        <div
          style={{ padding: 24, minHeight: "80vh", backgroundColor: "#f0f2f5" }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>© 2024 Niq Dev</Footer>
    </Layout>
  );
};

export default AppLayout;
