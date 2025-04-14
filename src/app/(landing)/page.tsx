
import React from "react";
import CTASection from "@/features/landing/cta-section";
import HeroSection from "@/features/landing/hero-section";
import {HeaderSection} from "@/features/landing/header-section";
import FeatureSection from "@/features/landing/feature-section";
import WhyUsSection from "@/features/landing/why-us-section";
import PricingSection from "@/features/landing/pricing-section";
import FooterSection from "@/features/landing/footer-section";

export default function LandingPage() {
  return (
      <div className="flex flex-col min-h-screen ">
        {/* Navigation */}
        <HeaderSection />
        {/* Hero Section */}
        <HeroSection/>
        {/* Features Section */}
        <FeatureSection/>
        {/* WhyUS Section */}
        <WhyUsSection/>
        {/* Pricing Section */}
        <PricingSection/>
        {/* CTA Section */}

        {/* Footer */}
        <FooterSection/>
      </div>
  )
}
