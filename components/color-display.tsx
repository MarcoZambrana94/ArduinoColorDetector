interface ColorDisplayProps {
  color: string
}

export default function ColorDisplay({ color }: ColorDisplayProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-full h-32 rounded-md border" style={{ backgroundColor: color }} />
      <p className="text-sm text-muted-foreground">Detected Color</p>
    </div>
  )
}

