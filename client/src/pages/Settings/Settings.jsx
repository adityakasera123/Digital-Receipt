import { useEffect, useState } from 'react';
import ThemeSelector from '../../components/settings/ThemeSelector';

import {
User,
Bell,
Shield,
Database,
Palette,
Info,
} from 'lucide-react';
import { auth, db } from '../../firebase/firebase';
import { updateProfile } from 'firebase/auth';
import {
doc,
setDoc,
getDoc,
serverTimestamp,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import SecuritySection from '../../components/settings/SecuritySection';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import {
  exportReceipts,
  exportWarranties,
  exportNotifications,
  exportCompleteBackup,
  deleteAllNotifications,
  deleteAllReceipts,
  deleteAllWarranties,
  deleteAccount,
} from '../../utils/exportUtils';

const sections = [
{ id: 'profile', label: 'Profile', icon: User },
{ id: 'notifications', label: 'Notifications', icon: Bell },
{ id: 'security', label: 'Security', icon: Shield },
{ id: 'data', label: 'Data', icon: Database },
{ id: 'appearance', label: 'Appearance', icon: Palette },
{ id: 'about', label: 'About', icon: Info },
];

function formatDate(dateString) {
if (!dateString) return '—';

return new Date(dateString).toLocaleDateString('en-US', {
month: 'long',
year: 'numeric',
});
}

function formatDateTime(dateString) {
if (!dateString) return '—';

return new Date(dateString).toLocaleString('en-US', {
dateStyle: 'medium',
timeStyle: 'short',
});
}

export default function Settings() {
const [activeSection, setActiveSection] = useState('profile');
const navigate = useNavigate();

const [displayName, setDisplayName] = useState('');
const [email, setEmail] = useState('');
const [memberSince, setMemberSince] = useState('');
const [lastSignIn, setLastSignIn] = useState('');
const [saving, setSaving] = useState(false);
const [showDeleteNotificationsModal, setShowDeleteNotificationsModal] = useState(false);
const [showDeleteReceiptsModal, setShowDeleteReceiptsModal] = useState(false);

const [showDeleteWarrantiesModal, setShowDeleteWarrantiesModal] = useState(false);
const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

const [deletePassword, setDeletePassword] = useState('');
const [deletingAccount, setDeletingAccount] = useState(false);

const [notifications, setNotifications] = useState({
enabled: true,
inAppEnabled: true,
popupEnabled: true,
reminderDays: [30, 15, 7, 3, 1, 0],
});

useEffect(() => {
const user = auth.currentUser;
if (!user) return;


setDisplayName(user.displayName || '');
setEmail(user.email || '');
setMemberSince(formatDate(user.metadata.creationTime));
setLastSignIn(formatDateTime(user.metadata.lastSignInTime));

const loadNotificationSettings = async () => {
  try {
    const settingsRef = doc(
      db,
      'users',
      user.uid,
      'settings',
      'notifications'
    );

    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists()) {
      setNotifications((prev) => ({
        ...prev,
        ...settingsSnap.data(),
      }));
    }
  } catch (error) {
    console.error(error);
  }
};

loadNotificationSettings();


}, []);

const handleSave = async () => {
const user = auth.currentUser;


if (!user) {
  toast.error('User not found');
  return;
}

const name = displayName.trim();

if (!name) {
  toast.error('Display name is required');
  return;
}

try {
  setSaving(true);

  await updateProfile(user, {
    displayName: name,
  });

  await setDoc(
    doc(db, 'users', user.uid),
    {
      profile: {
        displayName: name,
        email: user.email,
        updatedAt: serverTimestamp(),
      },
    },
    { merge: true }
  );

  toast.success('Profile updated successfully');
} catch (error) {
  console.error(error);
  toast.error('Failed to update profile');
} finally {
  setSaving(false);
}


};

const handleNotificationSave = async () => {
const user = auth.currentUser;


if (!user) {
  toast.error('User not found');
  return;
}

try {
  await setDoc(
    doc(db, 'users', user.uid, 'settings', 'notifications'),
    {
      ...notifications,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  toast.success('Notification preferences saved');
} catch (error) {
  console.error(error);
  toast.error('Failed to save notification settings');
}


};

const handleDeleteAllNotifications = async () => {
  const user = auth.currentUser;

  if (!user) {
    toast.error('User not found');
    return;
  }

  try {
    const deletedCount = await deleteAllNotifications(user.uid);

    toast.success(
      deletedCount === 0
        ? 'No notifications to delete'
        : `${deletedCount} notification${deletedCount === 1 ? '' : 's'} deleted`
    );

    setShowDeleteNotificationsModal(false);
  } catch (error) {
    console.error(error);
    toast.error('Failed to delete notifications');
  }
};


const handleDeleteAllReceipts = async () => {
  const user = auth.currentUser;

  if (!user) {
    toast.error('User not found');
    return;
  }

  try {
    const deletedCount = await deleteAllReceipts(user.uid);

    toast.success(
      deletedCount === 0
        ? 'No receipts to delete'
        : `${deletedCount} receipt${deletedCount === 1 ? '' : 's'} deleted`
    );

    setShowDeleteReceiptsModal(false);
  } catch (error) {
    console.error(error);
    toast.error('Failed to delete receipts');
  }
};

const handleDeleteAllWarranties = async () => {
  const user = auth.currentUser;

  if (!user) {
    toast.error('User not found');
    return;
  }

  try {
    const deletedCount = await deleteAllWarranties(user.uid);

    toast.success(
      deletedCount === 0
        ? 'No warranties to delete'
        : `${deletedCount} warrant${deletedCount === 1 ? 'y' : 'ies'} deleted`
    );

    setShowDeleteWarrantiesModal(false);
  } catch (error) {
    console.error(error);
    toast.error('Failed to delete warranties');
  }
};


const handleDeleteAccount = async () => {
  const user = auth.currentUser;

  if (!user) {
    toast.error('User not found');
    return;
  }

  if (!deletePassword) {
    toast.error('Please enter your current password');
    return;
  }

  try {
    setDeletingAccount(true);

    const credential = EmailAuthProvider.credential(
      user.email,
      deletePassword
    );

    await reauthenticateWithCredential(user, credential);

    await deleteAccount(user);

    toast.success('Account deleted successfully');

    setShowDeleteAccountModal(false);
    setDeletePassword('');

    navigate('/');
  } catch (error) {
    console.error(error);

    switch (error.code) {
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        toast.error('Current password is incorrect');
        break;

      case 'auth/requires-recent-login':
        toast.error('Please log in again before deleting your account');
        break;

      default:
        toast.error('Failed to delete account');
    }
  } finally {
    setDeletingAccount(false);
  }
};
const initial = (displayName || email || 'A').charAt(0).toUpperCase();

return ( <div
  className="min-h-screen p-6"
  style={{
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
  }}
> <div className="mx-auto max-w-7xl"> <div className="mb-6"> <h1 className="text-3xl font-bold text-gray-900">Settings</h1> <p className="mt-1 text-gray-500">
Manage your account, notifications, security, and data preferences. </p> </div>


    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
      <aside
  className="rounded-3xl border p-3"
  style={{
    background: 'var(--bg-secondary)',
    borderColor: 'var(--border-color)',
    color: 'var(--text-primary)',
  }}
>
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const active = section.id === activeSection;

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                {section.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <section
  className="rounded-3xl border p-8"
  style={{
    background: 'var(--bg-secondary)',
    borderColor: 'var(--border-color)',
    color: 'var(--text-primary)',
  }}
>
        {activeSection === 'profile' && (
          <>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-xl font-semibold text-white">
                {initial}
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Profile</h2>
                <p className="text-gray-500">
                  Update your personal information and account details.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500 outline-none"
                />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="mt-1 font-semibold text-gray-900">{memberSince}</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Last Sign In</p>
                <p className="mt-1 font-semibold text-gray-900">{lastSignIn}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        )}

        {activeSection === 'notifications' && (
          <>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Notifications</h2>
              <p className="mt-1 text-gray-500">
                Control when Billvora reminds you about expiring warranties.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <label className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Warranty reminders</span>
                <input
                  type="checkbox"
                  checked={notifications.enabled}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      enabled: e.target.checked,
                    })
                  }
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="font-medium text-gray-900">In-app notifications</span>
                <input
                  type="checkbox"
                  checked={notifications.inAppEnabled}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      inAppEnabled: e.target.checked,
                    })
                  }
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Urgent popup reminders</span>
                <input
                  type="checkbox"
                  checked={notifications.popupEnabled}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      popupEnabled: e.target.checked,
                    })
                  }
                />
              </label>

              <div>
                <p className="font-medium text-gray-900">Reminder windows</p>

                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {[30, 15, 7, 3, 1, 0].map((day) => (
                    <label
                      key={day}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3"
                    >
                      <input
                        type="checkbox"
                        checked={notifications.reminderDays.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNotifications({
                              ...notifications,
                              reminderDays: [
                                ...notifications.reminderDays,
                                day,
                              ].sort((a, b) => b - a),
                            });
                          } else {
                            setNotifications({
                              ...notifications,
                              reminderDays:
                                notifications.reminderDays.filter(
                                  (d) => d !== day
                                ),
                            });
                          }
                        }}
                      />

                      <span className="text-sm text-gray-700">
                        {day === 0 ? 'On expiry day' : `${day} days`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNotificationSave}
                  className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </>
        )}
        {activeSection === 'security' && <SecuritySection />}
        {activeSection === 'appearance' && (
  <>
    <div>
      <h2 className='text-2xl font-semibold text-gray-900'>Appearance</h2>
      <p className='mt-1 text-gray-500'>
        Personalize how Billvora looks across your devices.
      </p>
    </div>

    <div className='mt-8 space-y-8'>
      <div>
        <h3 className='text-lg font-semibold text-gray-900'>Theme</h3>
        <p className='mt-1 text-sm text-gray-500'>
          Choose between light, dark, or system appearance.
        </p>

        <div className='mt-4'>
          <ThemeSelector />
        </div>
      </div>
    </div>
  </>
)}
        {activeSection === 'data' && (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">
        Data Management
      </h2>
      <p className="mt-1 text-gray-500">
        Export, back up, or permanently remove your Billvora data.
      </p>
    </div>

    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">Export Receipts</p>
          <p className="text-sm text-gray-500">
            Download all your receipts as a JSON backup file.
          </p>
        </div>

        <button
          onClick={async () => {
            const user = auth.currentUser;
            if (!user) {
              toast.error("User not found");
              return;
            }

            try {
              await exportReceipts(user.uid);
              toast.success("Receipts exported successfully");
            } catch (error) {
              console.error(error);
              toast.error("Failed to export receipts");
            }
          }}
          className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black"
        >
          Export
        </button>
      </div>
    </div>
    
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Export Warranties</p>
            <p className="text-sm text-gray-500">
              Download all your warranties as a JSON backup file.
            </p>
          </div>

          <button
            onClick={async () => {
              const user = auth.currentUser;
              if (!user) {
                toast.error("User not found");
                return;
              }

              try {
                await exportWarranties(user.uid);
                toast.success("Warranties exported successfully");
              } catch (error) {
                console.error(error);
                toast.error("Failed to export warranties");
              }
            }}
            className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black"
          >
            Export
          </button>
        </div>
      </div>


            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Export Notifications</p>
            <p className="text-sm text-gray-500">
              Download all your in-app notifications as a JSON backup file.
            </p>
          </div>

          <button
            onClick={async () => {
              const user = auth.currentUser;
              if (!user) {
                toast.error("User not found");
                return;
              }

              try {
                await exportNotifications(user.uid);
                toast.success("Notifications exported successfully");
              } catch (error) {
                console.error(error);
                toast.error("Failed to export notifications");
              }
            }}
            className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black"
          >
            Export
          </button>
        </div>
      </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Download Complete Backup</p>
            <p className="text-sm text-gray-500">
              Download receipts, warranties, and notifications in a single backup file.
            </p>
          </div>

          <button
            onClick={async () => {
              const user = auth.currentUser;
              if (!user) {
                toast.error("User not found");
                return;
              }

              try {
                await exportCompleteBackup(user.uid);
                toast.success("Complete backup downloaded");
              } catch (error) {
                console.error(error);
                toast.error("Failed to download backup");
              }
            }}
            className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black"
          >
            Download Backup
          </button>
        </div>
      </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-red-700">Delete All Notifications</p>
            <p className="text-sm text-red-600">
              Permanently remove all in-app notifications from your account.
            </p>
          </div>

          <button
            onClick={() => setShowDeleteNotificationsModal(true)}
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-red-700">Delete All Receipts</p>
            <p className="text-sm text-red-600">
              Permanently remove all receipts, receipt images, and linked warranties from your account.
            </p>
          </div>

          <button
            onClick={() => setShowDeleteReceiptsModal(true)}
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-red-700">Delete All Warranties</p>
            <p className="text-sm text-red-600">
              Permanently remove all warranties from your account.
            </p>
          </div>

          <button
            onClick={() => setShowDeleteWarrantiesModal(true)}
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

  <div className="rounded-2xl border border-red-300 bg-red-50 p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-red-700">Delete Account</p>
        <p className="text-sm text-red-600">
          Permanently delete your Billvora account and all associated data.
        </p>
      </div>

      <button
        onClick={() => setShowDeleteAccountModal(true)}
        className="rounded-xl bg-red-700 px-5 py-3 text-sm font-medium text-white hover:bg-red-800"
      >
        Delete Account
      </button>
    </div>
  </div>

  {showDeleteAccountModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-900">
          Delete your account?
        </h3>

        <p className="mt-3 text-gray-600">
          This will permanently delete your Billvora account, receipts,
          warranties, notifications, settings, and receipt images.
          This action cannot be undone.
        </p>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Enter your current password
          </label>

          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Current password"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-400"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowDeleteAccountModal(false);
              setDeletePassword('');
            }}
            className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDeleteAccount}
            disabled={deletingAccount}
            className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {deletingAccount ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  )}


  </div>
)}
      </section>
    </div>
  </div>
        <ConfirmModal
        isOpen={showDeleteNotificationsModal}
        onClose={() => setShowDeleteNotificationsModal(false)}
        onConfirm={handleDeleteAllNotifications}
        title="Delete all notifications?"
        message="This will permanently delete all in-app notifications from your account. This action cannot be undone."
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
      />

            <ConfirmModal
        isOpen={showDeleteReceiptsModal}
        onClose={() => setShowDeleteReceiptsModal(false)}
        onConfirm={handleDeleteAllReceipts}
        title="Delete all receipts?"
        message="This will permanently delete all receipts, receipt images, and any linked warranties from your account. This action cannot be undone."
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
      />

            <ConfirmModal
        isOpen={showDeleteWarrantiesModal}
        onClose={() => setShowDeleteWarrantiesModal(false)}
        onConfirm={handleDeleteAllWarranties}
        title="Delete all warranties?"
        message="This will permanently delete all warranties from your account. This action cannot be undone."
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
      />
          
</div>


);
}
