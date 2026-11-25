'use client';

import React from 'react';
import { PageLayout } from '@/components/PageLayout';
import { PackagesSection } from '@/components/PackagesSection';

export default function PackagesPage() {
  return (
    <PageLayout>
      {({ openRfq }) => (
        <PackagesSection
          onSelectPackage={(pkg) => openRfq(pkg.name)}
          onOpenRfq={(pkgName) => openRfq(pkgName)}
        />
      )}
    </PageLayout>
  );
}

