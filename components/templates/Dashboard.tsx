import NavbarLoading from "@components/organisms/Navbar/Navbar.loading";
import dynamic from "next/dynamic";
import Skeleton from "@components/atoms/Skeleton/Skeleton";


const Navbar = dynamic(() => import("@components/organisms/Navbar/Navbar"), {
  loading: () => <NavbarLoading />,
});

const Header = dynamic(() => import("@components/organisms/Header/Header"), {
  loading: () => <Skeleton />,
});


export default function Dashboard() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <Navbar />
      <div style={{ padding: "0 calc(5% - 10px)" }}>
        <Header />

      </div>
      
    </div>
  );
}
