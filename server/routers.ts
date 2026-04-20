import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { services, bookings, testimonials, adminNotifications, InsertBooking } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Services Router
  services: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      try {
        const result = await db
          .select()
          .from(services)
          .where(eq(services.isActive, 1))
          .orderBy(services.displayOrder);
        return result;
      } catch (error) {
        console.error("Error fetching services:", error);
        return [];
      }
    }),

    getById: publicProcedure
      .input((val: any) => {
        if (typeof val === "number") return val;
        if (typeof val === "string") return parseInt(val, 10);
        throw new Error("Invalid input");
      })
      .query(async ({ input: serviceId }) => {
        const db = await getDb();
        if (!db) return null;
        try {
          const result = await db
            .select()
            .from(services)
            .where(eq(services.id, serviceId))
            .limit(1);
          return result[0] || null;
        } catch (error) {
          console.error("Error fetching service:", error);
          return null;
        }
      }),
  }),

  // Bookings Router
  bookings: router({
    create: protectedProcedure
      .input((val: any) => val as InsertBooking)
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        try {
          const result = await db.insert(bookings).values({
            ...input,
            userId: ctx.user.id,
          });

          // Notify admin of new booking
          await notifyOwner({
            title: "New Booking Submitted",
            content: `${input.fullName} submitted a new booking for ${input.destination}`,
          });

          return { success: true, id: (result as any).insertId || 0 };
        } catch (error) {
          console.error("Error creating booking:", error);
          throw new Error("Failed to create booking");
        }
      }),

    listUserBookings: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        const result = await db
          .select()
          .from(bookings)
          .where(eq(bookings.userId, ctx.user.id))
          .orderBy(desc(bookings.createdAt));
        return result;
      } catch (error) {
        console.error("Error fetching user bookings:", error);
        return [];
      }
    }),

    getById: protectedProcedure
      .input((val: any) => {
        if (typeof val === "number") return val;
        if (typeof val === "string") return parseInt(val, 10);
        throw new Error("Invalid input");
      })
      .query(async ({ input: bookingId, ctx }) => {
        const db = await getDb();
        if (!db) return null;

        try {
          const result = await db
            .select()
            .from(bookings)
            .where(eq(bookings.id, bookingId))
            .limit(1);

          const booking = result[0];
          if (!booking || booking.userId !== ctx.user.id) {
            throw new Error("Unauthorized");
          }

          return booking;
        } catch (error) {
          console.error("Error fetching booking:", error);
          return null;
        }
      }),
  }),

  // Testimonials Router
  testimonials: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];

      try {
        const result = await db
          .select()
          .from(testimonials)
          .where(eq(testimonials.isApproved, 1))
          .orderBy(testimonials.displayOrder);
        return result;
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        return [];
      }
    }),
  }),

  // Admin Notifications Router
  adminNotifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      // Only admin can view notifications
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) return [];

      try {
        const result = await db
          .select()
          .from(adminNotifications)
          .orderBy(desc(adminNotifications.createdAt))
          .limit(50);
        return result;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
      }
    }),

    markAsRead: protectedProcedure
      .input((val: any) => {
        if (typeof val === "number") return val;
        if (typeof val === "string") return parseInt(val, 10);
        throw new Error("Invalid input");
      })
      .mutation(async ({ input: notificationId, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        try {
          await db
            .update(adminNotifications)
            .set({ isRead: 1 })
            .where(eq(adminNotifications.id, notificationId));

          return { success: true };
        } catch (error) {
          console.error("Error marking notification as read:", error);
          throw new Error("Failed to update notification");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
