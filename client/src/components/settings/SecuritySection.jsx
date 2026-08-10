import { useState } from 'react';
import {
sendEmailVerification,
updatePassword,
signOut,
EmailAuthProvider,
reauthenticateWithCredential,
} from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SecuritySection() {
const user = auth.currentUser;
const navigate = useNavigate();

const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [saving, setSaving] = useState(false);

const handleResendVerification = async () => {
if (!user) return;


try {
  await sendEmailVerification(user);
  toast.success('Verification email sent');
} catch (error) {
  console.error(error);
  toast.error('Failed to send verification email');
}


};

const handleChangePassword = async () => {
if (!user) return;


if (!currentPassword || !newPassword || !confirmPassword) {
  toast.error('Please fill all password fields');
  return;
}

if (newPassword.length < 6) {
  toast.error('Password must be at least 6 characters');
  return;
}

if (newPassword !== confirmPassword) {
  toast.error('New passwords do not match');
  return;
}

try {
  setSaving(true);

  const credential = EmailAuthProvider.credential(
    user.email,
    currentPassword
  );

  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);

  setCurrentPassword('');
  setNewPassword('');
  setConfirmPassword('');

  toast.success('Password updated successfully');
} catch (error) {
  console.error(error);

  switch (error.code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      toast.error('Current password is incorrect');
      break;

    case 'auth/weak-password':
      toast.error('Password is too weak');
      break;

    default:
      toast.error('Failed to update password');
  }
} finally {
  setSaving(false);
}


};

const handleSignOut = async () => {
try {
await signOut(auth);
toast.success('Signed out successfully');
} catch (error) {
console.error(error);
toast.error('Failed to sign out');
}
};

return ( <div className='rounded-3xl border border-default bg-surface p-6 transition-theme sm:p-8'> <h2 className='text-3xl font-bold text-primary'>Security</h2>

  <p className='mt-2 text-secondary'>
    Manage your password, verification, and account sessions.
  </p>

  <div className='mt-8 space-y-6'>
    {/* Email Verification */}
    <div className='rounded-2xl border border-default bg-surface p-5 transition-theme'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h3 className='text-xl font-semibold text-primary'>
            Email Verification
          </h3>

          <p className='mt-1 text-secondary'>
            Verify your email address to secure your account.
          </p>
        </div>

        <span
          className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
            user?.emailVerified
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-500'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400'
          }`}
        >
          {user?.emailVerified ? 'Verified' : 'Not verified'}
        </span>
      </div>

      {!user?.emailVerified && (
        <button
          onClick={handleResendVerification}
          className='mt-4 w-full rounded-xl border border-default bg-surface px-4 py-3 text-sm font-medium text-primary transition-theme hover:bg-surface-hover sm:w-auto'
        >
          Re-send verification email
        </button>
      )}
    </div>

    {/* Change Password */}
    <div className='rounded-2xl border border-default bg-surface p-5 transition-theme'>
      <h3 className='text-xl font-semibold text-primary'>
        Change Password
      </h3>

      <p className='mt-1 text-secondary'>
        Update your password to keep your account secure.
      </p>

      <div className='mt-4 space-y-3'>
        <input
          type='password'
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder='Current password'
          className='w-full rounded-xl border border-default bg-surface px-4 py-3 text-primary outline-none transition-theme focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
        />

        <input
          type='password'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder='New password'
          className='w-full rounded-xl border border-default bg-surface px-4 py-3 text-primary outline-none transition-theme focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
        />

        <input
          type='password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder='Confirm new password'
          className='w-full rounded-xl border border-default bg-surface px-4 py-3 text-primary outline-none transition-theme focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
        />

        <div className='flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <button
            type='button'
            onClick={() => navigate('/forgot-password')}
            className='text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline'
          >
            Forgot password?
          </button>

          <button
            onClick={handleChangePassword}
            disabled={saving}
            className='w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto'
          >
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>

    {/* Active Session */}
    <div className='rounded-2xl border border-default bg-surface p-5 transition-theme'>
      <h3 className='text-xl font-semibold text-primary'>
        Active Session
      </h3>

      <p className='mt-1 text-secondary'>
        Information about your current account session.
      </p>

      <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='rounded-xl border border-default bg-surface p-4 transition-theme'>
          <p className='text-sm text-secondary'>Current Email</p>
          <p className='mt-1 break-all font-medium text-primary'>
            {user?.email || '—'}
          </p>
        </div>

        <div className='rounded-xl border border-default bg-surface p-4 transition-theme'>
          <p className='text-sm text-secondary'>User ID</p>
          <p className='mt-1 truncate font-medium text-primary'>
            {user?.uid || '—'}
          </p>
        </div>
      </div>

      <div className='mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
        <button
          onClick={handleSignOut}
          className='w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 sm:w-auto'
        >
          Sign Out
        </button>

        <button
          className='w-full rounded-xl border border-default bg-surface px-5 py-3 text-sm font-medium text-primary transition-theme hover:bg-surface-hover sm:w-auto'
          onClick={() =>
            toast('Sign Out All Devices will be available in a future update.')
          }
        >
          Sign Out All Devices
        </button>
      </div>
    </div>
  </div>
</div>


);
}
