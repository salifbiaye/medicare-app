import {Suspense} from "react";
import {VerifyEmailContent} from "@/app/(auth)/verify-email/verify-email-page";
import {VerifyEmailLoading} from "@/app/(auth)/verify-email/verify-email-loading";

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<VerifyEmailLoading />}>
            <VerifyEmailContent />
        </Suspense>
    )
}