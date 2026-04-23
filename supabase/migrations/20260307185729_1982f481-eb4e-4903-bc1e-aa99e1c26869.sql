
-- Create media storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media', 'media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf']);

-- Allow anyone to read media files
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- Allow authenticated admins to upload
CREATE POLICY "Admin upload access" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- Allow authenticated admins to update
CREATE POLICY "Admin update access" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- Allow authenticated admins to delete
CREATE POLICY "Admin delete access" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
