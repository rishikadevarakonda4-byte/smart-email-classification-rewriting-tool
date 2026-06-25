import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { EmailClassifierPanel } from './components/EmailClassifierPanel'
import { EmailRewriterPanel } from './components/EmailRewriterPanel'

const queryClient = new QueryClient()

function App() {
  const [apiOrigin] = useState(() => window.location.origin)

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-12 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Smart Email SaaS</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Classify and rewrite emails with one AI workflow.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Send your email text, choose a tone, and get fast, structured responses for classification and polished rewrites.
              </p>
            </div>
            <div className="grid gap-4 sm:max-w-sm">
              <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/10">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-300">API Status</p>
                <p className="mt-3 text-3xl font-semibold">Ready</p>
                <p className="mt-2 text-sm text-slate-300">Configured to proxy requests to <span className="font-medium text-white">{apiOrigin}/api</span>.</p>
              </div>
            </div>
          </header>

          <main className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <EmailClassifierPanel />
            <EmailRewriterPanel />
          </main>
        </div>
      </div>
      <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />
    </QueryClientProvider>
  )
}

export default App
