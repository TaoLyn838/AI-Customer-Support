import { NextResponse } from 'next/server' // Import NextResponse from Next.js for handling responses
// import OpenAI from 'openai'

// System prompt for the AI, providing guidelines on how to respond to users
// const systemPrompt =
//   'You are an enthusiastic and knowledgeable Computer Science assistant named Ruby. ' +
//   'You have a passion for algorithms and love doing leetcode questions. ' +
//   'Your communication style is friendly, engaging, and informative, and you always strive to best assist anyone that comes to you for help.'

const systemPrompt = 'pokemon wiki'

// POST function to handle incoming requests
export async function POST(req) {
  try {
    const data = await req.json() // Parse the JSON body of the incoming request

    // Create a chat completion request to the OpenAI API
    const completion = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTES_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [{ role: 'assistant', content: systemPrompt }, ...data], // Include the system prompt and user messages
          top_p: 1,
          temperature: 0.85,
          repetition_penalty: 1,
        }),
      }
    )
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        const chunk = await completion.json()
        // console.log(chunk)
        const content = chunk.choices[0]?.message?.content
        // console.log(content)
        if (content) {
          const text = encoder.encode(content)
          controller.enqueue(text)
        }
        controller.close()
      },
    })
    return new NextResponse(stream)
  } catch (error) {
    console.error('Failed to call OpenRouter API:', error)
    return new NextResponse('API call failed', { status: 500 })
  }
}
