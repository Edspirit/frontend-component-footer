import { getConfig } from '@edx/frontend-platform';
import { useQuery } from 'react-query';
import axios from 'axios';

const useGetDynamicFeatures = () =>
  useQuery({
    queryKey: ['dynamicfeatures'],
    queryFn: () =>
      axios
        .get(
          `${getConfig().LMS_BASE_URL}/admin-console/api/dynamic-features/`,
          {}
        )
        .then((response) => response.data),
  });

export default useGetDynamicFeatures;
