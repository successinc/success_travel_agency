import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Services table - stores travel and visa services offered by Success Inc.
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Flight Tickets", "Canada Visit Visa"
  category: mysqlEnum("category", ["flight", "visit_visa", "work_permit"]).notNull(),
  description: text("description").notNull(),
  shortDescription: varchar("shortDescription", { length: 500 }),
  requirements: text("requirements"), // JSON or plain text
  processingTime: varchar("processingTime", { length: 255 }), // e.g., "7-10 business days"
  basePrice: int("basePrice"), // in cents or base currency unit
  icon: varchar("icon", { length: 255 }), // icon name or URL
  displayOrder: int("displayOrder").default(0),
  isActive: int("isActive").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Bookings/Inquiries table - stores user booking and inquiry submissions
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  serviceId: int("serviceId").notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  passportNumber: varchar("passportNumber", { length: 100 }),
  dateOfBirth: varchar("dateOfBirth", { length: 20 }), // YYYY-MM-DD format
  travelDate: varchar("travelDate", { length: 20 }), // YYYY-MM-DD format
  destination: varchar("destination", { length: 255 }),
  message: text("message"), // additional notes or requirements
  status: mysqlEnum("status", ["pending", "in_review", "approved", "rejected", "completed"]).default("pending"),
  notes: text("notes"), // admin notes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

/**
 * Testimonials table - stores customer reviews and testimonials
 */
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerTitle: varchar("customerTitle", { length: 255 }), // e.g., "Software Engineer", "Student"
  customerImage: varchar("customerImage", { length: 500 }), // URL to customer photo
  rating: int("rating").default(5), // 1-5 stars
  quote: text("quote").notNull(), // testimonial text
  service: varchar("service", { length: 255 }), // which service they used
  isApproved: int("isApproved").default(0),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

/**
 * Admin Notifications table - stores notifications for admin when bookings/inquiries are submitted
 */
export const adminNotifications = mysqlTable("adminNotifications", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["new_booking", "new_inquiry", "status_change", "system"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  relatedBookingId: int("relatedBookingId"),
  relatedUserId: int("relatedUserId"),
  isRead: int("isRead").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminNotification = typeof adminNotifications.$inferSelect;
export type InsertAdminNotification = typeof adminNotifications.$inferInsert;