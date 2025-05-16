import React, { useEffect, useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Control, FieldValues, Path, useWatch } from "react-hook-form"
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
    loadOptions?: (formData?: any) => Promise<Option[]>
    dependsOn?: string
}

export function CustomFormSelect<T extends FieldValues>({
                                                            name,
                                                            control,
                                                            labelText,
                                                            placeholder,
                                                            options: initialOptions,
                                                            disabled = false,
                                                            loadOptions,
                                                            dependsOn,
                                                        }: CustomFormSelectProps<T>) {
    const [options, setOptions] = useState<Option[]>(initialOptions || []);
    const [loading, setLoading] = useState<boolean>(!!loadOptions);
    
    // Observer la valeur du champ dont dépend ce select
    const dependencyValue = dependsOn ? useWatch({
        control,
        name: dependsOn as Path<T>,
    }) : undefined;

    // Vérifier si la dépendance a une valeur valide
    const hasDependencyValue = Boolean(dependencyValue !== undefined && dependencyValue !== null && dependencyValue !== "");

    // Charger les options dynamiquement si loadOptions est fourni
    useEffect(() => {
        const fetchOptions = async () => {
            if (loadOptions) {
                try {
                    setLoading(true);
                    // Si ce champ dépend d'un autre, on passe la valeur de ce champ à loadOptions
                    const formData = dependsOn ? { [dependsOn]: dependencyValue } : undefined;
                    const fetchedOptions = await loadOptions(formData);
                    setOptions(fetchedOptions);
                } catch (error) {
                    console.error(`Erreur lors du chargement des options pour ${name}:`, error);
                } finally {
                    setLoading(false);
                }
            }
        };

        // Recharger les options quand la dépendance change
        if (!dependsOn || hasDependencyValue) {
            fetchOptions();
        } else if (dependsOn) {
            // Réinitialiser les options si la dépendance est vide
            setOptions([]);
        }
    }, [loadOptions, name, dependsOn, dependencyValue, hasDependencyValue]);

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
                            disabled={disabled || loading || (dependsOn && !hasDependencyValue)}
                            value={field.value}
                        >
                            <SelectTrigger className=" bg-muted w-full border-border text-foreground focus:ring-zinc-700 h-12">
                                <SelectValue placeholder={loading 
                                    ? "Chargement..." 
                                    : (dependsOn && !hasDependencyValue)
                                        ? `Sélectionnez d'abord un ${dependsOn}`
                                        : placeholder || `Select ${labelText.toLowerCase()}`} 
                                />
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
                                {loading && (
                                    <SelectItem value="loading" disabled>
                                        Chargement des options...
                                    </SelectItem>
                                )}
                                {!loading && options.length === 0 && (
                                    <SelectItem value="empty" disabled>
                                        Aucune option disponible
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    )
}