import {Header} from "@/features/landing/header";
import HeroSection from "@/features/landing/hero-section";

import {Footer} from "@/features/landing/footer";
import {AnalyseOndesCerebrales} from "@/features/landing/analyse-ondes-cerebrales";
import {AnalyseOrganes} from "@/features/landing/analyse-organes";
import {RejoignezNousSection} from "@/features/landing/rejoignez-nous-section";
import {SecuriteSection} from "@/features/landing/securite-section";
import {AnalyticsSection} from "@/features/landing/analytics-section";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <main className="container mx-auto px-4 py-8">
                    <AnalyseOndesCerebrales/>
                    <AnalyseOrganes/>
                    <SecuriteSection/>
                    <AnalyticsSection/>
                    <RejoignezNousSection/>
                </main>

            </main>
            <Footer/>
        </div>
    )
}
