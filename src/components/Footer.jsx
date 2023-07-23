import { injectIntl } from '@edx/frontend-platform/i18n';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import FooterSection from './Footer/FooterSection';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Set staleTime to 5 minutes
      staleTime: 5 * 60 * 1000,
      // Set cacheTime to 60 minutes
      cacheTime: 60 * 60 * 1000,
    },
  },
});
const SiteFooter = () => (
  <QueryClientProvider client={queryClient}>
    <FooterSection />
  </QueryClientProvider>
);

export default injectIntl(SiteFooter);
