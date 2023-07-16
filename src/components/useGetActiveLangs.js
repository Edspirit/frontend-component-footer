import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getLocale } from '@edx/frontend-platform/i18n';
import { useEffect, useState } from 'react';

const useGetActiveLangs = () => {
  const [activeLangs, setActiveLangs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState(getLocale());

  useEffect(() => {
    const fetchActiveLangs = async () => {
      setLoading(true);
      const client = getAuthenticatedHttpClient();
      const baseUrl = getConfig().LMS_BASE_URL;
      const response = await client.get(
        `${baseUrl}/admin-console/api/active-langs/`,
      );
      const newActiveLangs = JSON.parse(response.data);
      const newLocale = newActiveLangs && newActiveLangs[0] && newActiveLangs[0].code;
      setActiveLangs(activeLangs);
      setLocale(newLocale);
      setLoading(false);
    };
    if (getConfig().LMS_BASE_URL) {
      fetchActiveLangs();
    }
  }, [getConfig().LMS_BASE_URL]);
  return {
    activeLangs,
    loading,
    locale,
  };
};
export default useGetActiveLangs;
