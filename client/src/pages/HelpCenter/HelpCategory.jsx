import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { helpArticles, helpCategories } from '../../constants/helpContent';

function HelpCategory() {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const category = helpCategories.find(
    (item) => item.id === categoryId
  );

  const articles = helpArticles[categoryId] || [];

  if (!category) {
    return (
      <div
        className='min-h-screen p-6'
        style={{
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
        }}
      >
        <div className='mx-auto max-w-5xl'>
          <button
            type='button'
            onClick={() => navigate('/help-center')}
            className='mb-8 flex items-center gap-2 text-sm text-secondary transition hover:text-primary'
          >
            <ArrowLeft size={18} />
            Back to Help Center
          </button>

          <h1 className='text-3xl font-bold text-primary'>
            Category not found
          </h1>

          <p className='mt-2 text-secondary'>
            The help category you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  const Icon = category.icon;

  return (
    <div
      className='min-h-screen p-6'
      style={{
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      <div className='mx-auto max-w-5xl'>

        {/* Back */}
        <button
          type='button'
          onClick={() => navigate('/help-center')}
          className='mb-8 flex items-center gap-2 text-sm text-secondary transition hover:text-primary'
        >
          <ArrowLeft size={18} />
          Back to Help Center
        </button>

        {/* Header */}
        <div className='mb-10'>
          <div className='flex items-center gap-4'>
            <div className='button-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl'>
              <Icon size={25} />
            </div>

            <div>
              <h1 className='text-3xl font-bold text-primary'>
                {category.title}
              </h1>

              <p className='mt-1 text-secondary'>
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Articles */}
        <div className='space-y-3'>
          {articles.map((article) => (
            <button
              key={article.id}
              type='button'
              onClick={() =>
                navigate(
                  `/help-center/${categoryId}/${article.id}`
                )
              }
              className='group flex w-full items-center gap-4 rounded-2xl border border-default bg-surface p-5 text-left transition-theme hover:bg-surface-hover'
            >
              <div className='min-w-0 flex-1'>
                <h2 className='font-semibold text-primary'>
                  {article.title}
                </h2>

                <p className='mt-1 text-sm leading-6 text-secondary'>
                  {article.description}
                </p>
              </div>

              <ChevronRight
                size={20}
                className='shrink-0 text-secondary transition-transform group-hover:translate-x-1'
              />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default HelpCategory;