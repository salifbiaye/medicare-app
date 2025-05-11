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
        autoSignIn: false ,
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
                from: 'no-reply@shadowfit-app.space',
                to: user.email,
                subject: "Password Reset",
                react: await ResetPasswordEmailTemplate({firstName: user.name, resetLink: url}),
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
        secure: process.env.NODE_ENV === "production", // HTTPS in production
        sameSite: "lax",
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                try {
                    let subject = "";
                    let text = "";

                    if (type === "email-verification") {
                        subject = "Email Verification";
                        text = `Your verification code is: ${otp}`;
                    } else if (type === "forget-password") {
                        subject = "Réinitialisation de mot de passe";
                        text = `Votre code OTP pour réinitialiser votre mot de passe est : ${otp}`;
                    } else {
                        subject = "Security Code";
                        text = `Your security code is: ${otp}`;
                    }

                    await resend.emails.send({
                        from: 'no-reply@shadowfit-app.space',
                        to: email,
                        subject: subject,
                        react: await OtpEmailTemplate({firstName: email, otp: otp, type: type}),
                    });
                } catch (error) {
                    console.error("Error sending OTP:", error);
                    throw new Error("Failed to send OTP");
                }
            },
        })
    ]

});