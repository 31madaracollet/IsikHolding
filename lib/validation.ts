import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Adınızı girin.").max(80),
  email: z.string().trim().email("Geçerli bir e-posta girin.").max(160),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal(""))
    .transform((value) => value || null),
  subject: z.enum([
    "Genel bilgi",
    "Satış & sipariş",
    "Toptan & bayilik",
    "Proje danışmanlığı",
    "Teknik destek",
    "Kariyer",
  ]),
  message: z.string().trim().min(10, "Mesajınız en az 10 karakter olmalı.").max(2000),
  consent: z.literal(true),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta girin.").max(160),
  source: z.string().max(40).optional(),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const orderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(160),
    phone: z.string().trim().min(10).max(30),
    city: z.string().trim().min(2).max(60),
    district: z.string().trim().min(2).max(60),
    address: z.string().trim().min(10).max(400),
    note: z.string().trim().max(500).optional().default(""),
  }),
  items: z
    .array(
      z.object({
        slug: z.string().trim().min(1).max(120),
        qty: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(30),
  coupon: z.string().trim().max(30).optional(),
  consent: z.literal(true),
});
