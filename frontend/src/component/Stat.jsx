import { BiMoneyWithdraw } from 'react-icons/bi';
import { MdCurrencyPound, MdMoney } from 'react-icons/md';
import { formatCurrency } from '../common';

const ICON_STYLES = [
  'bg-blue-300 text-blue-800',
  'bg-emerald-300 text-emerald-800',
  'bg-rose-300 text-rose-800',
];
// eslint-disable-next-line react/prop-types
function Stat({ dt }) {
  const data = [
    {
      label: 'Total Balance',
      // eslint-disable-next-line react/prop-types
      amount: dt?.balance,
      increase: 10.0,
      icon: <MdCurrencyPound size={26} />,
    },
    {
      label: 'Income',
      // amount: '150,010.00',
      // eslint-disable-next-line react/prop-types
      amount: dt?.income,
      increase: 8.0,
      icon: <MdMoney size={26} />,
    },
    {
      label: 'Expenses',
      // eslint-disable-next-line react/prop-types
      amount: dt?.expense,
      increase: -0.8,
      icon: <BiMoneyWithdraw size={26} />,
    },
  ];
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 2xl:gap-30 mb-20">
      {data.map((item, index) => {
        return (
          <div
            key={index + item.label}
            className="p-4 w-full 2xl:min-96 flex items-center justify-between 
            gap-5 px-4 md:px-8 py-12 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-900"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full ${ICON_STYLES[index]}`}
              >
                {item?.icon}
              </div>
              <div className="space-y-3">
                <span className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
                  {item?.label}
                </span>
                <p className="text-2xl 2xl:text-3xl font-medium text-black dark:text-gray-400">
                  {formatCurrency(item?.amount || 0.0)}
                </p>
                <span className="text-xs text-gray-600 md:text-sm 2xl:text-base dark:text-gray-500">
                  Overall {item.label}
                </span>
              </div>
            </div>
            {/* <div>
              <p
                className={`flex gap-1 items-center text-base md:text-lg font-semibold ${
                  item?.increase > 0 ? 'text-emerald-500' : 'text-red-500'
                }`}
              >
                {item?.increase > 0 ? (
                  <BiArrowFromBottom />
                ) : (
                  <BiArrowFromTop />
                )}
                {Math.abs(item.increase)}%
              </p>
              <span className="text-xs md:text-sm text-gray-600 dark:text-gray-500">
                Compare to last year
              </span>
            </div> */}
          </div>
        );
      })}
    </div>
  );
}

export default Stat;
