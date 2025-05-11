// components/email-templates/otp-email.tsx
import * as React from 'react'

interface OtpEmailProps {
    firstName: string
    otp: string
    type: "email-verification" | "forget-password" | "sign-in"
}

export const OtpEmailTemplate: React.FC<Readonly<OtpEmailProps>> = ({
                                                                        firstName,
                                                                        otp,
                                                                        type
                                                                    }) => (
    <div style={containerStyle}>
        {/* En-tête avec logo Medicare */}
        <div style={headerStyle}>
            <div style={logoContainerStyle}>
                <span style={logoTextStyle}>Medicare</span>
            </div>
            <h1 style={titleStyle}>
                {type === 'email-verification'
                    ? 'Vérification de votre email'
                    : type === 'forget-password'
                        ? 'Réinitialisation de mot de passe'
                        : 'Connexion sécurisée'}
            </h1>
        </div>

        {/* Image d'illustration médicale */}
        <div style={heroImageStyle}>
            <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/otp-t1rVgbHQVuRnmLg6vOZ0To5fygIeKp.png"
                alt="Services médicaux"
                style={imageStyle}
            />
        </div>

        {/* Contenu principal */}
        <div style={contentStyle}>
            <p style={greetingStyle}>Bonjour {firstName},</p>

            <p style={instructionStyle}>
                {type === 'email-verification'
                    ? 'Utilisez le code suivant pour vérifier votre email :'
                    : type === 'forget-password'
                        ? 'Voici votre code pour réinitialiser votre mot de passe :'
                        : 'Utilisez ce code pour vous connecter à votre compte :'}
            </p>

            {/* Code OTP */}
            <div style={otpContainerStyle}>
                <span style={otpTextStyle}>{otp}</span>
            </div>

            <p style={validityStyle}>Ce code est valide pendant 15 minutes</p>

            {/* Message de santé */}
            <div style={healthTipContainerStyle}>
                <p style={healthTipTextStyle}>
                    Conseil santé : Pensez à mettre à jour régulièrement vos informations médicales pour un meilleur suivi.
                </p>
            </div>
        </div>

        {/* Pied de page */}
        <div style={footerStyle}>
            <p style={footerTextStyle}>
                Si vous n&apos;avez pas demandé ce code, veuillez ignorer cet email.
            </p>
            <p style={copyrightStyle}>© {new Date().getFullYear()} Medicare. Tous droits réservés.</p>
        </div>
    </div>
)

// Styles avec la nouvelle couleur de fond clair (#fef7ef)
const containerStyle = {
    width: '100%',
    margin: '0',
    backgroundColor: '#fef7ef', // Nouvelle couleur de fond clair
    color: '#333333',
    fontFamily: '"Inter", sans-serif',
    colorScheme: 'light' as const,
}

const headerStyle = {
    padding: '32px 24px',
    textAlign: 'center' as const,
    background: 'linear-gradient(135deg, #f8f1e8 0%, #fef7ef 100%)',
    borderBottom: '1px solid #e8d9c5'
}

const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px'
}

const logoTextStyle = {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    background: 'linear-gradient(to right, #2b6cb0, #4299e1)', // Dégradé bleu médical
    WebkitBackgroundClip: 'text' as const,
    backgroundClip: 'text' as const,
    color: 'transparent',
    letterSpacing: '1px'
}

const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0',
    color: '#2b6cb0' // Bleu médical
}

const heroImageStyle = {
    width: '100%',
    maxHeight: '100vh',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

const imageStyle = {
    width: '100%',
    height: 'auto',
    objectFit: 'contain' as const,
    display: 'block'
}

const contentStyle = {
    padding: '32px 24px',
    maxWidth: '800px',
    margin: '0 auto'
}

const greetingStyle = {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#2b6cb0' // Bleu médical
}

const instructionStyle = {
    fontSize: '15px',
    lineHeight: '1.5',
    marginBottom: '24px',
    color: '#4a5568'
}

const otpContainerStyle = {
    background: 'rgba(235, 248, 255, 0.7)', // Bleu clair semi-transparent
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    margin: '24px 0',
    border: '1px solid #bee3f8'
}

const otpTextStyle = {
    fontSize: '32px',
    fontWeight: 'bold' as const,
    letterSpacing: '4px',
    color: '#2b6cb0',
    display: 'inline-block'
}

const validityStyle = {
    fontSize: '14px',
    color: '#718096',
    textAlign: 'center' as const,
    margin: '24px 0'
}

const healthTipContainerStyle = {
    margin: '32px 0',
    padding: '20px',
    borderLeft: '3px solid #4299e1', // Bleu médical
    background: 'rgba(235, 248, 255, 0.5)'
}

const healthTipTextStyle = {
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '0',
    color: '#4a5568'
}

const footerStyle = {
    padding: '24px',
    textAlign: 'center' as const,
    background: '#f8f1e8',
    borderTop: '1px solid #e8d9c5'
}

const footerTextStyle = {
    fontSize: '12px',
    color: '#718096',
    marginBottom: '12px'
}

const copyrightStyle = {
    fontSize: '12px',
    color: '#2b6cb0',
    margin: '0'
}