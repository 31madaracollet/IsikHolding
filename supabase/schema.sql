-- =============================================================================
-- Işık Holding · Supabase şeması
-- Supabase Dashboard → SQL Editor bölümünde bu dosyayı çalıştırın.
-- Tüm tablolar RLS ile korunur; yazma işlemleri yalnızca sunucu tarafındaki
-- service_role anahtarıyla yapılır. Böylece form verileri istemciye açılmaz.
-- =============================================================================

create extension if not exists "pgcrypto";

-- 1) İletişim mesajları ------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  user_agent text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default now()
);

comment on table public.contact_messages is 'İletişim formundan gelen talepler';

-- 2) Bülten aboneleri --------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text default 'website',
  confirmed boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.newsletter_subscribers is 'Işık Bülten e-posta listesi';

-- 3) Siparişler --------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  district text not null,
  address text not null,
  note text,
  subtotal numeric(12,2) not null,
  discount numeric(12,2) not null default 0,
  shipping numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  coupon text,
  status text not null default 'new'
    check (status in ('new', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

comment on table public.orders is 'Web sitesinden gelen sipariş talepleri';

create index if not exists orders_email_idx on public.orders (email);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- 4) Sipariş kalemleri -------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  unit_price numeric(12,2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- 5) İndirim kodları (isteğe bağlı, ileride genişletmek için) ----------------
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  rate numeric(5,4) not null check (rate > 0 and rate < 1),
  label text not null,
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

insert into public.coupons (code, rate, label)
values
  ('ISIK15', 0.15, 'Kulüp indirimi %15'),
  ('HOSGELDIN10', 0.10, 'Hoş geldin indirimi %10')
on conflict (code) do nothing;

-- 6) RLS ---------------------------------------------------------------------
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.coupons enable row level security;

-- Bilinçli olarak hiçbir anon/authenticated policy tanımlanmadı.
-- service_role RLS'i baypas ettiği için API route'ları yazabilir;
-- anon anahtarıyla tablolara erişim mümkün değildir.

-- 7) Görünümler --------------------------------------------------------------
create or replace view public.order_summary as
select
  o.order_number,
  o.customer_name,
  o.email,
  o.total,
  o.status,
  o.created_at,
  count(i.id) as item_count,
  sum(i.quantity) as total_quantity
from public.orders o
left join public.order_items i on i.order_id = o.id
group by o.id;

-- 8) Örnek analitik sorguları ------------------------------------------------
-- Son 30 günün sipariş cirosu:
--   select coalesce(sum(total), 0) from public.orders
--   where created_at > now() - interval '30 days' and status <> 'cancelled';
--
-- En çok satan ürünler:
--   select product_name, sum(quantity) as qty
--   from public.order_items group by product_name order by qty desc limit 10;
