import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {resend} from "@/lib/resend";
import {emailOTP} from "better-auth/plugins";
import {OtpEmailTemplate} from "@/components/email-template/otp-email-template";
import {ResetPasswordEmailTemplate} from "@/components/email-template/reset-password-email-template";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        password: {
            hash: async (password: string): Promise<string> => {
                const salt = await bcrypt.genSalt(10);
                return await bcrypt.hash(password, salt);
            },
            verify: async ({ password, hash }: { password: string; hash: string }): Promise<boolean> => {
                return await bcrypt.compare(password, hash);
            }
        },
        sendResetPassword: async ({user, url}) => {
            await resend.emails.send({
                from: 'Acme <onboarding@resend.dev>',
                to: user.email,
                subject: "Réinitialisation du mot de passe",
                react: ResetPasswordEmailTemplate({firstName: user.name, resetLink: url}),
            });
        }

    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            redirectUri: process.env.GITHUB_REDIRECT_URI as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            redirectUri: process.env.GOOGLE_REDIRECT_URI as string,
        }
    },
    cookieOptions: {
        secure: process.env.NODE_ENV === "production", // HTTPS en production
        sameSite: "lax",
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                try {
                    let subject = "";
                    let text = "";

                    if (type === "email-verification") {
                        subject = "Vérification de votre email";
                        text = `Votre code de vérification est : ${otp}`;
                    } else if (type === "forget-password") {
                        subject = "Réinitialisation de mot de passe";
                        text = `Votre code OTP pour réinitialiser votre mot de passe est : ${otp}`;
                    } else {
                        subject = "Code de sécurité";
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        text = `Votre code de sécurité est : ${otp}`;
                    }

                    await resend.emails.send({
                        from: 'Acme <onboarding@resend.dev>',
                        to: email,
                        subject: subject,
                        react: OtpEmailTemplate({firstName: email, otp: otp, type: type}),

                    });

                    return { success: true };
                } catch (error) {
                    console.error("Erreur lors de l'envoi de l'OTP:", error);
                    return { success: false, error: "Failed to send OTP" };
                }
            },
        })
    ]

});