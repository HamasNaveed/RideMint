-- Create email_exists RPC function to check if a user with the given email exists.
-- Defined as SECURITY DEFINER so that anonymous users (during login/forgot-password) can call it.
CREATE OR REPLACE FUNCTION public.email_exists(email_to_check text)
RETURNS boolean
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users WHERE email = email_to_check
  );
END;
$$ LANGUAGE plpgsql;
