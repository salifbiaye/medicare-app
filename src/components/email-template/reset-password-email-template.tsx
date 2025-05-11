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
        {/* En-tête avec logo Medicare */}
        <div style={headerStyle}>
            <div style={logoContainerStyle}>
                <span style={logoTextStyle}>Medicare</span>
            </div>
            <h1 style={titleStyle}>Réinitialisation de votre mot de passe</h1>
        </div>

        {/* Image d'illustration médicale */}
        <div style={heroImageStyle}>
            <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reset-zaLAXd8cfxUCt388Kya6bXHlCoeV3c.png"
                alt="Sécurité médicale"
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

            {/* Message de sécurité */}
            <div style={securityTipContainerStyle}>
                <p style={securityTipTextStyle}>
                    Conseil de sécurité : Ne partagez jamais vos identifiants et changez régulièrement votre mot de passe pour protéger vos données médicales.
                </p>
            </div>
        </div>

        {/* Pied de page */}
        <div style={footerStyle}>
            <p style={footerTextStyle}>
                Si vous n&apos;avez pas demandé cette réinitialisation, veuillez ignorer cet email.
            </p>
            <p style={copyrightStyle}>© {new Date().getFullYear()} Medicare. Tous droits réservés.</p>
        </div>
    </div>
)

// Styles avec la nouvelle couleur de fond clair (#fef7ef)
const containerStyle = {
    width: '100%',
    margin: '0',
    backgroundColor: '#fef7ef',
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
    background: 'linear-gradient(to right, #2b6cb0, #4299e1)',
    WebkitBackgroundClip: 'text' as const,
    backgroundClip: 'text' as const,
    color: 'transparent',
    letterSpacing: '1px'
}

const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0',
    color: '#2b6cb0'
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
    color: '#2b6cb0'
}

const instructionStyle = {
    fontSize: '15px',
    lineHeight: '1.5',
    marginBottom: '24px',
    color: '#4a5568'
}

const buttonContainerStyle = {
    margin: '32px 0',
    textAlign: 'center' as const
}

const buttonStyle = {
    backgroundColor: '#4299e1',
    color: '#ffffff',
    padding: '16px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600' as const,
    fontSize: '16px',
    display: 'inline-block',
    transition: 'background-color 0.3s ease',
    ':hover': {
        backgroundColor: '#2b6cb0'
    }
}

const validityStyle = {
    fontSize: '14px',
    color: '#718096',
    textAlign: 'center' as const,
    margin: '24px 0'
}

const secondaryInstructionStyle = {
    fontSize: '14px',
    color: '#4a5568',
    margin: '24px 0 8px 0'
}

const linkContainerStyle = {
    backgroundColor: 'rgba(235, 248, 255, 0.7)',
    padding: '16px',
    borderRadius: '8px',
    margin: '16px 0',
    wordBreak: 'break-all' as const,
    border: '1px solid #bee3f8'
}

const linkStyle = {
    color: '#2b6cb0',
    textDecoration: 'none',
    fontSize: '14px'
}

const securityTipContainerStyle = {
    margin: '32px 0',
    padding: '20px',
    borderLeft: '3px solid #4299e1',
    background: 'rgba(235, 248, 255, 0.5)'
}

const securityTipTextStyle = {
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