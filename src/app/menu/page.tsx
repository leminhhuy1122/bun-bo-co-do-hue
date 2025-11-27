"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import MenuCard from "@/components/MenuCard";
import MenuModal from "@/components/MenuModal";
import Toast from "@/components/Toast";
import FloatingCart from "@/components/FloatingCart";
import LoadingSpinner from "@/components/LoadingSpinner";
import { MenuItem, Topping } from "@/types";
import { Filter, Search } from "lucide-react";

export default function MenuPage() {
  const { addToCart } = useCart();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [spicyFilter, setSpicyFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

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

  // Apply all filters
  const getFilteredItems = () => {
    let filtered = [...menuItems];

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    if (priceRange !== "all") {
      switch (priceRange) {
        case "under50":
          filtered = filtered.filter((item) => item.price < 50000);
          break;
        case "50-100":
          filtered = filtered.filter(
            (item) => item.price >= 50000 && item.price <= 100000
          );
          break;
        case "100-200":
          filtered = filtered.filter(
            (item) => item.price > 100000 && item.price <= 200000
          );
          break;
        case "over200":
          filtered = filtered.filter((item) => item.price > 200000);
          break;
      }
    }

    // Spicy level filter
    if (spicyFilter !== "all") {
      switch (spicyFilter) {
        case "mild":
          filtered = filtered.filter(
            (item) => !item.spicyLevel || item.spicyLevel <= 2
          );
          break;
        case "medium":
          filtered = filtered.filter(
            (item) => item.spicyLevel && item.spicyLevel >= 3 && item.spicyLevel <= 4
          );
          break;
        case "hot":
          filtered = filtered.filter(
            (item) => item.spicyLevel && item.spicyLevel >= 5
          );
          break;
      }
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "popular":
        filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
      default:
        // Keep default order
        break;
    }

    return filtered;
  };

  const filteredItems = getFilteredItems();
  const hasActiveFilters = 
    categoryFilter !== "all" || 
    priceRange !== "all" || 
    spicyFilter !== "all" || 
    searchQuery !== "" ||
    sortBy !== "default";

  const clearAllFilters = () => {
    setCategoryFilter("all");
    setPriceRange("all");
    setSpicyFilter("all");
    setSearchQuery("");
    setSortBy("default");
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
      <FloatingCart />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {loading && (
            <LoadingSpinner size="lg" message="Đang tải thực đơn..." />
          )}

          {/* Header */}
          {!loading && (
            <>
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
                {/* Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Tìm món ăn theo tên hoặc mô tả..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-hue-red outline-none transition"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition ${
                      hasActiveFilters
                        ? "bg-hue-red text-white border-hue-red"
                        : "bg-white text-gray-700 border-gray-300 hover:border-hue-red"
                    }`}
                  >
                    <Filter size={20} />
                    <span className="font-semibold">Bộ lọc</span>
                    {hasActiveFilters && (
                      <span className="bg-white text-hue-red rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        •
                      </span>
                    )}
                  </button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="pt-4 border-t border-gray-200 animate-fadeIn">
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      {/* Category Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Danh mục
                        </label>
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-hue-red outline-none transition"
                        >
                          <option value="all">Tất cả món</option>
                          <option value="main">🍜 Bún bò</option>
                          <option value="combo">🎁 Combo</option>
                          <option value="side">🍲 Món phụ</option>
                          <option value="drink">🥤 Đồ uống</option>
                          <option value="dessert">🍮 Tráng miệng</option>
                        </select>
                      </div>

                      {/* Price Range Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Khoảng giá
                        </label>
                        <select
                          value={priceRange}
                          onChange={(e) => setPriceRange(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-hue-red outline-none transition"
                        >
                          <option value="all">Tất cả</option>
                          <option value="under50">Dưới 50K</option>
                          <option value="50-100">50K - 100K</option>
                          <option value="100-200">100K - 200K</option>
                          <option value="over200">Trên 200K</option>
                        </select>
                      </div>

                      {/* Spicy Level Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Độ cay
                        </label>
                        <select
                          value={spicyFilter}
                          onChange={(e) => setSpicyFilter(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-hue-red outline-none transition"
                        >
                          <option value="all">Tất cả</option>
                          <option value="mild">🟢 Nhẹ (0-2)</option>
                          <option value="medium">🟡 Vừa (3-4)</option>
                          <option value="hot">🔴 Cay (5+)</option>
                        </select>
                      </div>

                      {/* Sort By */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Sắp xếp
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-hue-red outline-none transition"
                        >
                          <option value="default">Mặc định</option>
                          <option value="popular">Phổ biến</option>
                          <option value="price-asc">Giá: Thấp → Cao</option>
                          <option value="price-desc">Giá: Cao → Thấp</option>
                          <option value="name">Tên A-Z</option>
                        </select>
                      </div>
                    </div>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                      <div className="flex justify-end">
                        <button
                          onClick={clearAllFilters}
                          className="text-sm text-hue-red hover:text-hue-redDark font-semibold flex items-center gap-2"
                        >
                          <span>✕</span>
                          Xóa tất cả bộ lọc
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Active Filters Display */}
                {hasActiveFilters && !showFilters && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {categoryFilter !== "all" && (
                        <span className="px-3 py-1 bg-hue-cream text-hue-red rounded-full text-sm font-semibold flex items-center gap-2">
                          Danh mục: {categoryFilter}
                          <button
                            onClick={() => setCategoryFilter("all")}
                            className="hover:text-hue-redDark"
                          >
                            ✕
                          </button>
                        </span>
                      )}
                      {priceRange !== "all" && (
                        <span className="px-3 py-1 bg-hue-cream text-hue-red rounded-full text-sm font-semibold flex items-center gap-2">
                          Giá: {priceRange}
                          <button
                            onClick={() => setPriceRange("all")}
                            className="hover:text-hue-redDark"
                          >
                            ✕
                          </button>
                        </span>
                      )}
                      {spicyFilter !== "all" && (
                        <span className="px-3 py-1 bg-hue-cream text-hue-red rounded-full text-sm font-semibold flex items-center gap-2">
                          Độ cay: {spicyFilter}
                          <button
                            onClick={() => setSpicyFilter("all")}
                            className="hover:text-hue-redDark"
                          >
                            ✕
                          </button>
                        </span>
                      )}
                      {searchQuery && (
                        <span className="px-3 py-1 bg-hue-cream text-hue-red rounded-full text-sm font-semibold flex items-center gap-2">
                          Tìm: "{searchQuery}"
                          <button
                            onClick={() => setSearchQuery("")}
                            className="hover:text-hue-redDark"
                          >
                            ✕
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Results Summary */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  Tìm thấy <span className="font-bold text-hue-red">{filteredItems.length}</span> món ăn
                  {hasActiveFilters && " phù hợp với bộ lọc"}
                </p>
              </div>

              {/* Filtered Results */}
              {filteredItems.length > 0 ? (
                <section className="mb-16">
                  <div className="grid md:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        onViewDetail={handleViewDetail}
                      />
                    ))}
                  </div>
                </section>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">
                    Không tìm thấy món ăn
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-3 bg-hue-red text-white rounded-lg hover:bg-hue-redDark transition font-semibold"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  )}
                </div>
              )}
            </>
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
