import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata: Metadata = {
  title: "Bún Bò Huế Cố Đô - Hương vị truyền thống Huế xưa",
  description:
    "Thưởng thức bún bò Huế chính gốc với nước dùng đậm đà, thịt bò tươi ngon. Đặt món online hoặc đặt bàn trước.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <CartProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </CartProvider>
      </body>
    </html>
  );
}
