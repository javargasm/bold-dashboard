import Skeleton from "@components/atoms/Skeleton/Skeleton";
import NavbarLoading from "@components/organisms/Navbar/Navbar.loading";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@components/organisms/Navbar/Navbar"), {
  loading: () => <NavbarLoading />,
});

const Header = dynamic(() => import("@components/organisms/Header/Header"), {
  loading: () => <Skeleton />,
});

const TransactionsTable = dynamic(
  () => import("@components/organisms/TransactionsTable/TransactionsTable"),
  {
    loading: () => <Skeleton className="table-skeleton" />,
  }
);

export default function Dashboard() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <Navbar />
      <div style={{ padding: "0 calc(5% - 10px)" }}>
        <Header />
        <main className="container mx-auto px-4 mt-8">
          <TransactionsTable />
        </main>
      </div>
    </div>
  );
}
