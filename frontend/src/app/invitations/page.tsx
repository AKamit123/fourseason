'use client';

import React from 'react';
import { PageLayout } from '@/components/PageLayout';
import { DynamicInvitationBuilder } from '@/components/DynamicInvitationBuilder';

export default function InvitationsPage() {
  return (
    <PageLayout>
      {() => <DynamicInvitationBuilder />}
    </PageLayout>
  );
}

