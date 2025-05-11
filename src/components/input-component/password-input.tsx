import { Control, FieldValues, Path, useWatch } from "react-hook-form";
import { Input } from "../ui/input";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from "../ui/form";
import { useState, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type CustomFormPasswordProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    labelText?: string;
    showStrength?: boolean;
};

export function CustomFormPassword<T extends FieldValues>({
                                                              name,
                                                              control,
                                                              labelText,
                                                              showStrength = true
                                                          }: CustomFormPasswordProps<T>) {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const password = useWatch({ control, name }) || "";

    const toggleVisibility = () => setIsVisible((prevState) => !prevState);

    const checkStrength = (pass: string) => {
        const requirements = [
            { regex: /.{8,}/, text: "8+ caractères" },
            { regex: /[0-9]/, text: "Nombre" },
            { regex: /[a-z]/, text: "Miniscule" },
            { regex: /[A-Z]/, text: "Majuscule" },
        ];
        return requirements.map((req) => ({ met: req.regex.test(pass), text: req.text }));
    };

    const strength = checkStrength(password);
    const strengthScore = useMemo(() => strength.filter((req) => req.met).length, [strength]);

    const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-border";
        if (score <= 1) return "bg-red-500";
        if (score <= 2) return "bg-orange-500";
        if (score === 3) return "bg-amber-500";
        return "bg-emerald-500";
    };

    const getStrengthText = (score: number) => {
        if (score === 0) return "";
        if (score <= 2) return "Faible";
        if (score === 3) return "Moyen";
        return "Fort";
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="capitalize">{labelText || name}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                {...field}
                                id={name}
                                placeholder="••••••••"
                                type={isVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="pe-9  pl-4 h-14 rounded-[15px] bg-muted  transition-all duration-300 "
                                onFocus={() => setIsHovered(true)}
                                onBlur={() => setIsHovered(false)}
                            />
                            <button
                                className="absolute cursor-pointer inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                type="button"
                                onClick={toggleVisibility}
                                aria-label={isVisible ? "Hide password" : "Show password"}
                            >
                                {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </FormControl>

                    {showStrength && (
                        <div className={`mt-2 transition-all duration-300 ${isHovered || password ? 'opacity-100' : 'opacity-0 h-0'}`}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">
                                    {password ? getStrengthText(strengthScore) : "Entrez un mot de passe"}
                                </span>
                                {password && (
                                    <span className="text-xs font-medium" style={{ color: getStrengthColor(strengthScore) }}>
                                        {strengthScore}/4
                                    </span>
                                )}
                            </div>

                            <div className="mb-2 h-1 w-full rounded-full bg-border">
                                <div
                                    className={`h-full transition-all duration-500 ${getStrengthColor(strengthScore)}`}
                                    style={{ width: password ? `${(strengthScore / 4) * 100}%` : '0%' }}
                                />
                            </div>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex justify-center gap-1">
                                        {strength.map((req, index) => (
                                            <span
                                                key={index}
                                                className={`w-2 h-2 rounded-full ${req.met ? 'bg-emerald-500' : 'bg-muted'}`}
                                            />
                                        ))}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs p-2">
                                    <ul className="space-y-1">
                                        {strength.map((req, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                {req.met ? (
                                                    <Check size={12} className="text-emerald-500" />
                                                ) : (
                                                    <X size={12} className="text-muted-foreground" />
                                                )}
                                                <span>{req.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )}

                    <FormMessage className="text-xs" />
                </FormItem>
            )}
        />
    );
}