// src/app/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";

// Fungsi untuk mengecek apakah token sudah kadaluarsa
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwt_decode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Waktu saat ini dalam detik
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return true; // Jika terjadi error saat decode, anggap token kadaluarsa
  }
};

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !isTokenExpired(token)) {
      // Jika token ada dan belum kadaluarsa, arahkan ke halaman /products
      router.push("/products");
    } else {
      // Jika token tidak ada atau sudah kadaluarsa, arahkan ke halaman /auth/login
      router.push("/auth/login");
    }
  }, [router]);

  return null;
}
