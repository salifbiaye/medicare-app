import { Control, FieldValues, Path } from 'react-hook-form';
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '../ui/form';

type CustomFormDateTimeProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    labelText?: string;
    placeholder?: string;
    disabled?: boolean;
    showSeconds?: boolean;
    min?: number;
};

export function CustomFormDateTime<T extends FieldValues>({ 
    name, 
    control, 
    labelText,
    placeholder = "JJ/MM/AAAA HH:MM",
    disabled = false,
    showSeconds = false,
    min
}: CustomFormDateTimeProps<T>) {
    
    const formatDateTimeForInput = (value: string | undefined): string => {
        if (!value) return '';
        
        const date = new Date(value);
        if (isNaN(date.getTime())) return '';
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        if (showSeconds) {
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        }
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleDateTimeChange = (value: string, onChange: (value: string) => void) => {
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
                                    type="datetime-local"
                                    step={showSeconds ? "1" : "60"}
                                    value={formatDateTimeForInput(value)}
                                    onChange={(e) => handleDateTimeChange(e.target.value, onChange)}
                                    disabled={disabled}
                                    min={min ? new Date(min).toISOString().slice(0, 16) : undefined}
                                />
                            </div>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}