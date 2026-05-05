import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { auth } from '@clerk/nextjs/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, company } = await req.json()
  if (!name?.trim() || !company?.trim()) {
    return NextResponse.json({ error: 'Name and company are required' }, { status: 400 })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Write a short cold email to ${name} at ${company}. Professional tone, mention their work, include a call to action.` }]
    })
    return NextResponse.json({ body: completion.choices[0].message.content })
  } catch {
    return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 })
  }
}
