import {
ArrowLeft,
Check,
Copy,
Mail,
Search,
X,
Bug,
Lightbulb,
Shield,
FileText,
Info,
ChevronDown,
} from 'lucide-react';
import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import HelpCategoryCard from '../../components/help/HelpCategoryCard';
import { helpArticles, helpCategories } from '../../constants/helpContent';
import { AuthContext } from '../../context/AuthContext';
import faqData from './data/faqData';

function HelpCenter() {
const navigate = useNavigate();
const { user } = useContext(AuthContext);

const [searchQuery, setSearchQuery] = useState('');
const [showContactModal, setShowContactModal] = useState(false);
const [issueType, setIssueType] = useState('General');
const [subject, setSubject] = useState('');
const [message, setMessage] = useState('');
const [copied, setCopied] = useState(false);
const [openFaq, setOpenFaq] = useState(null);

const handleCategoryClick = (categoryId) => {
navigate(`/help-center/${categoryId}`);
};

const searchResults = useMemo(() => {
const query = searchQuery.trim().toLowerCase();


if (!query) return [];

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

const openSupportWithType = (type) => {
setIssueType(type);
setShowContactModal(true);
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
> <div className='mx-auto max-w-6xl'>
<button
type='button'
onClick={() => navigate('/dashboard')}
className='mb-6 flex items-center gap-2 text-sm font-medium text-secondary transition hover:text-primary'
> <ArrowLeft size={18} />
Back to Dashboard </button>


    <div className='mb-8'>
      <p className='text-sm font-semibold text-secondary'>Support</p>

      <h1 className='mt-2 text-3xl font-bold text-primary'>
        Help Center
      </h1>

      <p className='mt-2 max-w-2xl text-secondary'>
        Find answers and learn how to get the most out of
        your Billvora personal purchase vault.
      </p>
    </div>

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
      <>
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

        <div className='mt-10'>
          <div className='mb-5'>
            <h2 className='text-xl font-semibold text-primary'>
              Frequently Asked Questions
            </h2>

            <p className='mt-1 text-sm text-secondary'>
              Quick answers to the most common Billvora questions.
            </p>
          </div>

          <div className='space-y-3'>
            {faqData.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className='overflow-hidden rounded-2xl border border-default bg-surface transition-theme'
                >
                  <button
                    type='button'
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className='flex w-full items-center justify-between gap-4 p-5 text-left transition-theme hover:bg-surface-hover'
                  >
                    <div>
                      <p className='text-xs font-medium uppercase tracking-wide text-secondary'>
                        {faq.category}
                      </p>

                      <h3 className='mt-1 text-base font-semibold text-primary'>
                        {faq.question}
                      </h3>
                    </div>

                    <ChevronDown
                      className={`h-5 w-5 text-secondary transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className='border-t border-default px-5 pb-5 pt-4'>
                      <p className='text-sm leading-6 text-secondary'>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className='mt-10 rounded-3xl border border-default bg-surface p-6 transition-theme'>
          <div className='mb-5'>
            <h2 className='text-xl font-semibold text-primary'>
              Need more help?
            </h2>

            <p className='mt-1 text-sm text-secondary'>
              Contact our support team, report an issue, or suggest a new feature.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <button
              type='button'
              onClick={() => openSupportWithType('General')}
              className='rounded-2xl border border-default bg-surface p-5 text-left transition-theme hover:bg-surface-hover'
            >
              <div className='mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-secondary'>
                <Mail className='text-secondary' size={20} />
              </div>

              <h3 className='text-lg font-semibold text-primary'>
                Contact Support
              </h3>

              <p className='mt-1 text-sm text-secondary'>
                Get help from the Billvora support team.
              </p>
            </button>

            <button
              type='button'
              onClick={() => openSupportWithType('Bug Report')}
              className='rounded-2xl border border-default bg-surface p-5 text-left transition-theme hover:bg-surface-hover'
            >
              <div className='mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-secondary'>
                <Bug className='text-secondary' size={20} />
              </div>

              <h3 className='text-lg font-semibold text-primary'>
                Report a Bug
              </h3>

              <p className='mt-1 text-sm text-secondary'>
                Tell us about an issue you found.
              </p>
            </button>

            <button
              type='button'
              onClick={() => openSupportWithType('Feature Request')}
              className='rounded-2xl border border-default bg-surface p-5 text-left transition-theme hover:bg-surface-hover'
            >
              <div className='mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-secondary'>
                <Lightbulb className='text-secondary' size={20} />
              </div>

              <h3 className='text-lg font-semibold text-primary'>
                Feature Request
              </h3>

              <p className='mt-1 text-sm text-secondary'>
                Suggest a new feature for Billvora.
              </p>
            </button>
          </div>
        </div>

        <div className='mt-10'>
          <div className='mb-5'>
            <h2 className='text-xl font-semibold text-primary'>
              Resources
            </h2>

            <p className='mt-1 text-sm text-secondary'>
              Read our policies and learn more about Billvora.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <button
              type='button'
              onClick={() => navigate('/help-center/privacy-policy')}
              className='rounded-2xl border border-default bg-surface p-5 text-left transition-theme hover:bg-surface-hover'
            >
              <div className='mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-secondary'>
                <Shield className='text-secondary' size={20} />
              </div>

              <h3 className='text-lg font-semibold text-primary'>
                Privacy Policy
              </h3>

              <p className='mt-1 text-sm text-secondary'>
                Learn how we protect your data.
              </p>
            </button>

            <button
              type='button'
              onClick={() => navigate('/help-center/terms')}
              className='rounded-2xl border border-default bg-surface p-5 text-left transition-theme hover:bg-surface-hover'
            >
              <div className='mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-secondary'>
                <FileText className='text-secondary' size={20} />
              </div>

              <h3 className='text-lg font-semibold text-primary'>
                Terms & Conditions
              </h3>

              <p className='mt-1 text-sm text-secondary'>
                Read the terms for using Billvora.
              </p>
            </button>

            <button
              type='button'
              onClick={() => navigate('/help-center/app-version')}
              className='rounded-2xl border border-default bg-surface p-5 text-left transition-theme hover:bg-surface-hover'
            >
              <div className='mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-secondary'>
                <Info className='text-secondary' size={20} />
              </div>

              <h3 className='text-lg font-semibold text-primary'>
                App Version
              </h3>

              <p className='mt-1 text-sm text-secondary'>
                View the current Billvora version and build information.
              </p>
            </button>
          </div>
        </div>
      </>
    )}

    {showContactModal && (
      <div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
        onClick={closeContactModal}
      >
        <div
          className='w-full max-w-lg rounded-3xl border border-default bg-surface p-6 shadow-2xl transition-theme'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h2 className='text-2xl font-bold text-primary'>
                {issueType}
              </h2>

              <p className='mt-1 text-sm text-secondary'>
                Tell us how we can help.
              </p>
            </div>

            <button
              type='button'
              onClick={closeContactModal}
              className='rounded-xl p-2 text-secondary transition hover:bg-surface-hover hover:text-primary'
            >
              <X size={20} />
            </button>
          </div>

          <div className='mt-6 space-y-5'>
            <div>
              <label className='mb-2 block text-sm font-medium text-primary'>
                Subject
              </label>

              <input
                type='text'
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder='What do you need help with?'
                className='w-full rounded-xl border border-default bg-surface px-4 py-3 text-sm text-primary outline-none transition-theme placeholder:text-secondary'
              />
            </div>

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

            <div>
              <label className='mb-2 block text-sm font-medium text-primary'>
                Message
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder='Describe your problem or idea...'
                className='w-full resize-none rounded-xl border border-default bg-surface px-4 py-3 text-sm text-primary outline-none transition-theme placeholder:text-secondary'
              />
            </div>
          </div>

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
        </div>
      </div>
    )}
  </div>
</div>


);
}

export default HelpCenter;
