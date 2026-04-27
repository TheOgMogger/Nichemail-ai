import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { name, company } = await req.json()
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: `Write a short cold email to ${name} at ${company}. Professional tone, mention their work, include a call to action.` }]
  })
  return NextResponse.json({ body: completion.choices[0].message.content })
}
