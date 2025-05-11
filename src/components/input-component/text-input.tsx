import { Control, FieldValues, Path } from "react-hook-form";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from "../ui/form";
import { ReactNode } from "react";

type CustomInputProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    labelText?: string;
    placeholder?: string;
    icon?: ReactNode;
    disabled?: boolean,
};

export function CustomFormText<T extends FieldValues>({
                                                           name,
                                                           control,
                                                          labelText,
                                                           placeholder,
                                                           icon,
                                                           disabled,
                                                       }: CustomInputProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {/* Affiche le label si fourni */}
                     <FormLabel className="capitalize">{labelText  || name}</FormLabel>
                    <FormControl>
                        <div className="space-y-2">
                            <div className="flex rounded-lg relative ">
                                {/* Icône optionnelle */}
                                {icon && (
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {icon}
                                    </div>
                                )}
                                <Input
                                    {...field}
                                    id={name}
                                    className={`${icon ? "pl-10" : ""}  pl-4 h-14 rounded-[15px] bg-muted  transition-all duration-300 focus:shadow-input`} // Ajoute un padding si une icône est présente
                                    placeholder={placeholder}
                                    disabled={disabled}
                                    type="text"
                                    value={field.value || ""} // Assure que la valeur n'est jamais undefined
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                            </div>
                        </div>
                    </FormControl>
                    {/* Affiche les messages d'erreur de validation */}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}