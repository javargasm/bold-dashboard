import dynamic from "next/dynamic";
import {
  TotalSalesCardLoading,
  FilterTabsLoading,
  FilterButtonLoading,
} from "../../molecules/TotalSalesCard/TotalSalesCard.loading";

import "./Header.styles.css";

const TotalSalesCard = dynamic(
  () => import("@components/molecules/TotalSalesCard/TotalSalesCard"),
  {
    loading: () => <TotalSalesCardLoading />,
  }
);

const FilterTabs = dynamic(
  () => import("@components/molecules/FilterPeriodButtons/FilterPeriodButtons"),
  {
    loading: () => <FilterTabsLoading />,
  }
);

const FilterButton = dynamic(
  () => import("@components/molecules/FilterButton/FilterButton"),
  {
    loading: () => <FilterButtonLoading />,
  }
);

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="headerContent">
          <TotalSalesCard />
          <div className="filterSection">
            <FilterTabs />
            <div className="filterButtonWrapper">
              <FilterButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
