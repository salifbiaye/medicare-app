import React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Control, FieldValues, Path } from "react-hook-form"
import { Input } from "@/components/ui/input"

interface CustomFormNumberInputProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    labelText: string
    placeholder?: string
    min?: number
    max?: number
    step?: number
    disabled?: boolean
}

export function CustomFormNumberInput<T extends FieldValues>({
                                                                 name,
                                                                 control,
                                                                 labelText,
                                                                 placeholder,
                                                                 min,
                                                                 max,
                                                                 step = 1,
                                                                 disabled = false,
                                                             }: CustomFormNumberInputProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-zinc-300">{labelText}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            onChange={(e) => {
                                const value = e.target.value === "" ? "" : Number(e.target.value)
                                field.onChange(value)
                            }}
                            type="number"
                            min={min}
                            max={max}
                            step={step}
                            placeholder={placeholder}
                            className="bg-zinc-950 border-zinc-800 text-zinc-300 focus:ring-zinc-700 focus-visible:ring-zinc-700 focus-visible:ring-offset-zinc-900 h-12"
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    )
}