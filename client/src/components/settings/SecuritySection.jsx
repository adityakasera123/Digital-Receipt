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

return ( <div className="space-y-8"> <div> <h2 className="text-2xl font-semibold text-gray-900">Security</h2> <p className="mt-1 text-gray-500">
Manage your password, verification, and account sessions. </p> </div>

  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-900">Email verification</p>
        <p className="text-sm text-gray-500">
          {user?.emailVerified
            ? 'Your email address is verified.'
            : 'Verify your email to secure your account.'}
        </p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          user?.emailVerified
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}
      >
        {user?.emailVerified ? 'Verified' : 'Not verified'}
      </span>
    </div>

    {!user?.emailVerified && (
      <button
        onClick={handleResendVerification}
        className="mt-4 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        Re-send verification email
      </button>
    )}
  </div>

  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
    <p className="font-medium text-gray-900">Change password</p>
    <p className="mt-1 text-sm text-gray-500">
      Update your account password.
    </p>

    <div className="mt-4 space-y-3">
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Current password"
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-gray-400"
      />

      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New password"
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-gray-400"
      />

      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-gray-400"
      />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Forgot password?
        </button>

        <button
          onClick={handleChangePassword}
          disabled={saving}
          className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  </div>

  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
    <p className="font-medium text-gray-900">Session information</p>
    <p className="mt-1 text-sm text-gray-500">
      Current session information for this device.
    </p>

    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">Current Email</p>
        <p className="mt-1 font-medium text-gray-900">
          {user?.email || '—'}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">User ID</p>
        <p className="mt-1 truncate font-medium text-gray-900">
          {user?.uid || '—'}
        </p>
      </div>
    </div>
  </div>

  <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
    <p className="font-medium text-red-700">Sign out</p>
    <p className="mt-1 text-sm text-red-600">
      Sign out from this device.
    </p>

    <div className="mt-4 flex flex-wrap gap-3">
      <button
        onClick={handleSignOut}
        className="rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700"
      >
        Sign Out
      </button>

      <button
        className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
        onClick={() =>
          toast('Sign Out All Devices will be available in a future update.')
        }
      >
        Sign Out All Devices
      </button>
    </div>
  </div>
</div>


);
}
