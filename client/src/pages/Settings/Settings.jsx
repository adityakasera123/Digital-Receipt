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

  // Modals state
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
            email: user.email || '',
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

  return (
    <div
      className="min-h-screen w-full flex flex-col p-2 sm:p-4 lg:p-8"
      style={{
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* 
        Mobile: w-full (stretches edge-to-edge as requested)
        Desktop: max-w-[900px] (compact, form-friendly, no rubber-banding)
      */}
      <div className="mx-auto w-full max-w-[900px] flex-grow">
        <div className="mb-4 sm:mb-6 px-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Settings</h1>
          <p className="mt-1 text-sm sm:text-base text-secondary">
            Manage your account, notifications, security, and data preferences.
          </p>
        </div>

        {/* Sidebar size fixed to 220px on desktop so main area stays nicely sized */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[220px_1fr] w-full">
          <aside
            className="rounded-2xl sm:rounded-3xl border p-2 sm:p-3 h-fit w-full"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <nav className="flex flex-col gap-1 w-full">
              {sections.map((section) => {
                const Icon = section.icon;
                const active = section.id === activeSection;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex w-full items-center gap-3 rounded-xl sm:rounded-2xl px-4 py-3 sm:py-3.5 text-sm font-medium transition ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-primary hover:bg-surface-hover'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="whitespace-nowrap">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <section
            className="w-full rounded-2xl sm:rounded-3xl border p-4 sm:p-6 lg:p-8"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            {activeSection === 'profile' && (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 aspect-square shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl sm:text-2xl font-bold text-white shadow-sm">
                    {initial}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-primary sm:text-2xl">
                      Profile
                    </h2>
                    <p className="text-sm text-secondary sm:text-base mt-1">
                      Update your personal information and account details.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-5 md:mt-8 md:grid-cols-2 w-full">
                  <div className="w-full">
                    <label className="mb-2 block text-sm font-medium text-primary">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full rounded-xl sm:rounded-2xl border border-default bg-surface px-4 py-3 sm:py-3.5 text-sm sm:text-base text-primary outline-none transition-theme focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div className="w-full">
                    <label className="mb-2 block text-sm font-medium text-primary">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full truncate rounded-xl sm:rounded-2xl border border-default bg-surface px-4 py-3 sm:py-3.5 text-sm sm:text-base text-primary outline-none transition-theme focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4 md:mt-8 md:grid-cols-2 w-full">
                  <div className="w-full rounded-xl sm:rounded-2xl border border-default bg-surface-secondary p-4 sm:p-5">
                    <p className="text-xs sm:text-sm text-secondary">Member Since</p>
                    <p className="mt-1.5 text-sm sm:text-base font-semibold text-primary">{memberSince}</p>
                  </div>

                  <div className="w-full rounded-xl sm:rounded-2xl border border-default bg-surface-secondary p-4 sm:p-5">
                    <p className="text-xs sm:text-sm text-secondary">Last Sign In</p>
                    <p className="mt-1.5 text-sm sm:text-base font-semibold text-primary">{lastSignIn}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full rounded-xl sm:rounded-2xl bg-blue-600 px-6 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto shadow-sm"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </>
            )}

            {activeSection === 'notifications' && (
              <>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-primary">Notifications</h2>
                  <p className="mt-1 text-sm sm:text-base text-secondary">
                    Control when Billvora reminds you about expiring warranties.
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5 w-full">
                  <label className="flex items-center justify-between gap-4 p-3 sm:p-2 sm:-mx-2 hover:bg-surface-secondary rounded-xl sm:rounded-2xl transition-colors">
                    <span className="font-medium text-primary text-sm sm:text-base">Warranty reminders</span>
                    <input
                      type="checkbox"
                      checked={notifications.enabled}
                      className="shrink-0 h-5 w-5 rounded border-gray-300"
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          enabled: e.target.checked,
                        })
                      }
                    />
                  </label>

                  <label className="flex items-center justify-between gap-4 p-3 sm:p-2 sm:-mx-2 hover:bg-surface-secondary rounded-xl sm:rounded-2xl transition-colors">
                    <span className="font-medium text-primary text-sm sm:text-base">In-app notifications</span>
                    <input
                      type="checkbox"
                      checked={notifications.inAppEnabled}
                      className="shrink-0 h-5 w-5 rounded border-gray-300"
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          inAppEnabled: e.target.checked,
                        })
                      }
                    />
                  </label>

                  <label className="flex items-center justify-between gap-4 p-3 sm:p-2 sm:-mx-2 hover:bg-surface-secondary rounded-xl sm:rounded-2xl transition-colors">
                    <span className="font-medium text-primary text-sm sm:text-base">Urgent popup reminders</span>
                    <input
                      type="checkbox"
                      checked={notifications.popupEnabled}
                      className="shrink-0 h-5 w-5 rounded border-gray-300"
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          popupEnabled: e.target.checked,
                        })
                      }
                    />
                  </label>

                  <div className="pt-2 sm:pt-4">
                    <p className="font-medium text-primary text-sm sm:text-base px-1">Reminder windows</p>

                    <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 w-full">
                      {[30, 15, 7, 3, 1, 0].map((day) => (
                        <label
                          key={day}
                          className="flex items-center gap-2 sm:gap-3 rounded-xl border border-default bg-surface-secondary p-3 sm:p-4 cursor-pointer hover:border-blue-500/50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={notifications.reminderDays.includes(day)}
                            className="h-4 w-4 rounded border-gray-300"
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
                          <span className="text-sm sm:text-base font-medium text-primary">
                            {day === 0 ? 'On expiry' : `${day} days`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:justify-end pt-4 sm:pt-6 border-t border-default">
                    <button
                      onClick={handleNotificationSave}
                      className="w-full rounded-xl sm:rounded-2xl bg-blue-600 px-6 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-white transition hover:bg-blue-700 sm:w-auto shadow-sm"
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
                  <h2 className="text-xl sm:text-2xl font-semibold text-primary">Appearance</h2>
                  <p className="mt-1 text-sm sm:text-base text-secondary">
                    Personalize how Billvora looks across your devices.
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 space-y-8 w-full">
                  <div className="w-full rounded-xl sm:rounded-2xl border border-default bg-surface-secondary p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-primary">Theme</h3>
                    <p className="mt-1 text-xs sm:text-sm text-secondary">
                      Choose between light, dark, or system appearance.
                    </p>

                    <div className="mt-5">
                      <ThemeSelector />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'data' && (
              <div className="space-y-4 sm:space-y-5 w-full">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-primary">
                    Data Management
                  </h2>
                  <p className="mt-1 text-sm sm:text-base text-secondary">
                    Export, back up, or permanently remove your Billvora data.
                  </p>
                </div>

                {/* Exports */}
                <div className="w-full rounded-xl sm:rounded-2xl border border-default bg-surface-secondary p-4 sm:p-5 transition-theme">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                    <div className="pr-4">
                      <p className="font-semibold text-primary text-sm sm:text-base">Export Receipts</p>
                      <p className="text-xs sm:text-sm text-secondary mt-1">
                        Download all your receipts as a JSON backup file.
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        const user = auth.currentUser;
                        if (!user) {
                          toast.error('User not found');
                          return;
                        }

                        try {
                          await exportReceipts(user.uid);
                          toast.success('Receipts exported successfully');
                        } catch (error) {
                          console.error(error);
                          toast.error('Failed to export receipts');
                        }
                      }}
                      className="w-full sm:w-auto shrink-0 rounded-xl bg-blue-600 px-6 py-3 sm:py-3.5 text-sm font-medium text-white transition hover:bg-blue-700 shadow-sm"
                    >
                      Export
                    </button>
                  </div>
                </div>

                <div className="w-full rounded-xl sm:rounded-2xl border border-default bg-surface-secondary p-4 sm:p-5 transition-theme">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                    <div className="pr-4">
                      <p className="font-semibold text-primary text-sm sm:text-base">Export Warranties</p>
                      <p className="text-xs sm:text-sm text-secondary mt-1">
                        Download all your warranties as a JSON backup file.
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        const user = auth.currentUser;
                        if (!user) {
                          toast.error('User not found');
                          return;
                        }

                        try {
                          await exportWarranties(user.uid);
                          toast.success('Warranties exported successfully');
                        } catch (error) {
                          console.error(error);
                          toast.error('Failed to export warranties');
                        }
                      }}
                      className="w-full sm:w-auto shrink-0 rounded-xl bg-blue-600 px-6 py-3 sm:py-3.5 text-sm font-medium text-white transition hover:bg-blue-700 shadow-sm"
                    >
                      Export
                    </button>
                  </div>
                </div>

                <div className="w-full rounded-xl sm:rounded-2xl border border-default bg-surface-secondary p-4 sm:p-5 transition-theme">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                    <div className="pr-4">
                      <p className="font-semibold text-primary text-sm sm:text-base">Export Notifications</p>
                      <p className="text-xs sm:text-sm text-secondary mt-1">
                        Download all your in-app notifications as a JSON backup file.
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        const user = auth.currentUser;
                        if (!user) {
                          toast.error('User not found');
                          return;
                        }

                        try {
                          await exportNotifications(user.uid);
                          toast.success('Notifications exported successfully');
                        } catch (error) {
                          console.error(error);
                          toast.error('Failed to export notifications');
                        }
                      }}
                      className="w-full sm:w-auto shrink-0 rounded-xl bg-blue-600 px-6 py-3 sm:py-3.5 text-sm font-medium text-white transition hover:bg-blue-700 shadow-sm"
                    >
                      Export
                    </button>
                  </div>
                </div>

                <div className="w-full rounded-xl sm:rounded-2xl border border-default bg-surface-secondary p-4 sm:p-5 transition-theme">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                    <div className="pr-4">
                      <p className="font-semibold text-primary text-sm sm:text-base">Download Complete Backup</p>
                      <p className="text-xs sm:text-sm text-secondary mt-1">
                        Download receipts, warranties, and notifications in a single file.
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        const user = auth.currentUser;
                        if (!user) {
                          toast.error('User not found');
                          return;
                        }

                        try {
                          await exportCompleteBackup(user.uid);
                          toast.success('Complete backup downloaded');
                        } catch (error) {
                          console.error(error);
                          toast.error('Failed to download backup');
                        }
                      }}
                      className="w-full sm:w-auto shrink-0 rounded-xl bg-blue-600 px-6 py-3 sm:py-3.5 text-sm font-medium text-white transition hover:bg-blue-700 shadow-sm"
                    >
                      Download Backup
                    </button>
                  </div>
                </div>

                {/* Deletions - Accurate and readable red colors */}
                <div className="w-full rounded-xl sm:rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5 transition-theme dark:border-red-500/30 dark:bg-red-500/10 mt-8">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                    <div className="pr-4">
                      <p className="font-semibold text-red-700 dark:text-red-400 text-sm sm:text-base">
                        Delete All Notifications
                      </p>
                      <p className="text-xs sm:text-sm text-red-600 dark:text-red-400/90 mt-1 font-medium">
                        Permanently remove all in-app notifications.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowDeleteNotificationsModal(true)}
                      className="w-full sm:w-auto shrink-0 rounded-xl bg-red-600 px-6 py-3 sm:py-3.5 text-sm font-semibold text-white transition hover:bg-red-700 shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="w-full rounded-xl sm:rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5 transition-theme dark:border-red-500/30 dark:bg-red-500/10">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                    <div className="pr-4">
                      <p className="font-semibold text-red-700 dark:text-red-400 text-sm sm:text-base">
                        Delete All Receipts
                      </p>
                      <p className="text-xs sm:text-sm text-red-600 dark:text-red-400/90 mt-1 font-medium">
                        Permanently delete all receipts and images.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowDeleteReceiptsModal(true)}
                      className="w-full sm:w-auto shrink-0 rounded-xl bg-red-600 px-6 py-3 sm:py-3.5 text-sm font-semibold text-white transition hover:bg-red-700 shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="w-full rounded-xl sm:rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5 transition-theme dark:border-red-500/30 dark:bg-red-500/10">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                    <div className="pr-4">
                      <p className="font-semibold text-red-700 dark:text-red-400 text-sm sm:text-base">
                        Delete All Warranties
                      </p>
                      <p className="text-xs sm:text-sm text-red-600 dark:text-red-400/90 mt-1 font-medium">
                        Permanently delete all tracked warranties.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowDeleteWarrantiesModal(true)}
                      className="w-full sm:w-auto shrink-0 rounded-xl bg-red-600 px-6 py-3 sm:py-3.5 text-sm font-semibold text-white transition hover:bg-red-700 shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="w-full rounded-xl sm:rounded-2xl border border-red-300 bg-red-50 p-4 sm:p-5 transition-theme dark:border-red-500/40 dark:bg-red-500/10">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                    <div className="pr-4">
                      <p className="font-semibold text-red-800 dark:text-red-400 text-sm sm:text-base">
                        Delete Account
                      </p>
                      <p className="text-xs sm:text-sm text-red-700 dark:text-red-400/90 mt-1 font-medium">
                        Permanently delete your entire Billvora account.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowDeleteAccountModal(true)}
                      className="w-full sm:w-auto shrink-0 rounded-xl bg-red-700 px-6 py-3 sm:py-3.5 text-sm font-semibold text-white transition hover:bg-red-800 shadow-sm"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>

                {showDeleteAccountModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-default bg-surface p-5 sm:p-6 shadow-2xl transition-theme">
                      <h3 className="text-xl sm:text-2xl font-bold text-primary">
                        Delete your account?
                      </h3>

                      <p className="mt-3 text-sm sm:text-base text-secondary">
                        This will permanently delete your Billvora account, receipts,
                        warranties, notifications, settings, and receipt images.
                        This action cannot be undone.
                      </p>

                      <div className="mt-6 sm:mt-8">
                        <label className="mb-2 block text-sm font-medium text-primary">
                          Enter your current password
                        </label>

                        <input
                          type="password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          placeholder="Current password"
                          className="w-full rounded-xl border border-default bg-surface px-4 py-3 sm:py-3.5 text-sm sm:text-base text-primary outline-none transition-theme focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>

                      <div className="mt-6 sm:mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                          onClick={() => {
                            setShowDeleteAccountModal(false);
                            setDeletePassword('');
                          }}
                          className="w-full sm:w-auto rounded-xl border border-default px-6 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-primary transition-theme hover:bg-surface-hover"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={handleDeleteAccount}
                          disabled={deletingAccount}
                          className="w-full sm:w-auto rounded-xl bg-red-600 px-6 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white transition hover:bg-red-700 disabled:opacity-60 shadow-sm"
                        >
                          {deletingAccount ? 'Deleting...' : 'Delete Account'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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
            )}

            {activeSection === 'about' && (
              <div className="space-y-4 sm:space-y-6 w-full">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-primary">About Billvora</h2>
                  <p className="mt-1 text-sm sm:text-base text-secondary">
                    Information about your current application version and terms.
                  </p>
                </div>

                <div className="w-full rounded-xl sm:rounded-2xl border border-default bg-surface-secondary p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center text-sm sm:text-base border-b border-default pb-3 sm:pb-4">
                    <span className="text-secondary font-medium">App Version</span>
                    <span className="font-semibold text-primary">v1.0.0</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base pt-1">
                    <span className="text-secondary font-medium">Environment</span>
                    <span className="font-semibold text-primary">Production</span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}