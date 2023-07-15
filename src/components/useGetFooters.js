import { getConfig } from '@edx/frontend-platform';
import { useEffect, useState } from 'react';

const useGetFooters = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const getFooters = async () => {
    try {
      const response = await fetch(
        `${getConfig().LMS_BASE_URL}/admin-console/api/footer-section/`,
      );
      if (!response.ok) {
        throw new Error('fetch footer not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    const fetchFooters = async () => {
      const data = await getFooters();
      setFooterData(data);
      setLoading(false);
    };

    if (getConfig().LMS_BASE_URL) {
      fetchFooters();
    }
  }, [getConfig().LMS_BASE_URL]);
  return {
    footerData,
    loading,
  };
};
export default useGetFooters;
