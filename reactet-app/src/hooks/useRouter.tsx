import { useContext } from 'react';
import { __RouterContext } from 'react-router';

const useRouter = () => {
  return useContext(__RouterContext);
};
export default useRouter;
