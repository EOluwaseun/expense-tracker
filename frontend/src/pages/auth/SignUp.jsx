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

const RegisterSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  firstName: z
    .string({ required_error: 'Name is required' })
    .min(3, 'name must be more than 3 character'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be atleat 8 characters'),
});

function SignUp() {
  const { user } = useStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // eslint-disable-next-line no-undef
    resolver: zodResolver(RegisterSchema),
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
      const { data: res } = await api.post('/auth/sign-up', data);
      if (res?.user) {
        toast.success('Account created succesfully, You can now login');
        setTimeout(() => {
          navigate('/sign-in');
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
              create account
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
                  id="firstName"
                  label="Name"
                  // name="firstName"
                  type="text"
                  placeholder="Enter your name here"
                  error={errors?.firstName?.message}
                  {...register('firstName')}
                  className="text-sm border dark:border-grey-800 dark:bg-transparent dark:placeholder:text-grey-800 dark:text-grey-800"
                />
                <Input
                  disabled={loading}
                  id="email"
                  label="Email"
                  // name="email"
                  type="email"
                  placeholder="Enter your email here"
                  error={errors?.email?.message}
                  {...register('email')}
                  className="text-sm border dark:border-grey-800 dark:bg-transparent dark:placeholder:text-grey-800 dark:text-grey-800"
                />{' '}
                <Input
                  disabled={loading}
                  id="password"
                  label="Password"
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
                  'create an account'
                )}
              </Button>
            </form>
            <CardFooter className={'justify-center gap-2 mt-1'}>
              <p className="text-sm text-grey-600">Already have an account?</p>
              <Link
                to={'/sign-in'}
                className="text-sm font-semibold text-violet-600 hover:underline"
              >
                Sign in
              </Link>
            </CardFooter>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

export default SignUp;
