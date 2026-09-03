-- Test-data purge before go-live. Prepared 2026-09-03; runs against the AP
-- Komforts Supabase project (tfwtyhdgdtquhlpnidqk) once the connector is
-- restored. TWO steps, run separately — NEVER blind:
--
-- STEP 1 (read-only): inventory every customer with their data footprint.
-- The human-reviewed output decides who counts as fake. Real signups stay.

select c.id, c.full_name, c.email, c.phone, c.customer_type, c.client_code,
  c.created_at::date as created,
  c.auth_user_id,
  (select count(*) from properties p where p.customer_id = c.id) as props,
  (select count(*) from invoices i where i.customer_id = c.id) as invoices,
  (select count(*) from quotes q where q.customer_id = c.id) as quotes,
  (select count(*) from jobs j join properties p2 on p2.id = j.property_id where p2.customer_id = c.id) as jobs,
  (select count(*) from memberships m join properties p3 on p3.id = m.property_id where p3.customer_id = c.id) as memberships
from customers c
order by c.created_at;

-- Also inventory loose rows not tied to a customer:
-- select id, source, name, email, phone, created_at::date from enquiries order by created_at;
-- select id, email, created_at::date from auth.users order by created_at;

-- STEP 2 (destructive — only after the reviewed id list is FINAL):
-- replace the :fake_ids list, then run inside one transaction.
-- Order matters because several FKs are RESTRICT, not CASCADE.
--
-- begin;
-- with fake as (select unnest(array['<id1>','<id2>']::uuid[]) as id)
-- , fake_props as (select p.id from properties p join fake on p.customer_id = fake.id)
-- delete from equipment_service_history where equipment_id in (select e.id from equipment e join fake_props fp on e.property_id = fp.id);
-- ... (photos, equipment, jobs, memberships, communications, exclusions,
--      invoice_items, invoices, quote_items, quotes [converted_invoice_id first],
--      enquiries.customer_id, properties, customers)
-- Then storage: delete equipment-photos objects under each property id.
-- Then auth: delete from auth.users where id in (select auth_user_id from fake where auth_user_id is not null);
-- commit;
--
-- NOTE: full deletion SQL intentionally not pre-baked with ids — the id list
-- must come from the STEP 1 review at run time.
