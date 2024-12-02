import { useForm } from 'react-hook-form';
import useStore from '../store';
import { Fragment, useEffect, useState } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Input,
  Transition,
} from '@headlessui/react';
import { BiCheck, BiLoader } from 'react-icons/bi';
import { MdExpandMore } from 'react-icons/md';
import { fetchCountries } from '../common';
import { Button } from './button';
import api from '../common/apiCall';
import { toast } from 'sonner';

function SettingsForm() {
  const { user, setTheme, theme } = useStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { ...user } });
  const [selectedCountry, setSelectedCountry] = useState(
    // eslint-disable-next-line no-constant-binary-expression
    { country: user?.country, currency: user?.currency } || ''
  );
  const [query, setQuery] = useState('');
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const newData = {
        ...values,
        country: selectedCountry.country,
        currency: selectedCountry.currency,
      };
      const { data: res } = await api.put(`/user`, newData);

      if (res?.user) {
        const newUser = { ...res.user, token: user.token };

        localStorage.setItem('user', JSON.stringify(newUser));
        toast.success(res?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  //   theme toggle
  const toggleTheme = (val) => {
    setTheme(val);
    localStorage.setItem('theme', val);
  };

  //   ================countries===================

  const filteredCountries =
    query === ''
      ? countriesData
      : countriesData.filter((country) =>
          country.country
            .toLowerCase()

            .replace(/\s+/g, '')
            .includes(query.toLocaleLowerCase().replace(/\s+/g, ''))
        );

  const getCountriesList = async () => {
    const data = await fetchCountries();
    setCountriesData(data);
  };

  useEffect(() => {
    getCountriesList();
  }, []);

  const Countries = () => {
    return (
      <div className="w-full">
        <Combobox value={selectedCountry} onChange={setSelectedCountry}>
          <div className="relative mt-1">
            <div className="">
              <ComboboxInput
                className={`inputStyle`}
                displayValue={(country) => country?.country}
                onChange={(e) => setQuery(e.target.value)}
              />
              <ComboboxButton
                className={'absolute inset-y-0 right-0 flex items-center pr-2'}
              >
                <MdExpandMore
                  className="text-gray-500 dark:text-gray-200"
                  size={24}
                />
              </ComboboxButton>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
            >
              <ComboboxOptions
                className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white 
          dark:bg-slate-900 py-4 text-base shadow-lg ring-black/5 focus:outline-none sm:text-sm"
              >
                {filteredCountries.length === 0 && query !== '' ? (
                  <div className="relative cursor-default select-none px-4 py-2 text-gray-500 dark:text-gray-200">
                    Nothing Found
                  </div>
                ) : (
                  filteredCountries?.map((country, index) => {
                    return (
                      <ComboboxOption
                        key={country.country + index}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-violet-600/20 text-white'
                              : 'text-gray-900'
                          }`
                        }
                        value={country}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center gap-2">
                              <img
                                src={country?.flag}
                                alt={country?.country}
                                className="w-8 h-5 rounded-sm object-cover"
                              />
                              <span
                                className={`block truncate text-gray-700 dark:text-gray-500 ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {country?.country}
                              </span>
                            </div>

                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? `text-white` : 'text-teal-600'
                                }`}
                              >
                                <BiCheck
                                  className="h-5 w-5"
                                  aria-hidden={true}
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </ComboboxOption>
                    );
                  })
                )}
              </ComboboxOptions>
            </Transition>
          </div>
        </Combobox>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col flex-wrapp md:flex-row items-center justify-between  gap-4">
        <div className="w-full">
          <Input
            disabled={loading}
            name="firstname"
            label="First Name"
            placeholder="John"
            register={register('firstname')}
            error={errors.firstname?.message ? errors.firstname : ''}
            className="input-style"
          />
        </div>
        <div className="w-full">
          <Input
            disabled={loading}
            name="lastname"
            label="Last Name"
            placeholder="Doe"
            type="text"
            register={register('lastname')}
            error={errors.lastname?.message}
            className="input-style"
          />
        </div>
        <div className="w-full">
          <Input
            disabled={loading}
            name="email"
            label="Email"
            placeholder="Email"
            type="text"
            register={register('email')}
            error={errors?.email?.message}
            className="input-style"
          />
        </div>{' '}
        <div className="w-full">
          <Input
            disabled={loading}
            name="contact"
            label="contact"
            placeholder="phone number"
            type="text"
            register={register('contact')}
            error={errors.contact?.message}
            className="input-style"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <span className="labelStyles">Country</span>
          <Countries />
        </div>
        <div className="w-full">
          <span className="labelStyles">Currency</span>
          <select className="inputStyle">
            <option>{selectedCountry?.currency || user?.country}</option>
          </select>
        </div>
      </div>

      {/* Theme */}
      <div className="w-full flex items-center justify-between pt-10">
        <div className="">
          <p className="text-lg text-black dark:text-gray-400 font-semibold">
            Appearance
          </p>
          <span className="labelStyles">
            Customize how your theme looks on your device
          </span>
        </div>
        <div className="w-28 md:w-40">
          <select
            className="inputStyle"
            defaultValue={theme}
            onChange={(e) => toggleTheme(e.target.value)}
          >
            <option value={'light'}>Light</option>
            <option value={'dark'}>Dark</option>
          </select>
        </div>
      </div>

      {/* LANGUAGE */}
      <div className="w-full flex items-center justify-between pb-10">
        <div>
          <p className="text-lg text-black dark:text-gray-400 font-semibold">
            Language
          </p>
          <span className="labelStyles">
            Customise what language you want to use
          </span>
        </div>
        <div className="w-28 md:w-40">
          <select className="inputStyle">
            <option value={'English'}>English</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-6 justify-end pb-16 border-b-2 border-gray-200 dark:border-gray-200">
        <Button
          variant="outline"
          disabled={loading}
          type="reset"
          className={
            'px-6 bg-transparent dark:text-black text-gray-500 border-gray-200 dark:border-gray-200'
          }
        >
          Reset
        </Button>
        <Button
          disabled={loading}
          type="submit"
          className={'px-8 bg-violet-800 text-white'}
          // size="sm"
        >
          {loading ? <BiLoader /> : 'Save'}
        </Button>
      </div>
    </form>
  );
}

export default SettingsForm;
