"use client";

import { useState } from "react";
import { MenuItem, Topping } from "@/types";
import { X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import menuData from "@/data/menu.json";

interface MenuModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    toppings: Topping[],
    note: string,
    quantity: number
  ) => void;
}

export default function MenuModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
}: MenuModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [note, setNote] = useState("");
  const [spiceLevel, setSpiceLevel] = useState<"normal" | "less" | "more">(
    "normal"
  );

  // Get topping and side items (món phụ)
  const toppings = menuData
    .filter((item) => item.category === "topping" || item.category === "side")
    .map((item) => ({ id: item.id, name: item.name, price: item.price }));

  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings((prev) => {
      const exists = prev.find((t) => t.id === topping.id);
      if (exists) {
        return prev.filter((t) => t.id !== topping.id);
      }
      return [...prev, topping];
    });
  };

  const getTotalPrice = () => {
    const basePrice = item.price * quantity;
    const toppingsPrice =
      selectedToppings.reduce((sum, t) => sum + t.price, 0) * quantity;
    return basePrice + toppingsPrice;
  };

  const handleAddToCart = () => {
    const finalNote = `${
      spiceLevel !== "normal"
        ? `Mức độ cay: ${spiceLevel === "less" ? "Ít cay" : "Thêm cay"}. `
        : ""
    }${note}`;
    onAddToCart(item, selectedToppings, finalNote.trim(), quantity);
    onClose();
    // Reset form
    setQuantity(1);
    setSelectedToppings([]);
    setNote("");
    setSpiceLevel("normal");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-hue-red to-hue-redDark px-6 py-4 flex justify-between items-center">
          <h2 className="font-display text-xl font-bold text-white">
            Chi tiết món ăn
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - scrollable with hidden scrollbar */}
        <div
          className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Image */}
          {item.image && (
            <div className="relative h-56 rounded-2xl overflow-hidden mb-4 shadow-lg">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Info */}
          <h3 className="font-display text-xl font-bold text-hue-redDark mb-2">
            {item.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
          <div className="bg-gradient-to-r from-hue-red to-orange-600 text-white inline-block px-4 py-2 rounded-full text-2xl font-bold mb-4 shadow-md">
            {formatPrice(item.price)}
          </div>

          {/* Spice Level */}
          {item.category === "main" && item.spicyLevel && (
            <div className="mb-4">
              <h4 className="font-semibold text-hue-redDark mb-2 text-sm">
                🌶️ Mức độ cay:
              </h4>
              <div className="flex gap-3">
                {["less", "normal", "more"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSpiceLevel(level as any)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      spiceLevel === level
                        ? "border-hue-red bg-hue-red text-white"
                        : "border-gray-300 hover:border-hue-red"
                    }`}
                  >
                    {level === "less"
                      ? "Ít cay"
                      : level === "normal"
                      ? "Vừa"
                      : "Thêm cay"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toppings */}
          {item.category === "main" && (
            <div className="mb-4">
              <h4 className="font-semibold text-hue-redDark mb-2 text-sm">
                ➕ Thêm topping:
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {toppings.map((topping) => (
                  <button
                    key={topping.id}
                    onClick={() => toggleTopping(topping)}
                    className={`p-2 rounded-lg border-2 text-left transition text-sm ${
                      selectedToppings.find((t) => t.id === topping.id)
                        ? "border-hue-red bg-hue-cream"
                        : "border-gray-300 hover:border-hue-red"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{topping.name}</span>
                      <span className="text-hue-red font-bold">
                        +{formatPrice(topping.price)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          <div className="mb-4">
            <h4 className="font-semibold text-hue-redDark mb-2 text-sm">
              Ghi chú:
            </h4>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Nhiều rau, ít hành..."
              className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-hue-red outline-none text-sm"
              rows={2}
            />
          </div>

          {/* Quantity */}
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-semibold text-hue-redDark text-sm">
              Số lượng:
            </h4>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                <Minus size={20} />
              </button>
              <span className="text-2xl font-bold w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-hue-red text-white hover:bg-hue-redDark flex items-center justify-center"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-hue-red to-orange-600 text-white py-3 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            🛒 Thêm vào giỏ - {formatPrice(getTotalPrice())}
          </button>
        </div>
      </div>
    </div>
  );
}
