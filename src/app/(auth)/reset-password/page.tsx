import {Suspense} from "react";
import {ResetPasswordContent} from "@/app/(auth)/reset-password/reset-password-page";
import {ResetPasswordLoading} from "@/app/(auth)/reset-password/reset-password.loading";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<ResetPasswordLoading />}>
            <ResetPasswordContent />
        </Suspense>
    )
}