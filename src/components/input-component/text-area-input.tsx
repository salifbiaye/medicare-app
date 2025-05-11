import React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Control, FieldValues, Path } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"

interface CustomFormTextareaProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    labelText: string
    placeholder?: string
    rows?: number
    disabled?: boolean
}

export function CustomFormTextarea<T extends FieldValues>({
                                                              name,
                                                              control,
                                                              labelText,
                                                              placeholder,
                                                              rows = 4,
                                                              disabled = false,
                                                          }: CustomFormTextareaProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-zinc-300">{labelText}</FormLabel>
                    <FormControl>
                        <Textarea
                            {...field}
                            placeholder={placeholder}
                            className="bg-zinc-950 border-zinc-800 text-zinc-300 focus:ring-zinc-700 focus-visible:ring-zinc-700 focus-visible:ring-offset-zinc-900 resize-none"
                            rows={rows}
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    )
}
