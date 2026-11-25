'use client';

import React from 'react';
import { PageLayout } from '@/components/PageLayout';
import { ServicesSection } from '@/components/ServicesSection';

export default function ServicesPage() {
  return (
    <PageLayout>
      {({ openRfq }) => <ServicesSection onOpenRfq={(svc) => openRfq(svc)} />}
    </PageLayout>
  );
}

