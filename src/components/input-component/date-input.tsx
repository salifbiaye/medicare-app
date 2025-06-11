import React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Control, FieldValues, Path } from "react-hook-form"
import { Input } from "@/components/ui/input"

interface CustomFormDatePickerProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    labelText?: string
    placeholder?: string
    disabled?: boolean
    showTime?: boolean
    min?: number
}

export function CustomFormDatePicker<T extends FieldValues>({
                                                                name,
                                                                control,
                                                                labelText,
                                                                placeholder = "JJ/MM/AAAA",
                                                                disabled = false,
                                                                showTime = false,
                                                                min
                                                            }: CustomFormDatePickerProps<T>) {

    const formatDateForInput = (value: string | undefined): string => {
        if (!value) return '';

        const date = new Date(value);
        if (isNaN(date.getTime())) return '';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        if (showTime) {
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        }

        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (value: string, onChange: (value: string) => void) => {
        if (!value) {
            onChange('');
            return;
        }

        const date = new Date(value);
        if (isNaN(date.getTime())) {
            onChange('');
            return;
        }

        // Vérifier si la date est supérieure au minimum
        if (min && date.getTime() < min) {
            onChange('');
            return;
        }

        // Convertir en chaîne ISO
        onChange(date.toISOString());
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                    <FormLabel className="capitalize">{labelText || name}</FormLabel>
                    <FormControl>
                        <div className="space-y-2">
                            <div className="flex rounded-lg">
                                <Input
                                    {...field}
                                    id={name}
                                    className="pl-4 h-14 rounded-[15px] bg-muted transition-all duration-300"
                                    placeholder={placeholder}
                                    type={showTime ? "datetime-local" : "date"}
                                    step={showTime ? "60" : undefined}
                                    value={formatDateForInput(value)}
                                    onChange={(e) => handleDateChange(e.target.value, onChange)}
                                    disabled={disabled}
                                    min={min ? new Date(min).toISOString().slice(0, showTime ? 16 : 10) : undefined}
                                />
                            </div>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}