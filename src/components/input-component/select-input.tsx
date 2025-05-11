import React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Control, FieldValues, Path } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Option {
    value: string
    label: string
}

interface CustomFormSelectProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    labelText: string
    placeholder?: string
    options: Option[]
    disabled?: boolean
}

export function CustomFormSelect<T extends FieldValues>({
                                                            name,
                                                            control,
                                                            labelText,
                                                            placeholder,
                                                            options,
                                                            disabled = false,
                                                        }: CustomFormSelectProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-zinc-300">{labelText}</FormLabel>
                    <FormControl>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={disabled}
                        >
                            <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-300 focus:ring-zinc-700 h-12">
                                <SelectValue placeholder={placeholder || `Select ${labelText.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                {options.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    )
}