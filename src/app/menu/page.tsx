"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import MenuCard from "@/components/MenuCard";
import MenuModal from "@/components/MenuModal";
import Toast from "@/components/Toast";
import { MenuItem, Topping } from "@/types";
import { Filter, Search } from "lucide-react";

export default function MenuPage() {
  const { addToCart } = useCart();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMenuItems(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading menu:", err);
        setLoading(false);
      });
  }, []);

  const mainDishes = menuItems.filter((item) => item.category === "main");
  const sideDishes = menuItems.filter((item) => item.category === "side");
  const drinks = menuItems.filter((item) => item.category === "drink");
  const desserts = menuItems.filter((item) => item.category === "dessert");
  const combos = menuItems.filter((item) => item.category === "combo");

  const getFilteredItems = () => {
    let filtered = mainDishes;

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      if (categoryFilter === "popular") {
        filtered = filtered.filter((item) => item.popular);
      } else if (categoryFilter === "spicy") {
        filtered = filtered.filter(
          (item) => item.spicyLevel && item.spicyLevel >= 4
        );
      }
    }

    return filtered;
  };

  // Helper function to determine which sections to show based on filter
  const shouldShowSection = (
    section: "main" | "side" | "drinks" | "desserts" | "combos"
  ) => {
    if (categoryFilter === "all") return true;
    if (categoryFilter === "combo") return section === "combos";
    if (categoryFilter === "side") return section === "side";
    // For popular/spicy filters, show main dishes only
    return section === "main";
  };

  const handleViewDetail = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleAddToCart = (
    item: MenuItem,
    toppings: Topping[],
    note: string,
    quantity: number
  ) => {
    addToCart(item, toppings, note, quantity);
    setToast({
      message: `Đã thêm ${quantity} ${item.name} vào giỏ hàng!`,
      type: "success",
    });
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl font-bold text-hue-redDark mb-4">
              Thực Đơn
            </h1>
            <p className="text-gray-600 text-lg">
              Khám phá các món ăn đặc sản Huế chính gốc
            </p>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Tìm món ăn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-hue-red outline-none transition"
                />
              </div>

              {/* Filter */}
              <div className="flex gap-2 items-center">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-hue-red outline-none transition"
                >
                  <option value="all">Tất cả</option>
                  <option value="combo">🎁 Combo Tiết Kiệm</option>
                  <option value="popular">Bán chạy</option>
                  <option value="spicy">Cay nồng</option>
                  <option value="side">Món phụ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Combos */}
          {shouldShowSection("combos") && combos.length > 0 && (
            <section className="mb-16">
              <h2 className="font-display text-3xl font-bold text-hue-redDark mb-6 flex items-center gap-3">
                <span className="text-4xl">🎁</span>
                Combo Tiết Kiệm
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {combos.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onViewDetail={handleViewDetail}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Main Dishes */}
          {shouldShowSection("main") && (
            <section className="mb-16">
              <h2 className="font-display text-3xl font-bold text-hue-redDark mb-6 flex items-center gap-3">
                <span className="text-4xl">🍜</span>
                Bún Bò Huế
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {getFilteredItems().map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onViewDetail={handleViewDetail}
                  />
                ))}
              </div>
              {getFilteredItems().length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Không tìm thấy món ăn phù hợp
                </div>
              )}
            </section>
          )}

          {/* Side Dishes */}
          {shouldShowSection("side") && sideDishes.length > 0 && (
            <section className="mb-16">
              <h2 className="font-display text-3xl font-bold text-hue-redDark mb-6 flex items-center gap-3">
                <span className="text-4xl">🍲</span>
                Các Món Phụ
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {sideDishes.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onViewDetail={handleViewDetail}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Drinks */}
          {shouldShowSection("drinks") && drinks.length > 0 && (
            <section className="mb-16">
              <h2 className="font-display text-3xl font-bold text-hue-redDark mb-6 flex items-center gap-3">
                <span className="text-4xl">🥤</span>
                Đồ Uống
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {drinks.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onViewDetail={handleViewDetail}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Desserts */}
          {shouldShowSection("desserts") && desserts.length > 0 && (
            <section className="mb-16">
              <h2 className="font-display text-3xl font-bold text-hue-redDark mb-6 flex items-center gap-3">
                <span className="text-4xl">🍮</span>
                Tráng Miệng
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {desserts.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onViewDetail={handleViewDetail}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Menu Modal */}
        {selectedItem && (
          <MenuModal
            item={selectedItem}
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </>
  );
}
