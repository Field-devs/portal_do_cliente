-- Add RLS policies for all tables

create policy "Enable read access for all users"
on "public"."pessoas"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."cargo"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."estado"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."cidade"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."bairro"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."logradouro"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."tipo_responsavel"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."responsavel_financeiro"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."outr"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."ava"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."cliente_final"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."cliente_afiliado"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."pf_cliente_afiliado"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."plano_outr"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."addon"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."addon_ava"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."plano_ava"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."plano_caracteristica"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."plano_caracteristica_qtd"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."status_pagamento"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."relacao_financeira"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."pagamentos"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."contas_pagar_ava"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."contas_pagar_cf"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."end_ava"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."end_cliente_final"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."proposta_outr"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Enable read access for all users"
on "public"."proposta_ava_cf"
as PERMISSIVE
for ALL
to public
using (
  true
);