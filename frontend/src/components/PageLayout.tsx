'use client';

import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AiPlannerWizard } from './AiPlannerWizard';
import { RequirementFormModal } from './RequirementFormModal';
import { WhatsAppChatbotWidget } from './WhatsAppChatbotWidget';

interface PageLayoutProps {
  children: (helpers: {
    openPlanner: () => void;
    openRfq: (data?: any) => void;
  }) => React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [rfqOpen, setRfqOpen] = useState(false);
  const [rfqData, setRfqData] = useState<any | null>(null);

  const openRfq = (data?: any) => {
    if (typeof data === 'string') {
      setRfqData({ occasion: data });
    } else if (data) {
      setRfqData(data);
    } else {
      setRfqData(null);
    }
    setRfqOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1E1A16] flex flex-col">
      <Navbar
        onOpenPlanner={() => setPlannerOpen(true)}
        onOpenRfq={() => openRfq()}
      />

      <div className="flex-1 pt-20 sm:pt-24">
        {children({
          openPlanner: () => setPlannerOpen(true),
          openRfq,
        })}
      </div>

      <Footer />

      <AiPlannerWizard
        isOpen={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        onOpenRfqWithData={(data) => openRfq(data)}
      />

      <RequirementFormModal
        isOpen={rfqOpen}
        onClose={() => setRfqOpen(false)}
        initialData={rfqData}
      />

      <WhatsAppChatbotWidget
        onOpenPlanner={() => setPlannerOpen(true)}
        onOpenRfq={() => openRfq()}
      />
    </main>
  );
};

