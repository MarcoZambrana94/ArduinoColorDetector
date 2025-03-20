"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ColorDisplay from "@/components/color-display"
import SerialConnect from "@/components/serial-connect"

export default function Home() {
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 })
  const [connected, setConnected] = useState(false)
  const [port, setPort] = useState(null)

  // Convert RGB to Hex
  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  }

  const hexColor = rgbToHex(color.r, color.g, color.b)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Arduino Color Detector</CardTitle>
          <CardDescription>Conecta un Arduino para la deteccion de color en tiempo real</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SerialConnect
            onConnect={(serialPort) => {
              setConnected(true)
              setPort(serialPort)
            }}
            onDisconnect={() => {
              setConnected(false)
              setPort(null)
            }}
            onColorData={setColor}
            connected={connected}
          />

          <div className="space-y-4 pt-4">
            <ColorDisplay color={hexColor} />

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">RGB Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono">
                    R: {color.r}, G: {color.g}, B: {color.b}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">Hex Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono">{hexColor}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

