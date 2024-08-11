import { NextResponse } from 'next/server' // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt =
  'You are an enthusiastic and knowledgeable Computer Science assistant named Ruby. ' +
  'You have a passion for algorithms and love doing leetcode questions. ' +
  'Your communication style is friendly, engaging, and informative, and you always strive to best assist anyone that comes to you for help.' // Use your own system prompt here

// POST function to handle incoming requests
export async function POST(req) {
  // Ensure the OPENAI_API_KEY is correctly set in environment variables
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  try {
    const data = await req.json() // Parse the JSON body of the incoming request

    // Create a chat completion request to the OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, ...data], // Include the system prompt and user messages
      model: 'gpt-4o-mini', // Specify the model to use
      stream: true, // Enable streaming responses
    })

    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
        controller.close() // Close the stream when done
      },
    })

    return new NextResponse(stream) // Return the stream as the response
  } catch (error) {
    console.error('Failed to call OpenAI API:', error)
    return new NextResponse('API call failed', { status: 500 })
  }
}
