'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AtelierExperienceSection } from '@/components/AtelierExperienceSection';
import { AiPlannerWizard } from '@/components/AiPlannerWizard';
import { InventoryStudio } from '@/components/InventoryStudio';
import { AiGenerationModal } from '@/components/AiGenerationModal';
import { DynamicInvitationBuilder } from '@/components/DynamicInvitationBuilder';
import { PackagesSection } from '@/components/PackagesSection';
import { PortfolioSection } from '@/components/PortfolioSection';
import { ServicesSection } from '@/components/ServicesSection';
import { RequirementFormModal } from '@/components/RequirementFormModal';
import { WhatsAppChatbotWidget } from '@/components/WhatsAppChatbotWidget';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home');

  // Modals
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [aiGenOpen, setAiGenOpen] = useState(false);
  const [rfqOpen, setRfqOpen] = useState(false);

  // Selected items for AI visualizer
  const [aiSelectedItems, setAiSelectedItems] = useState<any[]>([]);
  const [rfqInitialData, setRfqInitialData] = useState<any | null>(null);

  const handleOpenAiGeneration = (items: any[]) => {
    setAiSelectedItems(items);
    setAiGenOpen(true);
  };

  const handleOpenRfqWithCart = (cartItems: any[]) => {
    setRfqInitialData({ cartItems });
    setRfqOpen(true);
  };

  const handleOpenRfqWithPackage = (pkgName?: string) => {
    setRfqInitialData({ occasion: pkgName || 'Wedding' });
    setRfqOpen(true);
  };

  const handleOpenRfqWithPlannerData = (data: any) => {
    setRfqInitialData(data);
    setRfqOpen(true);
  };

  return (
    <main className="min-h-screen bg-fs-navy text-fs-cream">
      {/* Fixed Luxury Navigation */}
      <Navbar
        onOpenPlanner={() => setPlannerOpen(true)}
        onOpenRfq={() => handleOpenRfqWithPackage()}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Hero Section */}
      <HeroSection
        onOpenPlanner={() => setPlannerOpen(true)}
        onExploreStudio={() => {
          const el = document.getElementById('studio');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* The Four Seasons Experience: How Mastery meets AI */}
      <AtelierExperienceSection onOpenPlanner={() => setPlannerOpen(true)} />

      {/* Dynamic Inventory Studio & Combination Builder */}
      <InventoryStudio
        onTriggerAiGeneration={handleOpenAiGeneration}
        onOpenRfqWithCart={handleOpenRfqWithCart}
      />

      {/* Dynamic Digital Invitations Atelier */}
      <DynamicInvitationBuilder />

      {/* Curated Luxury Packages */}
      <PackagesSection
        onSelectPackage={(pkg) => handleOpenRfqWithPackage(pkg.name)}
        onOpenRfq={handleOpenRfqWithPackage}
      />

      {/* Real Celebrations Portfolio */}
      <PortfolioSection />

      {/* Turnkey Services */}
      <ServicesSection onOpenRfq={handleOpenRfqWithPackage} />

      {/* Luxury Footer */}
      <Footer />

      {/* AI Planner Questionnaire Wizard Modal */}
      <AiPlannerWizard
        isOpen={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        onOpenRfqWithData={handleOpenRfqWithPlannerData}
      />

      {/* Asynchronous AI Generation Studio Modal */}
      <AiGenerationModal
        isOpen={aiGenOpen}
        onClose={() => setAiGenOpen(false)}
        selectedItems={aiSelectedItems}
      />

      {/* Structured Customer Requirement & RFQ Modal */}
      <RequirementFormModal
        isOpen={rfqOpen}
        onClose={() => setRfqOpen(false)}
        initialData={rfqInitialData}
      />

      {/* Floating WhatsApp Integration & AI Concierge Chatbot Widget */}
      <WhatsAppChatbotWidget
        onOpenPlanner={() => setPlannerOpen(true)}
        onOpenRfq={() => handleOpenRfqWithPackage()}
      />
    </main>
  );
}

