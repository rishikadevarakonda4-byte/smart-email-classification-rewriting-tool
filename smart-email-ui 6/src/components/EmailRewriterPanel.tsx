import { FormEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { rewriteEmail, RewriteResponse } from '../api'
import { Loader } from './Loader'

const toneOptions = ['professional', 'friendly', 'formal', 'casual', 'concise', 'empathetic']

export function EmailRewriterPanel() {
  const [emailContent, setEmailContent] = useState('Could you help me refine this project update email so it sounds polished and professional?')
  const [tone, setTone] = useState('professional')

  const { mutateAsync, data, isPending } = useMutation<RewriteResponse, Error, { email_content: string; tone: string }>(
    {
      mutationFn: rewriteEmail,
      onError: () => toast.error('Unable to rewrite the email. Please try again.'),
    },
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!emailContent.trim()) {
      toast.error('Please enter the email content to rewrite.')
      return
    }

    await mutateAsync({ email_content: emailContent.trim(), tone })
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40 animate-fadeIn">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Email rewrite</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">Rewrite your message in any tone</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Choose a tone and receive a polished rewrite that keeps your intent intact.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-slate-700 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Tone selected</p>
          <p className="mt-1 text-lg font-semibold capitalize">{tone}</p>
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

        <div className="grid gap-4 sm:grid-cols-[1fr_0.84fr]">
          <label className="block text-sm font-medium text-slate-700">
            Tone
            <select
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              value={tone}
              onChange={(event) => setTone(event.target.value)}
            >
              {toneOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isPending}
          >
            {isPending ? <Loader /> : 'Rewrite email'}
          </button>
        </div>
      </form>

      {data ? (
        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Original text</p>
            <p className="mt-3 whitespace-pre-wrap text-slate-700">{data.original_email}</p>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-slate-50 shadow-2xl shadow-slate-950/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Rewritten result</p>
                <p className="mt-2 text-sm text-slate-300">Tone applied: {data.tone_applied}</p>
              </div>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-base leading-7">{data.rewritten_email}</p>
          </div>
        </div>
      ) : null}
    </section>
  )
}
