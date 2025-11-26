// TypeScript Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "main" | "side" | "topping" | "drink" | "dessert" | "combo";
  spicyLevel?: number; // 1-5
  popular?: boolean;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  toppings: Topping[];
  note?: string;
}

export interface Combo {
  id: string;
  name: string;
  description: string;
  items: string[]; // Menu item IDs
  originalPrice: number;
  discountPrice: number;
  image: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
}

export interface Reservation {
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  note?: string;
}

export interface Order {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    note?: string;
  };
  paymentMethod: "cash" | "bank" | "momo";
}
