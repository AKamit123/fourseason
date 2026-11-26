'use client';

import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { InventoryStudio } from '@/components/InventoryStudio';
import { AiGenerationModal } from '@/components/AiGenerationModal';

export default function StudioPage() {
  const [aiGenOpen, setAiGenOpen] = useState(false);
  const [aiSelectedItems, setAiSelectedItems] = useState<any[]>([]);

  return (
    <PageLayout>
      {({ openRfq }) => (
        <>
          <InventoryStudio
            onTriggerAiGeneration={(items) => {
              setAiSelectedItems(items);
              setAiGenOpen(true);
            }}
            onOpenRfqWithCart={(cartItems, pricingBreakdown) => openRfq({ cartItems, pricingBreakdown })}
          />
          <AiGenerationModal
            isOpen={aiGenOpen}
            onClose={() => setAiGenOpen(false)}
            selectedItems={aiSelectedItems}
          />
        </>
      )}
    </PageLayout>
  );
}

