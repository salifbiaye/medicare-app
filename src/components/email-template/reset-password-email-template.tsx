// components/email-templates/reset-password-email.tsx
import * as React from 'react'

interface ResetPasswordEmailProps {
    firstName: string
    resetLink: string
}

export const ResetPasswordEmailTemplate: React.FC<Readonly<ResetPasswordEmailProps>> = ({
                                                                                            firstName,
                                                                                            resetLink
                                                                                        }) => (
    <div style={containerStyle}>
        {/* En-tête avec logo ShadowFit */}
        <div style={headerStyle}>
            <div style={logoContainerStyle}>
                <span style={logoTextStyle}>ShadowFit</span>
            </div>
            <h1 style={titleStyle}>Réinitialisation de votre mot de passe</h1>
        </div>

        {/* Image d'illustration premium */}
        <div style={heroImageStyle}>
            <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2015%20avr.%202025%2C%2023_37_15-PKix33zT5NtYFNyko9jZCtHsDy9nmz.png"
                alt="Fitness motivation"
                style={imageStyle}
            />
        </div>

        {/* Contenu principal */}
        <div style={contentStyle}>
            <p style={greetingStyle}>Bonjour {firstName},</p>

            <p style={instructionStyle}>
                Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour procéder :
            </p>

            {/* Bouton/Lien de réinitialisation */}
            <div style={buttonContainerStyle}>
                <a href={resetLink} style={buttonStyle}>
                    Réinitialiser mon mot de passe
                </a>
            </div>

            <p style={validityStyle}>Ce lien est valide pendant 24 heures</p>

            <p style={secondaryInstructionStyle}>
                Si vous ne parvenez pas à cliquer sur le bouton, copiez et collez le lien suivant dans votre navigateur :
            </p>

            <div style={linkContainerStyle}>
                <a href={resetLink} style={linkStyle}>
                    {resetLink}
                </a>
            </div>

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
                Si vous n&apos;avez pas demandé cette réinitialisation, veuillez ignorer cet email.
            </p>
            <p style={copyrightStyle}>© {new Date().getFullYear()} ShadowFit. Tous droits réservés.</p>
        </div>
    </div>
)

// Styles avec la couleur de fond bleu foncé (#04131d)
const containerStyle = {
    width: '100%',
    margin: '0',
    backgroundColor: '#04131d',
    color: '#f4f4f5',
    fontFamily: '"Inter", sans-serif',
    colorScheme: 'dark' as const,
}

const headerStyle = {
    padding: '32px 24px',
    textAlign: 'center' as const,
    background: 'linear-gradient(135deg, #07212e 0%, #04131d 100%)',
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
    background: 'linear-gradient(to right, #5d8aff, #a1c4ff)',
    WebkitBackgroundClip: 'text' as const,
    backgroundClip: 'text' as const,
    color: 'transparent',
    letterSpacing: '1px'
}

const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0',
    color: '#e1f0ff'
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
    color: '#a1c4ff'
}

const instructionStyle = {
    fontSize: '15px',
    lineHeight: '1.5',
    marginBottom: '24px',
    color: '#d1e3ff'
}

const buttonContainerStyle = {
    margin: '32px 0',
    textAlign: 'center' as const
}

const buttonStyle = {
    backgroundColor: '#5d8aff',
    color: '#ffffff',
    padding: '16px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600' as const,
    fontSize: '16px',
    display: 'inline-block',
    transition: 'background-color 0.3s ease',
    ':hover': {
        backgroundColor: '#3a6ed8'
    }
}

const validityStyle = {
    fontSize: '14px',
    color: '#89b6e1',
    textAlign: 'center' as const,
    margin: '24px 0'
}

const secondaryInstructionStyle = {
    fontSize: '14px',
    color: '#a1c4ff',
    margin: '24px 0 8px 0'
}

const linkContainerStyle = {
    backgroundColor: 'rgba(7, 33, 46, 0.7)',
    padding: '16px',
    borderRadius: '8px',
    margin: '16px 0',
    wordBreak: 'break-all' as const
}

const linkStyle = {
    color: '#5d8aff',
    textDecoration: 'none',
    fontSize: '14px'
}

const quoteContainerStyle = {
    margin: '32px 0',
    padding: '20px',
    borderLeft: '3px solid #5d8aff',
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