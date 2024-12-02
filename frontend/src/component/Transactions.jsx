/* eslint-disable react/prop-types */
import { RiProgress3Line } from 'react-icons/ri';
import Title from './Title';
import { MdDone, MdWarning } from 'react-icons/md';
import { formatCurrency } from '../common';

// const data = [
//   {
//     name: 'Card maintainance',
//     date: '2024-03-08',
//     contact: '+1555666990',
//     status: 'Completed',
//     source: 'Debit Card',
//     amount: 90,
//   },
//   {
//     name: 'Online Subscription',
//     date: '2024-05-08',
//     contact: '+1093366990',
//     status: 'Pending',
//     source: 'Debit Card',
//     amount: 950,
//   },
//   {
//     name: 'Shopping',
//     date: '2024-03-08',
//     contact: '+1555666990',
//     status: 'Rejected',
//     source: 'Debit Card',
//     amount: 90,
//   },
//   {
//     name: 'Accomodations',
//     date: '2024-03-08',
//     contact: '+1555666990',
//     status: 'Completed',
//     source: 'Debit Card',
//     amount: 5040,
//   },
//   {
//     name: 'Gadgets',
//     date: '2024-03-08',
//     contact: '+1555666990',
//     status: 'Completed',
//     source: 'Debit Card',
//     amount: 90,
//   },
//   {
//     name: 'Card maintainance',
//     date: '2024-03-08',
//     contact: '+1555666990',
//     status: 'Rejected',
//     source: 'Debit Card',
//     amount: 90,
//   },
//   {
//     name: 'Grocery Store',
//     date: '2024-03-08',
//     contact: '+1590866990',
//     status: 'Pending',
//     source: 'Cash',
//     amount: 200,
//   },
//   {
//     name: 'Card maintainance',
//     date: '2024-03-08',
//     contact: '+1555666990',
//     status: 'Completed',
//     source: 'Debit Card',
//     amount: 90,
//   },
//   {
//     name: 'Online Shopping',
//     date: '2024-03-03',
//     contact: '+1555663290',
//     status: 'Completed',
//     source: 'Cash',
//     amount: 100,
//   },
//   {
//     name: 'Card maintainance',
//     date: '2024-03-08',
//     contact: '+1555666990',
//     status: 'Completed',
//     source: 'Debit Card',
//     amount: 90,
//   },
// ];

// eslint-disable-next-line react/prop-types
function Transactions({ data }) {
  return (
    <div className="py-20 w-full md:w-2/3">
      <Title title={'Latest transactions'} />
      <div className="overflow-x-auto mt-5">
        <table className="w-full">
          <thead className="w-full border-b border-gray-300 dark:border-gray-700 text-left">
            <tr className="w-full text-black dark:text-gray-400 text-left">
              <th className="py-2">Date</th>
              <th className="py-2">Name</th>
              <th className="py-2">Status</th>
              <th className="py-2">Source</th>
              <th className="py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data?.slice(0, 5)?.map((item, index) => {
              // reduce the item with slice
              return (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-500 hover:text-gray-300"
                >
                  <td className="py-2 px-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-2">
                    <div>
                      <p className="font-medium text-lg text-black dark:text-gray-400">
                        {item.description}
                      </p>
                      {/* <span className="text-sm text-gray-600">
                        {item.contact}
                      </span> */}
                    </div>
                  </td>
                  <td className="py-2 px-2 flex items-center gap-2">
                    <p
                      className={`w-fit flex items-center gap-2 px-2 py-1 rounded-full text-base
                        ${
                          item?.status === 'Completed'
                            ? 'bg-emerald-200 text-emerald-800'
                            : item.status === 'Pending'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-red-200 text-red-800'
                        }
                        `}
                    >
                      {item?.status === 'Pending' && (
                        <RiProgress3Line size={22} className="text-amber-600" />
                      )}
                      {item?.status === 'Completed' && (
                        <MdDone size={22} className="text-emerald-600" />
                      )}
                      {item.status === 'Rejected' && (
                        <MdWarning size={22} className="text-red-600" />
                      )}
                      <span>{item?.status}</span>
                    </p>
                  </td>
                  <td className="py-2 px-2">{item?.source}</td>
                  <td className="py-2 px-2 text-black dark:text-gray-400 text-base">
                    <span
                      className={`${
                        item?.type === 'income'
                          ? 'text-emerald-600'
                          : 'text-red-600'
                      }`}
                    >
                      {item?.type === 'income' ? '+' : '-'}
                    </span>
                    ${item.amount}.00 {formatCurrency(item) || 0.0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;
