# Apna Kirana Store (Single-Store Kirana + POS Platform)

A full-fledged single-store grocery commerce and store management application built with **Next.js 15+ (App Router)**, **Supabase (PostgreSQL, Auth, Storage, Edge/RPC)**, and ready to deploy on **Vercel**.

## Architecture & Tech Stack

- **Frontend & App:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend & Database:** Supabase (PostgreSQL 15+).
  - Row Level Security (RLS) for customers & owner.
  - Stored Procedures / RPC (`place_kirana_order`) for atomic stock reservations and inventory movement logs.
  - Supabase Storage for product images and bills.
  - Supabase Auth for phone/email customer & owner login.
- **Deployment:** Vercel (Optimized for Next.js App Router & Server Actions).

## Getting Started

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Provide your Supabase project credentials in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Apply the database schema in Supabase SQL editor:
   - File: `supabase/migrations/20260923000001_initial_kirana_schema.sql`
4. Start local development:
   ```bash
   npm run dev
   ```
