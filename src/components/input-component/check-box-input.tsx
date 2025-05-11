import React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Control, FieldValues, Path } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"

interface CustomFormCheckboxProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    labelText: string
    disabled?: boolean
}

export function CustomFormCheckbox<T extends FieldValues>({
                                                              name,
                                                              control,
                                                              labelText,
                                                              disabled = false,
                                                          }: CustomFormCheckboxProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-row  items-start space-x-3 space-y-0 py-2">
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                            className="data-[state=checked]:bg-primary bg-muted data-[state=checked]:border-border"
                        />
                    </FormControl>
                    <FormLabel className="text-foreground font-normal">{labelText}</FormLabel>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    )
}