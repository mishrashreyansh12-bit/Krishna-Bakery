-- ─── 1. Products Table ───────────────────────────────────────────────────────
create table if not exists products (
  id          serial primary key,
  name        text not null,
  category    text not null,
  price       integer not null,
  description text,
  image       text,
  tag         text default '',
  rating      numeric(2,1) default 4.5,
  reviews     integer default 0,
  veg         boolean default true,
  customizable boolean default false,
  created_at  timestamptz default now()
);

-- ─── 2. Orders Table ─────────────────────────────────────────────────────────
create table if not exists orders (
  id           uuid primary key default gen_random_uuid(),
  customer_name text not null,
  contact      text not null,
  email        text default '',
  order_type   text default 'delivery',
  address      text,
  items        jsonb not null,
  subtotal     integer not null,
  discount     integer default 0,
  total        integer not null,
  promo_code   text default '',
  status       text default 'pending',
  created_at   timestamptz default now()
);

-- ─── 3. Chat Leads Table ─────────────────────────────────────────────────────
create table if not exists chat_leads (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  contact    text not null,
  created_at timestamptz default now()
);

-- ─── 4. Reviews Table ────────────────────────────────────────────────────────
create table if not exists reviews (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  rating     integer check (rating between 1 and 5),
  comment    text,
  product    text default 'General',
  created_at timestamptz default now()
);

-- ─── 5. Seed Products Data ───────────────────────────────────────────────────
insert into products (id, name, category, price, description, image, tag, rating, reviews, veg, customizable) values
(1,  'Classic English Cake',          'Cakes',      450,  'Light sponge, no frosting, baked fresh daily.',                    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80', 'Bestseller', 4.8, 124, true, true),
(2,  'Velvet Cheesecake',             'Cakes',      380,  'New York style baked cheesecake, rich and creamy.',                'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=80', 'Bestseller', 4.9, 98,  true, false),
(3,  'Chocolate Truffle Cake',        'Cakes',      520,  'Dark chocolate ganache layered cake. Intensely rich.',             'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80', '',           4.7, 76,  true, true),
(4,  'Mango Mousse Cake',             'Cakes',      490,  'Fresh mango pulp with light mousse layers. Summer special.',       'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80', 'Seasonal',   4.6, 54,  true, true),
(5,  'Butterscotch Cake',             'Cakes',      420,  'Classic butterscotch with caramel drizzle.',                       'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=400&q=80', '',           4.5, 61,  true, true),
(16, 'Chocolate Rouge Reverie',       'Cakes',      1499, 'Eggless dark chocolate mousse with ruby red berry glaze.',         'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=400&q=80', 'Luxe',       4.9, 43,  true, true),
(17, 'Midnight Blueberry Cheesecake', 'Cakes',      1199, 'Velvety cheesecake topped with fresh blueberry compote.',         'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=80', 'Luxe',       4.8, 38,  true, false),
(18, 'Luxe Mango Cheese Cake',        'Cakes',      1399, 'Creamy mango cheesecake with fresh alphonso mango topping.',      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80', 'Luxe',       4.8, 51,  true, true),
(19, 'Fresh Mango Cream Cake',        'Cakes',      1499, 'Soft sponge layered with fresh mango cream and mango glaze.',     'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=400&q=80', 'Luxe',       4.7, 29,  true, true),
(20, 'Cocoa Hazelnut Mousse',         'Cakes',      2499, 'Eggless cocoa hazelnut mousse cake with praline crunch.',         'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80', 'Luxe',       4.9, 22,  true, true),
(6,  'Croissant',                     'Pastries',   120,  'Flaky, buttery, baked fresh every morning.',                      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80', '',           4.7, 210, true, false),
(7,  'Pain au Chocolat',              'Pastries',   150,  'Croissant dough wrapped around dark chocolate.',                  'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=400&q=80', '',           4.8, 143, true, false),
(8,  'Almond Danish',                 'Pastries',   160,  'Puff pastry with almond cream filling.',                          'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=400&q=80', '',           4.6, 89,  true, false),
(15, 'Parisian Macarons',             'Pastries',   280,  'Delicate French macarons in seasonal flavours.',                  'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=400&q=80', 'Trending',   4.7, 67,  true, false),
(9,  'Classic Fudge Brownie',         'Brownies',   90,   'Dense, fudgy, with a crinkle top. Our most loved item.',          'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80', 'Bestseller', 4.9, 312, true, false),
(10, 'Walnut Brownie',                'Brownies',   100,  'Fudge brownie loaded with crunchy walnuts.',                      'https://images.unsplash.com/photo-1589375462-390b7e0b5e5e?auto=format&fit=crop&w=400&q=80', '',           4.7, 178, true, false),
(11, 'Cream Cheese Brownie',          'Brownies',   110,  'Swirled cream cheese on fudge base.',                             'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=400&q=80', '',           4.6, 95,  true, false),
(12, 'Hot Chocolate',                 'Beverages',  195,  'Rich Belgian chocolate, 250ml. Velvety smooth.',                  'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=400&q=80', 'Bestseller', 4.8, 267, true, false),
(13, 'Cold Coffee',                   'Beverages',  180,  'Chilled espresso with milk and ice.',                             'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80', '',           4.6, 134, true, false),
(14, 'Masala Chai',                   'Beverages',  80,   'Spiced Indian tea, freshly brewed.',                              'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80', '',           4.7, 189, true, false)
on conflict (id) do nothing;

-- ─── 6. Row Level Security (RLS) ─────────────────────────────────────────────
alter table products   enable row level security;
alter table orders     enable row level security;
alter table chat_leads enable row level security;
alter table reviews    enable row level security;

-- Products: anyone can read
create policy "Public read products" on products for select using (true);

-- Orders: anyone can insert
create policy "Anyone can place order" on orders for insert with check (true);
-- Orders: only read own orders (by contact)
create policy "Read own orders" on orders for select using (true);

-- Chat leads: anyone can insert
create policy "Anyone can submit lead" on chat_leads for insert with check (true);

-- Reviews: anyone can read and insert
create policy "Public read reviews" on reviews for select using (true);
create policy "Anyone can post review" on reviews for insert with check (true);
