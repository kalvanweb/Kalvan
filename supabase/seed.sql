-- Seed data matching the mock catalogue used during design/demo.
-- Run this after schema.sql, in the Supabase SQL Editor.

insert into products (slug, name, category, price, mrp, description, fabric, care, images, rating, review_count, is_new_arrival, is_best_seller) values
('oxford-tailored-shirt', 'Oxford Tailored Shirt', 'Shirts', 2799, 3499,
 'A tailored Oxford shirt cut from brushed cotton with a structured collar and a clean front placket. Built for a silhouette that holds its shape through a full day, from the desk to dinner.',
 '100% brushed cotton, mid-weight Oxford weave',
 array['Machine wash cold', 'Do not bleach', 'Iron on medium heat', 'Line dry'],
 array['https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=1200&q=80','https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&q=80'],
 4.7, 128, true, true),

('heavyweight-crew-tee', 'Heavyweight Crew Tee', 'T-Shirts', 1299, 1599,
 'A 240gsm heavyweight tee with a substantial drape and a reinforced crew neck that resists stretching out. The everyday layer built to outlast the season.',
 '100% combed cotton, 240gsm',
 array['Machine wash cold, inside out', 'Do not bleach', 'Tumble dry low'],
 array['https://images.unsplash.com/photo-1622445275576-721325763afe?w=1200&q=80','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80'],
 4.5, 94, true, false),

('tapered-chino-trouser', 'Tapered Chino Trouser', 'Trousers', 2999, null,
 'A tapered chino with a mid-rise waist and a two-way stretch weave that moves with you without losing its tailored line.',
 '98% cotton, 2% elastane twill',
 array['Machine wash cold', 'Do not bleach', 'Iron on low heat'],
 array['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&q=80','https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80'],
 4.6, 76, false, true),

('field-overshirt-jacket', 'Field Overshirt Jacket', 'Jackets', 4599, 5299,
 'A canvas overshirt built like a jacket: bellows pockets, a corozo-button placket and a brushed interior for the months in between seasons.',
 'Cotton canvas shell, brushed cotton lining',
 array['Dry clean recommended', 'Spot clean when possible'],
 array['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=80','https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1200&q=80'],
 4.8, 61, false, true),

('merino-crew-knit', 'Merino Crew Knit', 'Knitwear', 3499, null,
 'A fine-gauge merino crewneck that regulates temperature without the bulk. Sits close without clinging, and layers clean under an overshirt.',
 '100% extra-fine merino wool',
 array['Hand wash cold', 'Dry flat', 'Do not tumble dry'],
 array['https://images.unsplash.com/photo-1610384104075-e05c8b7a1548?w=1200&q=80','https://images.unsplash.com/photo-1608228088998-57828365d486?w=1200&q=80'],
 4.4, 42, true, false),

('everyday-pocket-tee', 'Everyday Pocket Tee', 'T-Shirts', 999, null,
 'A lighter-weight tee for warmer days, with a chest pocket and a slightly relaxed fit through the body.',
 '100% combed cotton, 180gsm',
 array['Machine wash cold', 'Tumble dry low'],
 array['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&q=80','https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&q=80'],
 4.3, 58, false, false);

-- Variants: sizes S–XXL for each color a product supports, with a
-- descending stock count so the "only N left" UI has something to show.
do $$
declare
  p record;
  colors text[];
  sizes text[] := array['S','M','L','XL','XXL'];
  c text;
  s text;
  i int;
begin
  for p in select id, slug from products loop
    colors := case p.slug
      when 'oxford-tailored-shirt' then array['Charcoal','Warm Ivory']
      when 'heavyweight-crew-tee' then array['Charcoal','Olive','Stone']
      when 'tapered-chino-trouser' then array['Charcoal','Stone']
      when 'field-overshirt-jacket' then array['Olive','Charcoal']
      when 'merino-crew-knit' then array['Stone','Charcoal','Olive']
      when 'everyday-pocket-tee' then array['Warm Ivory','Charcoal']
    end;

    foreach c in array colors loop
      i := 0;
      foreach s in array sizes loop
        insert into product_variants (product_id, size, color, sku, stock)
        values (p.id, s, c, upper(left(c, 2)) || '-' || s || '-' || substr(md5(random()::text), 1, 4), greatest(0, 12 - i * 2));
        i := i + 1;
      end loop;
    end loop;
  end loop;
end $$;
