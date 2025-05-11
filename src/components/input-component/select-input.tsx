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
                    <FormLabel className="text-foreground">{labelText}</FormLabel>
                    <FormControl>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={disabled}
                        >
                            <SelectTrigger className=" bg-muted w-full border-border text-foreground focus:ring-zinc-700 h-12">
                                <SelectValue placeholder={placeholder || `Select ${labelText.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent className="bg-background  dark:bg-background border-border">
                                {options.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        className="text-foreground focus:bg-muted dark:focus:text-white"
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