import Chart from '../../component/Chart';
import DoughutChart from '../../component/DoughutChart';
import Info from '../../component/Info';
import Navbar from '../../component/Navbar';
import Stat from '../../component/Stat';
// import AccountPage from '../AccountPage';
// import Transaction from '../Transaction';

function Dashboard() {
  return (
    <div className="w-full px-6 md:px-20 bg-white dark:bg-slate-900">
      <Navbar />
      <div className="px-0 md:px-5 2xl:px-20">
        <Info
          title={'Dashboard'}
          subTitle={'Monitor your financial activities'}
        />
        <Stat />
      </div>
      {/* <div className="w-full flex flex-col-reverse md:flex-row items-center gap-10">
        <Chart />
        <DoughutChart />
      </div> */}
      {/* <div className="flex flex-col-reverse md:flex-row gap-0 md:gap-10 2xl:gap-20">
        <Transaction />
        <AccountPage />
      </div> */}
    </div>
  );
}

export default Dashboard;
