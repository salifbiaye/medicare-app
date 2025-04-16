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
        {/* En-tête avec logo ShadowFit */}
        <div style={headerStyle}>
            <div style={logoContainerStyle}>
                <span style={logoTextStyle}>ShadowFit</span>
            </div>
            <h1 style={titleStyle}>
                {type === 'email-verification'
                    ? 'Vérification de votre email'
                    : 'Réinitialisation de mot de passe'}
            </h1>
        </div>

        {/* Image d'illustration premium */}
        <div style={heroImageStyle}>
            <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2015%20avr.%202025%2C%2021_24_00-CLOJOHBJWqb3ScewuvpRwBrJenaXey.png"
                alt="Fitness motivation"
                style={imageStyle}
            />
        </div>

        {/* Contenu principal */}
        <div style={contentStyle}>
            <p style={greetingStyle}>Bonjour {firstName},</p>

            <p style={instructionStyle}>
                {type === 'email-verification'
                    ? 'Utilisez le code suivant pour vérifier votre email :'
                    : 'Voici votre code pour réinitialiser votre mot de passe :'}
            </p>

            {/* Code OTP */}
            <div style={otpContainerStyle}>
                <span style={otpTextStyle}>{otp}</span>
            </div>

            <p style={validityStyle}>Ce code est valide pendant 15 minutes</p>

            {/* Citation motivante */}
            <div style={quoteContainerStyle}>
                <p style={quoteTextStyle}>
                    &#34;La discipline est le pont entre les objectifs et les accomplishments.&#34;
                </p>
                <p style={quoteAuthorStyle}>—— Jim Rohn</p>
            </div>
        </div>

        {/* Pied de page */}
        <div style={footerStyle}>
            <p style={footerTextStyle}>
                Si vous n&apos;avez pas demandé ce code, veuillez ignorer cet email.
            </p>
            <p style={copyrightStyle}>© {new Date().getFullYear()} ShadowFit. Tous droits réservés.</p>
        </div>
    </div>
)

// Styles avec la nouvelle couleur de fond bleu foncé (#04131d)
const containerStyle = {
    width: '100%',
    margin: '0',
    backgroundColor: '#04131d', // Nouvelle couleur bleu foncé
    color: '#f4f4f5',
    fontFamily: '"Inter", sans-serif',
    colorScheme: 'dark' as const,
}

const headerStyle = {
    padding: '32px 24px',
    textAlign: 'center' as const,
    background: 'linear-gradient(135deg, #07212e 0%, #04131d 100%)', // Dégradé adapté
    borderBottom: '1px solid #0a2a3a'
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
    background: 'linear-gradient(to right, #5d8aff, #a1c4ff)', // Dégradé bleu
    WebkitBackgroundClip: 'text' as const,
    backgroundClip: 'text' as const,
    color: 'transparent',
    letterSpacing: '1px'
}

const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0',
    color: '#e1f0ff' // Bleu clair pour le titre
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
    color: '#a1c4ff' // Bleu clair
}

const instructionStyle = {
    fontSize: '15px',
    lineHeight: '1.5',
    marginBottom: '24px',
    color: '#d1e3ff'
}

const otpContainerStyle = {
    background: 'rgba(7, 33, 46, 0.7)', // Bleu foncé semi-transparent
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    margin: '24px 0',
    border: '1px solid #1a4b66'
}

const otpTextStyle = {
    fontSize: '32px',
    fontWeight: 'bold' as const,
    letterSpacing: '4px',
    color: '#ffffff',
    display: 'inline-block'
}

const validityStyle = {
    fontSize: '14px',
    color: '#89b6e1',
    textAlign: 'center' as const,
    margin: '24px 0'
}

const quoteContainerStyle = {
    margin: '32px 0',
    padding: '20px',
    borderLeft: '3px solid #5d8aff', // Bleu vif
    background: 'rgba(7, 33, 46, 0.5)'
}

const quoteTextStyle = {
    fontStyle: 'italic' as const,
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '0 0 8px 0',
    color: '#d1e3ff'
}

const quoteAuthorStyle = {
    fontSize: '14px',
    color: '#89b6e1',
    margin: '0'
}

const footerStyle = {
    padding: '24px',
    textAlign: 'center' as const,
    background: '#07212e',
    borderTop: '1px solid #0a2a3a'
}

const footerTextStyle = {
    fontSize: '12px',
    color: '#89b6e1',
    marginBottom: '12px'
}

const copyrightStyle = {
    fontSize: '12px',
    color: '#5d8aff',
    margin: '0'
}