import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getLocale } from '@edx/frontend-platform/i18n';
import { useState } from 'react';
import { useQuery } from 'react-query';

const useGetActiveLangs = () => {
  const [locale, setLocale] = useState(getLocale());
  const fetchActiveLangs = async () => {
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    const response = await client.get(`${baseUrl}/admin-console/api/active-langs/`);
    const activeLangs = JSON.parse(response.data);
    const newLocale = activeLangs && activeLangs[0] && activeLangs[0].code;
    setLocale(newLocale);
    return activeLangs;
  };
  const { data, isLoading } = useQuery('ActiveLangs', fetchActiveLangs);

  return {
    activeLangs: data,
    loading: isLoading,
    locale,
  };
};
export default useGetActiveLangs;
