import axios from 'axios'

export interface ClassifyRequest {
  email_content: string
}

export interface ClassifyResponse {
  category: 'Work' | 'Personal' | 'Finance' | 'Spam'
  confidence: 'High' | 'Medium' | 'Low'
  reasoning: string
}

export interface RewriteRequest {
  email_content: string
  tone: string
}

export interface RewriteResponse {
  original_email: string
  rewritten_email: string
  tone_applied: string
}

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000,
})

export async function classifyEmail(request: ClassifyRequest): Promise<ClassifyResponse> {
  const response = await client.post<ClassifyResponse>('/classify_email', request)
  return response.data
}

export async function rewriteEmail(request: RewriteRequest): Promise<RewriteResponse> {
  const response = await client.post<RewriteResponse>('/rewrite_email', request)
  return response.data
}
