import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { auth } from '../common/firebase';
import useStore from '../store';
import { Button } from './button';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import api from '../common/apiCall';
import google from '../assets/google.png';
import { BiLoader } from 'react-icons/bi';

// eslint-disable-next-line react/prop-types
export const SocialLogin = ({ isLoading, setIsLoading }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = useAuthState(auth);
  const [selectedProvider, setSelectedProvider] = useState();
  const { setCredential } = useState((state) => state);
  const navigate = useNavigate();

  const authWithGoogle = async () => {
    // let user = null;
    const provider = new GoogleAuthProvider();
    setSelectedProvider('google');
    try {
      const res = await signInWithPopup(auth, provider);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const savingAuth = async () => {
      try {
        const userData = {
          name: user.displayName,
          email: user.email,
          provider: user.selectedProvider,
          uid: user.uid,
        };
        setIsLoading(true);
        // eslint-disable-next-line no-undef
        const { data: res } = await api.post('/auth/sign-in', userData);

        if (res?.user) {
          toast.success(res?.message);
          const userInfo = { ...res?.user, token: res?.token };
          localStorage.setItem('user', JSON.stringify(userInfo));
          setCredential(userInfo);

          setTimeout(() => {
            navigate('/overview');
          }, 1500);
        }
      } catch (err) {
        console.log(err);
        toast.error(err?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      savingAuth();
    }
  }, [user?.uid]);

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={authWithGoogle}
        disabled={isLoading}
        variant="outline"
        className={
          'w-full text-sm font-normal dark:bg-transparent dark:border-grey-300 dark:text-grey-300'
        }
        type="button"
      >
        {isLoading ? (
          <BiLoader className="text-2xl animate-spin text-white" />
        ) : (
          <div>
            <img src={google} className="w-5 mr-3" />
            `` Continue with google
          </div>
        )}
      </Button>
    </div>
  );
};
