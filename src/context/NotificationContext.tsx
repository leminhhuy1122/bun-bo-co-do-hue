"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export interface Notification {
  id: string;
  type: "order" | "reservation";
  message: string;
  timestamp: Date;
  read: boolean;
  orderId?: number;
  reservationId?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastOrderCheck, setLastOrderCheck] = useState<Date>(new Date());
  const [lastReservationCheck, setLastReservationCheck] = useState<Date>(
    new Date()
  );

  // Load notifications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("adminNotifications");
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotifications(
        parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }))
      );
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("adminNotifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Check for new orders and reservations every 30 seconds
  useEffect(() => {
    const checkNewItems = async () => {
      try {
        console.log("🔔 Checking for new orders and reservations...");

        // Check for new orders
        const ordersRes = await fetch("/api/orders?limit=10");
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          console.log("📦 Orders data:", ordersData);

          if (
            ordersData.success &&
            ordersData.data &&
            Array.isArray(ordersData.data)
          ) {
            const newOrders = ordersData.data.filter(
              (order: any) => new Date(order.created_at) > lastOrderCheck
            );

            console.log(`🆕 Found ${newOrders.length} new orders`);

            newOrders.forEach((order: any) => {
              addNotification({
                type: "order",
                message: `Bạn có đơn hàng mới ${order.order_number} - ${order.customer_name}`,
                orderId: order.id,
              });
            });

            if (newOrders.length > 0) {
              setLastOrderCheck(new Date());
            }
          }
        }

        // Check for new reservations
        const reservationsRes = await fetch("/api/reservations?limit=10");
        if (reservationsRes.ok) {
          const reservationsData = await reservationsRes.json();
          console.log("📅 Reservations data:", reservationsData);

          if (
            reservationsData.success &&
            reservationsData.data &&
            Array.isArray(reservationsData.data)
          ) {
            const newReservations = reservationsData.data.filter(
              (reservation: any) =>
                new Date(reservation.created_at) > lastReservationCheck
            );

            console.log(`🆕 Found ${newReservations.length} new reservations`);

            newReservations.forEach((reservation: any) => {
              addNotification({
                type: "reservation",
                message: `Có người đặt bàn - ${reservation.customer_name} (${reservation.number_of_guests} người)`,
                reservationId: reservation.id,
              });
            });

            if (newReservations.length > 0) {
              setLastReservationCheck(new Date());
            }
          }
        }
      } catch (error) {
        console.error("❌ Error checking new items:", error);
      }
    };

    // Check immediately on mount after 5 seconds
    const timer = setTimeout(() => {
      console.log("🚀 Starting notification system...");
      checkNewItems();
    }, 5000);

    // Then check every 30 seconds
    const interval = setInterval(checkNewItems, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [lastOrderCheck, lastReservationCheck, addNotification]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
