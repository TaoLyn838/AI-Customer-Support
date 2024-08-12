'use client'

import { Box, Button, Stack, TextField } from '@mui/material'
import { useRef, useState, useEffect } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm the Computer Science assistant support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return
    setIsLoading(true)

    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        {
          role: 'assistant',
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ])
    }
    setIsLoading(false)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Box className="w-[100vw] h-[100vh] flex flex-col justify-center items-center border border-black rounded-xl">
      <Box className="border flex flex-col rounded-t-xl">
        <h1 className="w-full bg-blue-500 flex justify-between px-2 py-1 rounded-lg text-white">
          <h2 className="text-sm font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g
                fill="none"
                stroke="#ffffff"
                strokLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                color="#ffffff"
              >
                <path d="M4 15.5a2 2 0 1 1 0-4m16 4a2 2 0 1 0 0-4M7 7V4m10 3V4" />
                <circle cx="7" cy="3" r="1" />
                <circle cx="17" cy="3" r="1" />
                <path d="M13.5 7h-3c-2.828 0-4.243 0-5.121.909S4.5 10.281 4.5 13.207s0 4.389.879 5.298c.878.909 2.293.909 5.121.909h1.025c.792 0 1.071.163 1.617.757c.603.657 1.537 1.534 2.382 1.738c1.201.29 1.336-.111 1.068-1.256c-.076-.326-.267-.847-.066-1.151c.113-.17.3-.212.675-.296c.591-.132 1.079-.348 1.42-.701c.879-.91.879-2.372.879-5.298s0-4.389-.879-5.298C17.743 7 16.328 7 13.5 7" />
                <path d="M9.5 15c.57.607 1.478 1 2.5 1s1.93-.393 2.5-1m-5.491-4H9m6.009 0H15" />
              </g>
            </svg>
            ChatBot
          </h2>
        </h1>
        <Box className="flex flex-col gap-4 p-2 select-none">
          {/* <Box className="flex flex-col"> */}
          <Stack
            direction={'column'}
            width="500px"
            height="800px"
            p={2}
            spacing={3}
          >
            <Stack
              direction={'column'}
              spacing={2}
              flexGrow={1}
              overflow="auto"
              maxHeight="100%"
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={
                    message.role === 'assistant' ? 'flex-start' : 'flex-end'
                  }
                >
                  {message.role === 'assistant' ? (
                    <Box className="flex items-center justify-center rounded bg-blue-500 w-8 aspect-square p-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="#ffffff"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          color="#ffffff"
                        >
                          <path d="M4 15.5a2 2 0 1 1 0-4m16 4a2 2 0 1 0 0-4M7 7V4m10 3V4" />
                          <circle cx="7" cy="3" r="1" />
                          <circle cx="17" cy="3" r="1" />
                          <path d="M13.5 7h-3c-2.828 0-4.243 0-5.121.909S4.5 10.281 4.5 13.207s0 4.389.879 5.298c.878.909 2.293.909 5.121.909h1.025c.792 0 1.071.163 1.617.757c.603.657 1.537 1.534 2.382 1.738c1.201.29 1.336-.111 1.068-1.256c-.076-.326-.267-.847-.066-1.151c.113-.17.3-.212.675-.296c.591-.132 1.079-.348 1.42-.701c.879-.91.879-2.372.879-5.298s0-4.389-.879-5.298C17.743 7 16.328 7 13.5 7" />
                          <path d="M9.5 15c.57.607 1.478 1 2.5 1s1.93-.393 2.5-1m-5.491-4H9m6.009 0H15" />
                        </g>
                      </svg>
                    </Box>
                  ) : (
                    <></>
                  )}
                  <Box
                    className={`mx-0.5 ${
                      message.role === 'assistant' ? 'w-[80%]' : ''
                    } p-2 rounded ${
                      message.role == 'assistant'
                        ? 'bg-blue-500'
                        : 'bg-indigo-500'
                    } text-white leading-4 text-sm`}
                    borderRadius={16}
                    p={3}
                  >
                    {message.content}
                  </Box>
                  {message.role === 'user' ? (
                    <Box className="flex items-center justify-center rounded bg-indigo-500 w-8 aspect-square p-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 256"
                      >
                        <path
                          fill="#ffffff"
                          d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8M72 96a56 56 0 1 1 56 56a56.06 56.06 0 0 1-56-56"
                        />
                      </svg>
                    </Box>
                  ) : (
                    <></>
                  )}
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Stack>
            <Stack direction={'row'} spacing={2}>
              <TextField
                label="Message"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </Stack>
          </Stack>
          {/* </Box> */}
        </Box>
      </Box>
    </Box>
  )
}
