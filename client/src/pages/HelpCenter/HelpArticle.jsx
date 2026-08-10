import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  helpArticles,
  helpArticleContent,
  helpCategories,
} from '../../constants/helpContent';

function HelpArticle() {
  const navigate = useNavigate();
  const { categoryId, articleId } = useParams();

  const category = helpCategories.find(
    (item) => item.id === categoryId
  );

  const article = helpArticles[categoryId]?.find(
    (item) => item.id === articleId
  );

  const content = helpArticleContent[articleId];

  if (!category || !article || !content) {
    return (
      <div
        className='min-h-screen p-6'
        style={{
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
        }}
      >
        <div className='mx-auto max-w-4xl'>
          <button
            type='button'
            onClick={() => navigate('/help-center')}
            className='mb-8 flex items-center gap-2 text-sm text-secondary transition hover:text-primary'
          >
            <ArrowLeft size={18} />
            Back to Help Center
          </button>

          <h1 className='text-3xl font-bold text-primary'>
            Article not found
          </h1>

          <p className='mt-2 text-secondary'>
            The help article you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className='min-h-screen p-6'
      style={{
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      <div className='mx-auto max-w-4xl'>

        {/* Back */}
        <button
          type='button'
          onClick={() =>
            navigate(`/help-center/${categoryId}`)
          }
          className='mb-8 flex items-center gap-2 text-sm text-secondary transition hover:text-primary'
        >
          <ArrowLeft size={18} />
          Back to {category.title}
        </button>

        {/* Article Header */}
        <article>
          <div className='mb-10'>
            <p className='text-sm font-medium text-secondary'>
              {category.title}
            </p>

            <h1 className='mt-3 text-4xl font-bold tracking-tight text-primary'>
              {content.title}
            </h1>

            <p className='mt-4 text-lg leading-8 text-secondary'>
              {content.intro}
            </p>
          </div>

          {/* Article Content */}
          <div className='space-y-8'>
            {content.sections.map((section, index) => (
              <section
                key={`${section.title}-${index}`}
                className='rounded-3xl border border-default bg-surface p-6 transition-theme'
              >
                <h2 className='text-xl font-semibold text-primary'>
                  {section.title}
                </h2>

                {section.content && (
                  <p className='mt-4 leading-7 text-secondary'>
                    {section.content}
                  </p>
                )}

                {section.steps && (
                  <ol className='mt-5 space-y-4'>
                    {section.steps.map((step, stepIndex) => (
                      <li
                        key={stepIndex}
                        className='flex items-start gap-3'
                      >
                        <CheckCircle2
                          size={20}
                          className='mt-0.5 shrink-0 text-secondary'
                        />

                        <span className='leading-7 text-secondary'>
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            ))}
          </div>
        </article>

        {/* Bottom Navigation */}
        <div className='mt-10 flex justify-between border-t border-default pt-6'>
          <button
            type='button'
            onClick={() =>
              navigate(`/help-center/${categoryId}`)
            }
            className='text-sm font-medium text-secondary transition hover:text-primary'
          >
            ← More articles
          </button>

          <button
            type='button'
            onClick={() => navigate('/help-center')}
            className='text-sm font-medium text-secondary transition hover:text-primary'
          >
            Help Center →
          </button>
        </div>

      </div>
    </div>
  );
}

export default HelpArticle;