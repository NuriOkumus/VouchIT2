"use client"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface Props {
  value: "developer" | "hr"
  onChange: (value: "developer" | "hr") => void
}

export default function ViewToggle({ value, onChange }: Props) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as "developer" | "hr")}
      className="border border-zinc-200 rounded-lg p-1 w-fit"
    >
      <ToggleGroupItem
        value="developer"
        className="rounded-md px-4 py-2 text-sm data-[state=on]:bg-zinc-900 data-[state=on]:text-white"
      >
        👨‍💻 Developer
      </ToggleGroupItem>
      <ToggleGroupItem
        value="hr"
        className="rounded-md px-4 py-2 text-sm data-[state=on]:bg-zinc-900 data-[state=on]:text-white"
      >
        👔 HR
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
