import { useEffect, useState } from 'react';
import Accounts from '../../component/Accounts';
import Chart from '../../component/Chart';
import DoughutChart from '../../component/DoughutChart';
import Info from '../../component/Info';
import Stat from '../../component/Stat';
import Transactions from '../../component/Transactions';
import api from '../../common/apiCall';
import { toast } from 'sonner';
import Loading from '../../component/Loading';

function Dashboard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserStat = async () => {
    const URL = `/transaction/dashboard `;

    try {
      const { data } = await api.get(URL);
      setData(data);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          `Something unexpected happened,try again later`
      );
      if (error?.response?.data?.status === `auth_failed`) {
        localStorage.removeItem('user');
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUserStat();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <Loading />
      </div>
    );
  }
  return (
    <div className="w-full px-2 md:px-20 bg-white dark:bg-slate-900">
      <div className="px-0 md:px-5 2xl:px-20">
        <Info
          title={'Dashboard'}
          subTitle={'Monitor your financial activities'}
        />

        <Stat
          dt={{
            balance: data?.availableBalance,
            income: data?.totalIncome,
            expense: data?.totalExpense,
          }}
        />
      </div>
      <div className="w-full flex flex-col-reverse md:flex-row items-center gap-10">
        <Chart data={data?.chartData} />
        {data?.totalIncome > 0 && (
          <DoughutChart
            dt={{
              balance: data?.availableBalance,
              income: data?.totalIncome,
              expense: data?.totalExpense,
            }}
          />
        )}
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-0 md:gap-10 2xl:gap-20">
        <Transactions data={data?.lastTransactions} />
        {data?.lastAccount?.length > 0 && <Accounts data={data?.lastAccount} />}
      </div>
    </div>
  );
}

export default Dashboard;
