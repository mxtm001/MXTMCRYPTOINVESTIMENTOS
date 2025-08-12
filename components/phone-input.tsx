"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string
  onValueChange?: (value: string) => void
}

export function PhoneInput({ value = "", onValueChange, className, ...props }: PhoneInputProps) {
  const [phoneNumber, setPhoneNumber] = React.useState(value)

  React.useEffect(() => {
    setPhoneNumber(value)
  }, [value])

  const formatPhoneNumber = (input: string) => {
    // Remove all non-numeric characters except +
    const cleaned = input.replace(/[^\d+]/g, "")

    // Ensure it starts with +
    let formatted = cleaned
    if (!formatted.startsWith("+")) {
      formatted = "+" + formatted
    }

    return formatted
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
    onValueChange?.(formatted)
  }

  return (
    <Input
      {...props}
      type="tel"
      value={phoneNumber}
      onChange={handleChange}
      placeholder="+1234567890"
      className={cn("bg-[#162040] border-[#253256] text-white placeholder:text-gray-400", className)}
    />
  )
}
