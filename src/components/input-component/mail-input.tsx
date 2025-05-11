import { Control, FieldValues, Path } from 'react-hook-form';
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '../ui/form';

type CustomFormMailProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    labelText?: string;
};

export function CustomFormMail<T extends FieldValues>({ name, control, labelText }: CustomFormMailProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="capitalize">{labelText || name}</FormLabel>
                    <FormControl>
                        <div className="space-y-2">
                            <div className="flex rounded-lg  ">
                                <Input
                                    {...field}
                                    id={name}
                                    className=" pl-4 h-14 rounded-[15px] bg-muted   transition-all duration-300 "
                                    placeholder="ex: salifbiaye@gmail.com"
                                    type="text"
                                    value={field.value}  // Met à jour seulement la partie avant le "@"
                                    onChange={e => field.onChange(e.target.value)}  // Ajoute ou met à jour la partie avant et après '@'
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