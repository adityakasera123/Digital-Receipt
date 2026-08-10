import {
  Rocket,
  Receipt,
  ShieldCheck,
  Bell,
  Database,
  LockKeyhole,
} from 'lucide-react';

export const helpCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description:
      'Learn the basics of Billvora and set up your personal purchase vault.',
    icon: Rocket,
  },

  {
    id: 'receipts',
    title: 'Managing Receipts',
    description:
      'Learn how to upload, view, edit, search, and manage your receipts.',
    icon: Receipt,
  },

  {
    id: 'warranties',
    title: 'Managing Warranties',
    description:
      'Track warranties and understand warranty periods and reminders.',
    icon: ShieldCheck,
  },

  {
    id: 'notifications',
    title: 'Notifications',
    description:
      'Understand warranty reminders, alerts, snoozing, and notification controls.',
    icon: Bell,
  },

  {
    id: 'data',
    title: 'Data & Backup',
    description:
      'Learn how to export, back up, and manage your Billvora data.',
    icon: Database,
  },

  {
    id: 'security',
    title: 'Account & Security',
    description:
      'Manage your profile, password, verification, and account security.',
    icon: LockKeyhole,
  },
];

export const helpArticles = {
  'getting-started': [
    {
      id: 'welcome-to-billvora',
      title: 'Welcome to Billvora',
      description:
        'Understand what Billvora is and how your personal purchase vault works.',
    },
    {
      id: 'understanding-dashboard',
      title: 'Understanding the Dashboard',
      description:
        'Learn about receipts, warranties, spending, and important information on your dashboard.',
    },
    {
      id: 'first-receipt',
      title: 'Adding Your First Receipt',
      description:
        'Learn how to add your first purchase receipt to Billvora.',
    },
  ],

  receipts: [
    {
      id: 'upload-receipt',
      title: 'How to Upload a Receipt',
      description:
        'Learn how to securely upload and save a receipt in Billvora.',
    },
    {
      id: 'edit-receipt',
      title: 'How to Edit a Receipt',
      description:
        'Update receipt information such as store, amount, category, and purchase date.',
    },
    {
      id: 'search-receipts',
      title: 'How to Search Receipts',
      description:
        'Find receipts quickly using search, categories, and sorting.',
    },
    {
      id: 'preview-receipt',
      title: 'How to Preview a Receipt',
      description:
        'View your stored receipt image and purchase information.',
    },
    {
      id: 'delete-receipt',
      title: 'How to Delete a Receipt',
      description:
        'Understand what happens when you permanently delete a receipt.',
    },
  ],

  warranties: [
    {
      id: 'manage-warranties',
      title: 'Managing Your Warranties',
      description:
        'Learn how to view and manage warranties connected to your purchases.',
    },
    {
      id: 'warranty-reminders',
      title: 'Understanding Warranty Reminders',
      description:
        'Learn when Billvora sends reminders before a warranty expires.',
    },
    {
      id: 'warranty-status',
      title: 'Understanding Warranty Status',
      description:
        'Learn how active, expiring, and expired warranties are handled.',
    },
  ],

  notifications: [
    {
      id: 'notification-system',
      title: 'How Notifications Work',
      description:
        'Understand how Billvora keeps you informed about important warranty events.',
    },
    {
      id: 'reminder-windows',
      title: 'Warranty Reminder Windows',
      description:
        'Learn about the 30, 15, 7, 3, 1 day, and expiry-day reminders.',
    },
    {
      id: 'manage-notifications',
      title: 'Managing Notifications',
      description:
        'Learn how to read, snooze, delete, and manage notifications.',
    },
  ],

  data: [
    {
      id: 'export-data',
      title: 'Exporting Your Data',
      description:
        'Learn how to export receipts, warranties, and notifications.',
    },
    {
      id: 'complete-backup',
      title: 'Downloading a Complete Backup',
      description:
        'Understand how Billvora creates a complete backup of your stored data.',
    },
    {
      id: 'delete-data',
      title: 'Deleting Your Data',
      description:
        'Understand the consequences of permanently deleting your Billvora data.',
    },
  ],

  security: [
    {
      id: 'profile-settings',
      title: 'Managing Your Profile',
      description:
        'Learn how to update your display name and manage your profile information.',
    },
    {
      id: 'change-password',
      title: 'Changing Your Password',
      description:
        'Learn how to securely change your account password.',
    },
    {
      id: 'email-verification',
      title: 'Email Verification',
      description:
        'Understand email verification and how to resend the verification email.',
    },
    {
      id: 'delete-account',
      title: 'Deleting Your Account',
      description:
        'Understand what happens when you permanently delete your Billvora account.',
    },
  ],
};
export const helpArticleContent = {
  'upload-receipt': {
    title: 'How to Upload a Receipt',
    intro:
      'Learn how to securely add a purchase receipt to your Billvora vault.',

    sections: [
      {
        title: 'Overview',
        content:
          'Billvora lets you store your purchase information and receipt image together in one secure place. You can manually enter the purchase details and upload the receipt image.',
      },
      {
        title: 'How to upload a receipt',
        steps: [
          'Open the Upload Receipt page from the sidebar.',
          'Enter the store name.',
          'Select the appropriate purchase category.',
          'Enter the purchase amount.',
          'Select the purchase date.',
          'Choose the payment method.',
          'Upload the receipt image.',
          'If the purchase has a warranty, enter the warranty details.',
          'Submit the receipt to save it to your Billvora vault.',
        ],
      },
      {
        title: 'What happens after upload?',
        content:
          'After a successful upload, Billvora stores your receipt information in your account and securely stores the receipt image. You can then view, edit, search, and manage the receipt from the Receipts section.',
      },
    ],
  },

  'edit-receipt': {
    title: 'How to Edit a Receipt',
    intro:
      'Update your receipt information whenever you need to correct or change purchase details.',

    sections: [
      {
        title: 'How to edit',
        steps: [
          'Open the Receipts page.',
          'Select the receipt you want to update.',
          'Open the edit option.',
          'Update the required purchase information.',
          'Review the updated details.',
          'Save your changes.',
        ],
      },
      {
        title: 'What can you update?',
        content:
          'Depending on the receipt, you can update information such as store name, category, amount, purchase date, payment method, and other stored purchase details.',
      },
    ],
  },

  'search-receipts': {
    title: 'How to Search Receipts',
    intro:
      'Find your stored receipts quickly using Billvora search and filtering tools.',

    sections: [
      {
        title: 'How to search',
        steps: [
          'Open the Search page or use the search field in the dashboard topbar.',
          'Enter a keyword related to the receipt you want to find.',
          'Review the matching receipts.',
          'Use category filters when you need more specific results.',
          'Use sorting options to organize the results.',
          'Select a receipt to open its detail page.',
        ],
      },
      {
        title: 'Search tips',
        content:
          'Try searching using a store name, product name, or another relevant receipt detail. Filters and sorting can help narrow down larger collections.',
      },
    ],
  },

  'preview-receipt': {
    title: 'How to Preview a Receipt',
    intro:
      'View the stored receipt image and purchase information from the receipt detail page.',

    sections: [
      {
        title: 'How to preview',
        steps: [
          'Open the Receipts page.',
          'Select the receipt you want to view.',
          'Open the receipt detail page.',
          'Use the receipt preview to view the stored receipt image.',
          'Review the purchase information shown with the receipt.',
        ],
      },
    ],
  },

  'delete-receipt': {
    title: 'How to Delete a Receipt',
    intro:
      'Learn what happens when you permanently remove a receipt from Billvora.',

    sections: [
      {
        title: 'Before deleting',
        content:
          'Receipt deletion is permanent. Make sure you no longer need the receipt before confirming the deletion.',
      },
      {
        title: 'How to delete',
        steps: [
          'Open the Receipts page.',
          'Select the receipt you want to delete.',
          'Choose the delete option.',
          'Review the confirmation message.',
          'Confirm the deletion.',
        ],
      },
      {
        title: 'What gets deleted?',
        content:
          'Billvora removes the receipt document, the associated receipt image, and linked warranty documents associated with that receipt.',
      },
    ],
  },

  'welcome-to-billvora': {
    title: 'Welcome to Billvora',
    intro:
      'Billvora is your personal purchase management vault for receipts, warranties, notifications, and purchase information.',

    sections: [
      {
        title: 'What is Billvora?',
        content:
          'Billvora helps you keep your digital receipts and purchase information organized in one place. Instead of keeping purchase records scattered across emails, galleries, or paper receipts, you can manage them from your personal vault.',
      },
      {
        title: 'What can you do?',
        steps: [
          'Store digital receipts.',
          'Track purchase information.',
          'Manage warranties.',
          'Receive warranty reminders.',
          'Search your purchase history.',
          'View expense information and analytics.',
          'Export and back up your data.',
        ],
      },
    ],
  },

  'understanding-dashboard': {
    title: 'Understanding the Dashboard',
    intro:
      'The Billvora dashboard gives you a quick overview of your purchase information.',

    sections: [
      {
        title: 'Dashboard overview',
        content:
          'The dashboard provides an overview of your receipts, active warranties, spending, saved documents, recent purchases, and warranty alerts.',
      },
      {
        title: 'Quick actions',
        content:
          'Use the sidebar to move between receipts, uploads, warranties, analytics, search, settings, and the Help Center.',
      },
    ],
  },

  'first-receipt': {
    title: 'Adding Your First Receipt',
    intro:
      'Follow these steps to add your first purchase record to Billvora.',

    sections: [
      {
        title: 'Steps',
        steps: [
          'Open Upload Receipt.',
          'Enter your purchase information.',
          'Upload the receipt image.',
          'Add warranty information if applicable.',
          'Review the information.',
          'Save the receipt.',
        ],
      },
    ],
  },

  'manage-warranties': {
    title: 'Managing Your Warranties',
    intro:
      'Billvora helps you keep track of warranties connected to your purchases.',

    sections: [
      {
        title: 'What you can do',
        steps: [
          'View active warranties.',
          'Open warranty details.',
          'Edit warranty information.',
          'Delete warranties when they are no longer needed.',
          'Monitor upcoming warranty expirations.',
        ],
      },
    ],
  },

  'warranty-reminders': {
    title: 'Understanding Warranty Reminders',
    intro:
      'Billvora can remind you before a warranty reaches its expiry date.',

    sections: [
      {
        title: 'Reminder windows',
        content:
          'Available reminder windows include 30 days, 15 days, 7 days, 3 days, 1 day, and the expiry day.',
      },
      {
        title: 'Managing reminders',
        content:
          'You can control warranty reminder preferences from Settings → Notifications.',
      },
    ],
  },

  'warranty-status': {
    title: 'Understanding Warranty Status',
    intro:
      'Warranty status helps you understand which warranties are currently active or approaching expiration.',

    sections: [
      {
        title: 'Status information',
        content:
          'Use the Warranty dashboard and warranty details to review the current state and expiry information of your tracked warranties.',
      },
    ],
  },

  'notification-system': {
    title: 'How Notifications Work',
    intro:
      'Billvora notifications help keep you informed about important warranty events.',

    sections: [
      {
        title: 'Notification features',
        steps: [
          'Receive warranty-related notifications.',
          'View unread notifications from the notification bell.',
          'Open the Notifications page for your notification history.',
          'Mark notifications as read.',
          'Snooze notifications when needed.',
          'Delete notifications you no longer need.',
        ],
      },
    ],
  },

  'reminder-windows': {
    title: 'Warranty Reminder Windows',
    intro:
      'Choose when Billvora should remind you about an upcoming warranty expiry.',

    sections: [
      {
        title: 'Available reminders',
        steps: [
          '30 days before expiry.',
          '15 days before expiry.',
          '7 days before expiry.',
          '3 days before expiry.',
          '1 day before expiry.',
          'On the expiry day.',
        ],
      },
    ],
  },

  'manage-notifications': {
    title: 'Managing Notifications',
    intro:
      'Manage your Billvora notifications from the notification interface and Settings.',

    sections: [
      {
        title: 'Available actions',
        steps: [
          'Open a notification.',
          'Mark a notification as read.',
          'Mark all notifications as read.',
          'Snooze a notification.',
          'Delete a notification.',
          'Configure notification preferences in Settings.',
        ],
      },
    ],
  },

  'export-data': {
    title: 'Exporting Your Data',
    intro:
      'Billvora lets you export your stored information from Data Management.',

    sections: [
      {
        title: 'Available exports',
        steps: [
          'Export Receipts.',
          'Export Warranties.',
          'Export Notifications.',
          'Download a Complete Backup.',
        ],
      },
    ],
  },

  'complete-backup': {
    title: 'Downloading a Complete Backup',
    intro:
      'A complete backup lets you download your important Billvora data together.',

    sections: [
      {
        title: 'How to create a backup',
        steps: [
          'Open Settings.',
          'Open Data Management.',
          'Find Download Complete Backup.',
          'Select Download Backup.',
          'Save the generated backup file.',
        ],
      },
    ],
  },

  'delete-data': {
    title: 'Deleting Your Data',
    intro:
      'Billvora provides separate controls for permanently deleting stored data.',

    sections: [
      {
        title: 'Available deletion options',
        content:
          'Data Management provides controls for deleting notifications, receipts, warranties, and your complete account.',
      },
      {
        title: 'Important',
        content:
          'Permanent deletion cannot be undone. Review the confirmation message carefully before confirming a deletion.',
      },
    ],
  },

  'profile-settings': {
    title: 'Managing Your Profile',
    intro:
      'Update your Billvora display name and manage your account profile information.',

    sections: [
      {
        title: 'How to update your name',
        steps: [
          'Open Settings.',
          'Open the Profile section.',
          'Update your Display Name.',
          'Select Save Changes.',
          'Your updated name will appear across the application after the account state refreshes.',
        ],
      },
    ],
  },

  'change-password': {
    title: 'Changing Your Password',
    intro:
      'Update your account password from the Security section in Settings.',

    sections: [
      {
        title: 'How to change your password',
        steps: [
          'Open Settings.',
          'Open Security.',
          'Enter your current password.',
          'Enter your new password.',
          'Confirm your new password.',
          'Submit the password change.',
        ],
      },
    ],
  },

  'email-verification': {
    title: 'Email Verification',
    intro:
      'Email verification helps confirm ownership of your Billvora account email address.',

    sections: [
      {
        title: 'How to verify',
        steps: [
          'Open Settings.',
          'Open Security.',
          'Check your email verification status.',
          'If needed, select Re-send verification email.',
          'Open the verification email and follow the provided instructions.',
        ],
      },
    ],
  },

  'delete-account': {
    title: 'Deleting Your Account',
    intro:
      'Account deletion permanently removes your Billvora account and associated data.',

    sections: [
      {
        title: 'Before deleting',
        content:
          'Account deletion is permanent. Export any important data you want to keep before continuing.',
      },
      {
        title: 'How to delete',
        steps: [
          'Open Settings.',
          'Open Data Management.',
          'Select Delete Account.',
          'Enter your current password.',
          'Complete the re-authentication step.',
          'Confirm account deletion.',
        ],
      },
    ],
  },
};