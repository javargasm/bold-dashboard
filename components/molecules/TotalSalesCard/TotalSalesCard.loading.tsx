import Skeleton from "@components/atoms/Skeleton/Skeleton";
import Card from "@components/atoms/Card/Card";

export const TotalSalesCardLoading = () => {
  return (
    <Card
      header={
        <div className="salesHeader">
          <Skeleton width={200} height={24} />
          <Skeleton width={48} height={40} borderRadius={10} />
        </div>
      }
      classNameContent="loading-content"
    >
      <Skeleton width={200} height={36} className="amount-skeleton" />
      <Skeleton width={150} height={24}/>
    </Card>
  );
};

export const FilterTabsLoading = () => (
  <Skeleton height={100} borderRadius={8} />
);

export const FilterButtonLoading = () => (
  <Skeleton height={48} width={132} borderRadius={8} />
);
