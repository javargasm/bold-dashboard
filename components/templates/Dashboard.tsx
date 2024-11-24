import NavbarLoading from "@components/organisms/Navbar/Navbar.loading";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@components/organisms/Navbar/Navbar"), {
  loading: () => <NavbarLoading />,
});


export default function Dashboard() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <Navbar />
      
    </div>
  );
}
