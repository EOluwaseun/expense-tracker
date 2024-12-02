import { useState } from 'react';
import { RiCurrencyLine, RiProfileFill } from 'react-icons/ri';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import ThemeSwitch from './ThemeSwitch';
import { Link } from 'react-router-dom';

const links = [
  {
    name: 'Dashboard',
    link: '',
  },
  {
    name: 'Transactions',
    link: 'transactions',
  },
  {
    name: 'Accounts',
    link: 'accounts',
  },
  {
    name: 'Settings',
    link: 'settings',
  },
];

const Navbar = () => {
  const [selected, setSelected] = useState(0);

  return (
    <nav className="w-full flex items-center justify-between py-6 px-2 md:px-20">
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-violet-700 rounded-xl">
          <RiCurrencyLine className="text-white text-3xl hover:animate-spin" />
        </div>
        <span className="text-2xl font-semibold text-black dark:text-gray-300">
          My-Finance
        </span>
      </div>
      <div className="hidden md:flex items-center gap-4">
        {links.map((link, index) => {
          return (
            <div
              key={index}
              className={`${
                index === selected
                  ? 'bg-black dark:bg-slate-600 text-white'
                  : 'text-gray-700 dark:text-gray-500'
              } px-6 py-2`}
              onClick={() => setSelected(index)}
            >
              <Link to={`/${link.link}`}>{link.name}</Link>
              {/* <a href={`${link.link}`}>{link.name}</a> */}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-10 2xl:gap-20">
        <ThemeSwitch />

        <div className="flex items-center gap-2">
          <div>
            <RiProfileFill className="h-10 w-10 rounded-full cursor-pointer dark:text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-lg font-medium text-black dark:text-gray-400">
              John Doe
            </p>
            <span className="text-sm text-gray-700 dark:text-gray-500">
              Johndoe@gmail.com
            </span>
          </div>
          <MdOutlineKeyboardArrowDown className="hidden md:block text-2xl text-gray-600 dark:text-gray-300 cursor-pointer" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
