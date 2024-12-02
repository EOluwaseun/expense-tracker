/* eslint-disable react/prop-types */
import { BiCard } from 'react-icons/bi';
import { RiBtcFill, RiPaypalFill, RiVisaFill } from 'react-icons/ri';
import Title from './Title';
import { formatCurrency, maskAccountNumber } from '../common';

const ICONS = {
  Crypto: (
    <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
      <RiBtcFill size={26} />
    </div>
  ),
  Cash: (
    <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
      <BiCard size={26} />
    </div>
  ),
  'Visa debit card': (
    <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
      <RiVisaFill size={26} />
    </div>
  ),
  Paypal: (
    <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
      <RiPaypalFill size={26} />
    </div>
  ),
};

// eslint-disable-next-line react/prop-types
function Accounts({ data }) {
  return (
    <div className="py-20 w-full md:w-2/3">
      <Title title={'Accounts'} />
      <span className="text-sm text-gray-600 dark:text-gray-500">
        View all your accounts
      </span>
      <div className="w-full">
        {data?.map((item, index) => {
          return (
            <div
              key={index + item?.account_name}
              className="flex items-center justify-between gap-4 mt-6"
            >
              <div className="flex items-center gap-4">
                {ICONS[item?.account_name]}
                <div>
                  <p className="text-black dark:text-gray-400 text-lg">
                    {item.account_name}
                  </p>
                  <span className="text-gray-600">
                    {maskAccountNumber(item?.account_number)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xl text-black dark:text-gray-400 font-medium">
                  {formatCurrency(item.account_balance)}
                </p>
                <span className="text-sm text-gray-600 dark:text-violet-700">
                  Account Balance
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Accounts;
