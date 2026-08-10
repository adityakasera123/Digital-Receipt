import {
  ArrowLeft,
  Check,
  Copy,
  Mail,
  Search,
  X,
} from 'lucide-react';
import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import HelpCategoryCard from '../../components/help/HelpCategoryCard';
import { helpArticles, helpCategories } from '../../constants/helpContent';
import { AuthContext } from '../../context/AuthContext';

function HelpCenter() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState('');

  const [showContactModal, setShowContactModal] = useState(false);
  const [issueType, setIssueType] = useState('General');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCategoryClick = (categoryId) => {
    navigate(`/help-center/${categoryId}`);
  };

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    const results = [];

    helpCategories.forEach((category) => {
      const articles = helpArticles[category.id] || [];

      articles.forEach((article) => {
        const title = article.title.toLowerCase();
        const description = article.description.toLowerCase();
        const categoryTitle = category.title.toLowerCase();

        if (
          title.includes(query) ||
          description.includes(query) ||
          categoryTitle.includes(query)
        ) {
          results.push({
            ...article,
            categoryId: category.id,
            categoryTitle: category.title,
          });
        }
      });
    });

    return results;
  }, [searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  const resetContactForm = () => {
    setIssueType('General');
    setSubject('');
    setMessage('');
    setCopied(false);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    resetContactForm();
  };

  const handleCopySupportRequest = async () => {
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject) {
      toast.error('Please enter a subject');
      return;
    }

    if (!trimmedMessage) {
      toast.error('Please describe your issue');
      return;
    }

    const supportRequest = `Billvora Support Request

Issue Type: ${issueType}
Subject: ${trimmedSubject}

User Email:
${user?.email || 'Not available'}

Message:
${trimmedMessage}`;

    try {
      await navigator.clipboard.writeText(supportRequest);

      setCopied(true);

      toast.success('Support request copied');

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (error) {
      console.error(error);
      toast.error('Unable to copy support request');
    }
  };

  return (
    <div
      className='min-h-screen p-6'
      style={{
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      <div className='mx-auto max-w-6xl'>

        {/* Back Navigation */}
        <button
          type='button'
          onClick={() => navigate('/dashboard')}
          className='mb-6 flex items-center gap-2 text-sm font-medium text-secondary transition hover:text-primary'
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className='mb-8'>
          <p className='text-sm font-semibold text-secondary'>
            Support
          </p>

          <h1 className='mt-2 text-3xl font-bold text-primary'>
            Help Center
          </h1>

          <p className='mt-2 max-w-2xl text-secondary'>
            Find answers and learn how to get the most out of
            your Billvora personal purchase vault.
          </p>
        </div>

        {/* Search */}
        <div className='mb-10 max-w-3xl'>
          <div className='flex items-center gap-3 rounded-2xl border border-default bg-surface px-4 py-3 transition-theme focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10'>
            <Search
              size={20}
              className='shrink-0 text-secondary'
            />

            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search help articles...'
              className='w-full bg-transparent text-sm text-primary outline-none placeholder:text-secondary'
            />

            {searchQuery && (
              <button
                type='button'
                onClick={() => setSearchQuery('')}
                className='rounded-lg p-1 text-secondary transition hover:bg-surface-hover hover:text-primary'
                aria-label='Clear search'
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {isSearching ? (
          <div>
            <div className='mb-5'>
              <h2 className='text-xl font-semibold text-primary'>
                Search Results
              </h2>

              <p className='mt-1 text-sm text-secondary'>
                {searchResults.length}{' '}
                {searchResults.length === 1 ? 'article' : 'articles'} found
              </p>
            </div>

            {searchResults.length > 0 ? (
              <div className='space-y-3'>
                {searchResults.map((article) => (
                  <button
                    key={`${article.categoryId}-${article.id}`}
                    type='button'
                    onClick={() =>
                      navigate(
                        `/help-center/${article.categoryId}/${article.id}`
                      )
                    }
                    className='group flex w-full items-start gap-4 rounded-2xl border border-default bg-surface p-5 text-left transition-theme hover:bg-surface-hover'
                  >
                    <div className='min-w-0 flex-1'>
                      <p className='text-xs font-medium text-secondary'>
                        {article.categoryTitle}
                      </p>

                      <h3 className='mt-1 font-semibold text-primary'>
                        {article.title}
                      </h3>

                      <p className='mt-1 text-sm leading-6 text-secondary'>
                        {article.description}
                      </p>
                    </div>

                    <span className='shrink-0 text-lg text-secondary transition-transform group-hover:translate-x-1'>
                      →
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className='rounded-3xl border border-default bg-surface p-10 text-center transition-theme'>
                <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-secondary'>
                  <Search
                    size={22}
                    className='text-secondary'
                  />
                </div>

                <h3 className='mt-4 text-lg font-semibold text-primary'>
                  No articles found
                </h3>

                <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-secondary'>
                  We couldn't find any help articles matching "
                  {searchQuery}". Try searching for something like
                  receipts, warranty, notifications, or password.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Categories */
          <div>
            <div className='mb-5'>
              <h2 className='text-xl font-semibold text-primary'>
                Browse Help Topics
              </h2>

              <p className='mt-1 text-sm text-secondary'>
                Choose a topic to find useful guides and answers.
              </p>
            </div>

            <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
              {helpCategories.map((category) => (
                <HelpCategoryCard
                  key={category.id}
                  icon={category.icon}
                  title={category.title}
                  description={category.description}
                  onClick={() => handleCategoryClick(category.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Contact Support */}
        <div className='mt-10 rounded-3xl border border-default bg-surface p-6 transition-theme'>
          <div className='flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
            <div className='flex items-start gap-4'>
              <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-secondary'>
                <Mail
                  size={20}
                  className='text-secondary'
                />
              </div>

              <div>
                <h2 className='text-lg font-semibold text-primary'>
                  Still need help?
                </h2>

                <p className='mt-1 max-w-2xl text-sm leading-6 text-secondary'>
                  Can't find the answer you're looking for?
                  Tell us what you need help with.
                </p>
              </div>
            </div>

            <button
              type='button'
              onClick={() => setShowContactModal(true)}
              className='shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700'
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Contact Support Modal */}
      {showContactModal && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
          onClick={closeContactModal}
        >
          <div
            className='w-full max-w-lg rounded-3xl border border-default bg-surface p-6 shadow-2xl transition-theme'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className='flex items-start justify-between gap-4'>
              <div>
                <h2 className='text-2xl font-bold text-primary'>
                  Contact Support
                </h2>

                <p className='mt-1 text-sm text-secondary'>
                  Tell us how we can help.
                </p>
              </div>

              <button
                type='button'
                onClick={closeContactModal}
                className='rounded-xl p-2 text-secondary transition hover:bg-surface-hover hover:text-primary'
                aria-label='Close contact support'
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className='mt-6 space-y-5'>

              {/* Issue Type */}
              <div>
                <label className='mb-2 block text-sm font-medium text-primary'>
                  Issue Type
                </label>

                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className='w-full rounded-xl border border-default bg-surface px-4 py-3 text-sm text-primary outline-none transition-theme focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                >
                  <option value='General'>General</option>
                  <option value='Account & Security'>
                    Account & Security
                  </option>
                  <option value='Receipts'>Receipts</option>
                  <option value='Warranties'>Warranties</option>
                  <option value='Notifications'>Notifications</option>
                  <option value='Data & Backup'>Data & Backup</option>
                  <option value='Other'>Other</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className='mb-2 block text-sm font-medium text-primary'>
                  Subject
                </label>

                <input
                  type='text'
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder='What do you need help with?'
                  className='w-full rounded-xl border border-default bg-surface px-4 py-3 text-sm text-primary outline-none transition-theme placeholder:text-secondary focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                />
              </div>

              {/* Email */}
              <div>
                <label className='mb-2 block text-sm font-medium text-primary'>
                  Your Email
                </label>

                <input
                  type='email'
                  value={user?.email || ''}
                  readOnly
                  className='w-full rounded-xl border border-default bg-surface-secondary px-4 py-3 text-sm text-secondary outline-none'
                />
              </div>

              {/* Message */}
              <div>
                <label className='mb-2 block text-sm font-medium text-primary'>
                  Message
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder='Describe your problem or question...'
                  className='w-full resize-none rounded-xl border border-default bg-surface px-4 py-3 text-sm text-primary outline-none transition-theme placeholder:text-secondary focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
              <button
                type='button'
                onClick={closeContactModal}
                className='rounded-xl border border-default px-5 py-3 text-sm font-medium text-primary transition-theme hover:bg-surface-hover'
              >
                Cancel
              </button>

              <button
                type='button'
                onClick={handleCopySupportRequest}
                className='flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700'
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy Support Request
                  </>
                )}
              </button>
            </div>

            <p className='mt-4 text-center text-xs leading-5 text-secondary'>
              Your support request will include your account email,
              issue type, subject, and message.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HelpCenter;