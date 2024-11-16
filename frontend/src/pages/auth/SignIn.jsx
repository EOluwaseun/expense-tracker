/* eslint-disable react/prop-types */
import * as z from 'zod';
import useStore from '../../store';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../component/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { SocialLogin } from '../../component/socialLogin';
import Input from '../../component/input';
import { Button } from '../../component/button';
import { BiLoader } from 'react-icons/bi';
import api from '../../common/apiCall';
import { toast } from 'sonner';

const LoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  // firstName: z
  //   .string({ required_error: 'Name is required' })
  //   .min('name must be more than 1 character'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(3, 'Password is required'),
});

function SignIn() {
  const { user, setCredentials } = useStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // eslint-disable-next-line no-undef
    resolver: zodResolver(LoginSchema),
  });

  // navigate
  const navigate = useNavigate();
  const [loading, setLoading] = useState();

  useEffect(() => {
    //if user already login, then always take back to home page
    user && navigate('/');
  }, [user]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { data: res } = await api.post('/auth/sign-in', data);
      if (res?.user) {
        toast.success(res?.message);
        const userInfo = { ...res?.user, token: res?.token };
        localStorage.setItem('user', JSON.stringify(userInfo));

        setCredentials(userInfo);

        setTimeout(() => {
          navigate('/overview');
        }, 1500);
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen py-10">
      <Card className="w-[400px] bg-white dark:bg-black/20 shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <CardHeader className="py-0">
            <CardTitle className="mb-8 text-center dark:text-white">
              Sign in
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="mb-8 space-y-6">
                <SocialLogin isLoading={loading} setIsLoading={setLoading} />
                <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                  <hr className="w-1/2 border-black" />
                  <p>or</p>
                  <hr className="w-1/2 border-black" />
                </div>
                <Input
                  disabled={loading}
                  id="Email"
                  label="Email"
                  // name="Email"
                  type="email"
                  placeholder="Enter your email here"
                  error={errors?.email?.message}
                  {...register('email')}
                  className="text-sm border dark:border-grey-800 dark:bg-transparent dark:placeholder:text-grey-800 dark:text-grey-800"
                />{' '}
                <Input
                  disabled={loading}
                  id="password"
                  label="password"
                  // name="password"
                  type="password"
                  placeholder="Enter your password here"
                  error={errors?.password?.message}
                  {...register('password')}
                  className="text-sm border dark:border-grey-800 dark:bg-transparent dark:placeholder:text-grey-800 dark:text-grey-800"
                />
              </div>
              <Button
                type="submit"
                className={'w-full bg-violet-800'}
                disabled={loading}
              >
                {loading ? (
                  <BiLoader className="text-2xl animate-spin text-white" />
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
            <CardFooter className={'justify-center gap-2 mt-1'}>
              <p className="text-sm text-grey-600">Dont have an account?</p>
              <Link
                to={'/sign-up'}
                className="text-sm font-semibold text-violet-600 hover:underline"
              >
                Sign up
              </Link>
            </CardFooter>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

export default SignIn;
