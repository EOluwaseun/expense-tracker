import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import api from '../common/apiCall';
import { Input } from '@headlessui/react';
import { Button } from './button';
import { BiLoader } from 'react-icons/bi';

function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const changePasswordHandler = async (data) => {
    try {
      setLoading(true);
      const { data: res } = await api.put('/user/change-password', data);
      if (res?.user === 'success') {
        toast.success(res?.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || err?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="py-20">
      <form
        onSubmit={handleSubmit(changePasswordHandler)}
        className="space-y-4"
      >
        <div className="">
          <p className="text-xl font-bold text-black dark:text-white mb-1">
            Change Password
          </p>
          <span>
            This will be used to log into your account and complete high several
            actions
          </span>
          <div className="mt-6 space-y-6">
            <Input
              disabled={loading}
              //   id="currentPassword"
              label="Current Password"
              name="currentPassword"
              type="password"
              placeholder="Enter your current password"
              {...register('currentPassword', {
                required: 'Current Password required',
              })}
              error={
                errors?.currentPassword ? errors?.currentPassword?.message : ''
              }
              className="input-style text-sm border dark:border-grey-800 dark:bg-transparent dark:placeholder:text-grey-800 dark:text-grey-800"
            />
            <Input
              disabled={loading}
              //   id="newPassword"
              label="New Password"
              name="newPassword"
              type="password"
              placeholder="Enter your new password"
              error={errors?.newPassword ? errors?.newPassword?.message : ''}
              {...register('newPassword', {
                required: 'New Password required',
              })}
              className="input-style text-sm border dark:border-grey-800 dark:bg-transparent dark:placeholder:text-grey-800 dark:text-grey-800"
            />
            <Input
              disabled={loading}
              //   id="confirmPassword"
              label="Confrim Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              error={
                errors?.confirmPassword ? errors?.confirmPassword?.message : ''
              }
              {...register('confirmPassword', {
                required: 'Confrim Password required',
                validate: (val) => {
                  // eslint-disable-next-line no-undef
                  const { newPassword } = getValues();

                  return newPassword === val || 'Password doest not matched';
                },
              })}
              className="input-style text-sm border dark:border-grey-800 dark:bg-transparent dark:placeholder:text-grey-800 dark:text-grey-800"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 justify-end pb-10 border-gray-200 dark:border-gray-300">
          <Button
            type="reset"
            className={'w-full bg-violet-800'}
            disabled={loading}
          >
            {loading ? (
              <BiLoader className="text-2xl animate-spin text-white" />
            ) : (
              'Reset'
            )}
          </Button>

          <Button
            type="submit"
            className={'w-full bg-violet-800'}
            disabled={loading}
          >
            {loading ? (
              <BiLoader className="text-2xl animate-spin text-white" />
            ) : (
              'Change Password'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
