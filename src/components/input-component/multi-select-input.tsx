import React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Control, FieldValues, Path } from "react-hook-form"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface Option {
    value: string
    label: string
}

interface CustomFormMultiSelectProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    labelText: string
    placeholder?: string
    options: Option[]
    disabled?: boolean
}

export function CustomFormMultiSelect<T extends FieldValues>({
                                                                 name,
                                                                 control,
                                                                 labelText,
                                                                 placeholder,
                                                                 options,
                                                                 disabled = false,
                                                             }: CustomFormMultiSelectProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel className="text-zinc-300">{labelText}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full h-auto min-h-12 justify-between font-normal bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900",
                                        !field.value?.length && "text-zinc-500"
                                    )}
                                    disabled={disabled}
                                >
                                    <div className="flex flex-wrap gap-1 py-1">
                                        {field.value && field.value?.length > 0 ? (
                                            field.value.map((value: string) => {
                                                const option = options.find((opt) => opt.value === value)
                                                return (
                                                    <Badge
                                                        key={value}
                                                        className="mr-1 mb-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            if (disabled) return
                                                            const newValue = field.value.filter((v: string) => v !== value)
                                                            field.onChange(newValue)
                                                        }}
                                                    >
                                                        {option?.label || value}
                                                        {!disabled && <X className="ml-1 h-3 w-3" />}
                                                    </Badge>
                                                )
                                            })
                                        ) : (
                                            <span className="text-zinc-500">{placeholder || "Sélectionner..."}</span>
                                        )}
                                    </div>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 bg-zinc-900 border-zinc-800">
                            <Command className="bg-zinc-900">
                                <CommandInput placeholder="Rechercher..." className="h-9 bg-zinc-900 text-zinc-300" />
                                <CommandEmpty className="text-zinc-500 py-2">Aucun résultat trouvé.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-y-auto">
                                    {options.map((option) => {
                                        const isSelected = field.value?.includes(option.value)
                                        return (
                                            <CommandItem
                                                key={option.value}
                                                value={option.value}
                                                onSelect={() => {
                                                    const newValue = field.value || []
                                                    const selectedValue = option.value
                                                    field.onChange(
                                                        isSelected
                                                            ? newValue.filter((value: string) => value !== selectedValue)
                                                            : [...newValue, selectedValue]
                                                    )
                                                }}
                                                className="flex items-center gap-2 text-zinc-300 hover:bg-zinc-800"
                                            >
                                                <div
                                                    className={cn(
                                                        "flex h-4 w-4 items-center justify-center rounded-sm border border-zinc-700",
                                                        isSelected ? "bg-zinc-700 text-zinc-50" : "opacity-50"
                                                    )}
                                                >
                                                    {isSelected && <Check className="h-3 w-3" />}
                                                </div>
                                                {option.label}
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    )
}