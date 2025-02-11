-- Drop existing table if it exists
DROP TABLE IF EXISTS public."USER" CASCADE;

-- Create new USER table with updated schema
CREATE TABLE public."USER" (
  id serial NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamp without time zone NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email)
) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE public."USER" ENABLE ROW LEVEL SECURITY;

-- Create policies for USER table
CREATE POLICY "Users can view their own data"
  ON public."USER"
  FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data"
  ON public."USER"
  FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Admins can manage all users"
  ON public."USER"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public."USER" u
      WHERE u.id::text = auth.uid()::text
      AND u.id IN (1, 2)
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_email ON public."USER"(email);
CREATE INDEX IF NOT EXISTS idx_user_created_at ON public."USER"(created_at);