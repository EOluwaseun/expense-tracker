import ChangePassword from '../component/ChangePassword';
import SettingsForm from '../component/SettingsForm';
import Title from '../component/Title';
import useStore from '../store';

function Settings() {
  const { user } = useStore((state) => state);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-4xl px-4 py-4 my-6 shadow-lg bg-gray-50 dark:bg-black/30 md:px-10 md:my-10">
        <div className="mt-6 border-b-2 border-gray-200 dark:border-gray-800">
          <Title title={'General Settings'} />
        </div>
        <div className="py-10">
          <p className="text-lg font-bold text-black dark:text-white">
            Profile Information
          </p>
          <div className="flex items-center gap-4 my-8">
            <div className="flex items-center justify-center w-10 h-10 text-white text-2xl font-bold rounded-full cursor-pointer bg-violet-600">
              {/* get first character of user */}
              <p>{user?.firstname.charAt(0)}</p>
            </div>
            <p className="text-2xl font-semibold text-black dark:text-gray-400">
              {user?.firstname}
            </p>
          </div>
        </div>
        <SettingsForm />
        {user?.provided && <ChangePassword />}
        <ChangePassword />
      </div>
    </div>
  );
}

export default Settings;
