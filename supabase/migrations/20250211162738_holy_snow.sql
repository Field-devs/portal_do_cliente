-- Rename pessoas table to usuario
ALTER TABLE IF EXISTS public.pessoas RENAME TO usuario;

-- Update all foreign key constraints to reference the new table name
ALTER TABLE public.outr 
  RENAME CONSTRAINT outr_pessoas_fk TO outr_usuario_fk;

ALTER TABLE public.ava 
  RENAME CONSTRAINT ava_pessoas_fk TO ava_usuario_fk;

ALTER TABLE public.cliente_final 
  RENAME CONSTRAINT cliente_final_pessoas_fk TO cliente_final_usuario_fk;

ALTER TABLE public.cliente_afiliado 
  RENAME CONSTRAINT cliente_afiliado_pessoas_fk TO cliente_afiliado_usuario_fk;

ALTER TABLE public.plano_outr 
  RENAME CONSTRAINT plano_outr_pessoas_fk TO plano_outr_usuario_fk;

ALTER TABLE public.addon 
  RENAME CONSTRAINT addon_pessoas_fk TO addon_usuario_fk;

ALTER TABLE public.addon_ava 
  RENAME CONSTRAINT addon_ava_pessoas_fk TO addon_ava_usuario_fk;

ALTER TABLE public.proposta_outr 
  RENAME CONSTRAINT proposta_outr_pessoas_fk TO proposta_outr_usuario_fk;

-- Rename the sequence if it exists
ALTER SEQUENCE IF EXISTS pessoas_user_id_seq RENAME TO usuario_id_seq;

-- Update the RLS policy to reference the new table name
DROP POLICY IF EXISTS "Enable read access for all users" ON public.usuario;

CREATE POLICY "Enable read access for all users"
ON public.usuario
AS PERMISSIVE
FOR ALL
TO public
USING (true);