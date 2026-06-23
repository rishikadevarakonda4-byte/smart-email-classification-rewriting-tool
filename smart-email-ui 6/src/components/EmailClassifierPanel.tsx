import { FormEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { classifyEmail, ClassifyResponse } from '../api'
import { Loader } from './Loader'

const categories = {
  Work: 'bg-sky-100 text-sky-800',
  Personal: 'bg-emerald-100 text-emerald-800',
  Finance: 'bg-amber-100 text-amber-800',
  Spam: 'bg-rose-100 text-rose-800',
}

export function EmailClassifierPanel() {
  const [emailContent, setEmailContent] = useState('Hi team, could you review the Q3 report and share your feedback by Friday?')

  const { mutateAsync, data, isPending } = useMutation<ClassifyResponse, Error, { email_content: string }>(
    {
      mutationFn: classifyEmail,
      onError: () => toast.error('Unable to classify the email. Please try again.'),
    },
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!emailContent.trim()) {
      toast.error('Please enter the email content to classify.')
      return
    }

    await mutateAsync({ email_content: emailContent.trim() })
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40 animate-fadeIn">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Email classification</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">Detect intent and category</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Paste any email text and get a confident category with a short reasoning summary.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-slate-700 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Confidence</p>
          <p className="mt-1 text-lg font-semibold">{data?.confidence ?? '—'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="mb-3 block text-sm font-medium text-slate-700">Email content</label>
          <textarea
            className="min-h-[180px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            value={emailContent}
            onChange={(event) => setEmailContent(event.target.value)}
            placeholder="Paste your email body here..."
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={isPending}
        >
          {isPending ? <Loader /> : 'Classify email'}
        </button>
      </form>

      {data ? (
        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-4 py-2 text-sm font-semibold ${categories[data.category]}`}>
              {data.category}
            </span>
            <span className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600">
              {data.confidence} confidence
            </span>
          </div>
          <div className="mt-6 text-slate-700">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Why this category?</h3>
            <p className="mt-3 text-base leading-7">{data.reasoning}</p>
          </div>
        </div>
      ) : null}
    </section>
  )
}
