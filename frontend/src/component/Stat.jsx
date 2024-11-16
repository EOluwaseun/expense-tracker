import {
  BiArrowFromBottom,
  BiArrowFromTop,
  BiMoneyWithdraw,
} from 'react-icons/bi';
import { MdCurrencyPound, MdMoney } from 'react-icons/md';

const data = [
  {
    label: 'Your Total Balance',
    amount: '100,020.00',
    increase: 10.0,
    icon: <MdCurrencyPound size={26} />,
  },
  {
    label: 'Your Income',
    amount: '150,010.00',
    increase: 8.0,
    icon: <MdMoney size={26} />,
  },
  {
    label: 'Your Expenses',
    amount: '150,010.00',
    increase: -0.8,
    icon: <BiMoneyWithdraw size={26} />,
  },
];

const ICON_STYLES = [
  'bg-blue-300 text-blue-800',
  'bg-emerald-300 text-emerald-800',
  'bg-rose-300 text-rose-800',
];
function Stat() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 2xl:gap-40 mb20">
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
                {item.icon}
              </div>
              <div className="space-y-3">
                <span className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
                  {item.label}
                </span>
                <p className="text-2xl 2xl:text-3xl font-medium text-black dark:text-gray-400">
                  %{item.amount}
                </p>
              </div>
            </div>
            <div>
              <p
                className={`flex gap-1 items-center text-base md:text-lg font-semibold ${
                  item.increase > 0 ? 'text-emerald-500' : 'text-red-500'
                }`}
              >
                {item.increase > 0 ? <BiArrowFromBottom /> : <BiArrowFromTop />}
                {Math.abs(item.increase)}%{/* remove - symbol */}
              </p>
              <span>Compare to last year</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Stat;
