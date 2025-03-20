"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SerialConnectProps {
  onConnect: (port: any) => void
  onDisconnect: () => void
  onColorData: (data: { r: number; g: number; b: number }) => void
  connected: boolean
}

export default function SerialConnect({ onConnect, onDisconnect, onColorData, connected }: SerialConnectProps) {
  const [error, setError] = useState<string | null>(null)
  const [reader, setReader] = useState<ReadableStreamDefaultReader | null>(null)

  // Check if Web Serial API is supported
  const isSerialSupported = () => {
    return "serial" in navigator
  }

  // Connect to the Arduino
  const connectToArduino = async () => {
    if (!isSerialSupported()) {
      setError("Web Serial API is not supported in your browser. Try Chrome or Edge.")
      return
    }

    try {
      // Request port access
      const port = await navigator.serial.requestPort()

      // Open the port with Arduino settings (usually 9600 baud)
      await port.open({ baudRate: 9600 })

      onConnect(port)

      // Set up the reading
      const textDecoder = new TextDecoderStream()
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable)
      const reader = textDecoder.readable.getReader()
      setReader(reader)

      // Start reading loop
      readSerialData(reader)
    } catch (err) {
      console.error("Error connecting to Arduino:", err)
      setError("Failed to connect to Arduino. Make sure it's properly connected and try again.")
    }
  }

  // Disconnect from the Arduino
  const disconnectFromArduino = async () => {
    if (reader) {
      await reader.cancel()
      setReader(null)
    }
    onDisconnect()
  }

  // Read data from the serial port
  const readSerialData = async (reader: ReadableStreamDefaultReader) => {
    try {
      let buffer = ""

      while (true) {
        const { value, done } = await reader.read()

        if (done) {
          // The stream was canceled
          break
        }

        // Add the new data to our buffer
        buffer += value

        // Try to extract complete JSON objects
        let endIndex
        while ((endIndex = buffer.indexOf("}")) !== -1) {
          try {
            // Extract a complete JSON string
            const jsonString = buffer.substring(0, endIndex + 1)
            buffer = buffer.substring(endIndex + 1)

            // Parse the JSON
            const data = JSON.parse(jsonString)

            // Update the color if we have RGB values
            if (data.r !== undefined && data.g !== undefined && data.b !== undefined) {
              onColorData({
                r: data.r,
                g: data.g,
                b: data.b,
              })
            }
          } catch (e) {
            // If we couldn't parse the JSON, discard this chunk and continue
            buffer = buffer.substring(endIndex + 1)
            console.error("Error parsing JSON:", e)
          }
        }
      }
    } catch (error) {
      console.error("Error reading from serial:", error)
      setError("Error reading data from Arduino. Try reconnecting.")
    } finally {
      onDisconnect()
    }
  }

  return (
    <div className="space-y-4">
      {!isSerialSupported() && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Incompatible Browser</AlertTitle>
          <AlertDescription>
            Web Serial API is not supported in your browser. Please use Chrome or Edge.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={connected ? disconnectFromArduino : connectToArduino}
        className="w-full"
        variant={connected ? "destructive" : "default"}
      >
        {connected ? "Disconnect from Arduino" : "Connect to Arduino"}
      </Button>

      {connected && <p className="text-sm text-green-600 text-center">Connected to Arduino. Receiving color data...</p>}
    </div>
  )
}

