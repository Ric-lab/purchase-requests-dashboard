import { NewPasswordForm } from "@/components/auth/new-password-form";
import { Suspense } from "react";

export default function NewPasswordPage() {
    return (
        <div className="flex h-full items-center justify-center">
            <Suspense fallback={<div>Loading...</div>}>
                <NewPasswordForm />
            </Suspense>
        </div>
    );
}
