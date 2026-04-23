import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Settings, Lock, User, Globe, Shield, Save, AlertCircle } from 'lucide-react';

const AdminSettings = () => {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [changingPw, setChangingPw] = useState(false);

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) return toast.error('New passwords do not match');
    if (passwords.new.length < 6) return toast.error('Password must be at least 6 characters');

    setChangingPw(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.new });
    setChangingPw(false);

    if (error) return toast.error(error.message);
    toast.success('Password updated successfully');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" /> Settings
          </h1>
          <p className="text-sm text-muted-foreground">Manage your admin account and site settings</p>
        </div>

        {/* Account Info */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50 bg-muted/20">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Account Information
            </h3>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium font-mono">{user?.email}</span>
            </div>
            {/* <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">User ID</span>
              <span className="text-xs font-mono text-muted-foreground">{user?.id}</span>
            </div> */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Role</span>
              <span className="inline-flex items-center gap-1 text-xs bg-primary/15 text-primary px-2 py-0.5 rounded font-medium">
                <Shield className="w-3 h-3" /> Admin
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Sign In</span>
              <span className="text-sm text-muted-foreground">{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50 bg-muted/20">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" /> Change Password
            </h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">New Password</label>
              <input type="password" value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Minimum 6 characters" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Confirm New Password</label>
              <input type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Re-enter new password" />
            </div>
            <button onClick={handlePasswordChange} disabled={changingPw || !passwords.new} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50">
              <Save className="w-4 h-4" /> {changingPw ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>

        {/* Site Info */}
        {/* <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50 bg-muted/20">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" /> Site Information
            </h3>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Site Name</span>
              <span className="text-sm font-medium">AmortIQ</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Platform</span>
              <span className="text-sm text-muted-foreground">Lovable Cloud</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Framework</span>
              <span className="text-sm font-mono text-muted-foreground">React + Vite + Tailwind</span>
            </div>
          </div>
        </div> */}

        {/* Danger Zone */}
        <div className="bg-card rounded-xl border border-destructive/30 overflow-hidden">
          <div className="px-5 py-3 border-b border-destructive/20 bg-destructive/5">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" /> Danger Zone
            </h3>
          </div>
          <div className="p-5">
            <p className="text-sm text-muted-foreground mb-3">Dangerous actions that cannot be undone. Please proceed with caution.</p>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl text-sm border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors" onClick={() => toast.info('Contact support to delete your account')}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
