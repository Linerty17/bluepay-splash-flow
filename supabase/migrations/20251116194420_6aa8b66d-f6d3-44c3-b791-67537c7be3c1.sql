-- Add admin policies for referral_upgrades table
-- Allow admins to view all upgrade requests
CREATE POLICY "Admins can view all referral upgrades"
ON public.referral_upgrades
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update upgrade status
CREATE POLICY "Admins can update referral upgrades"
ON public.referral_upgrades
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));