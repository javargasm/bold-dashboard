import { FiHelpCircle } from "react-icons/fi";
import { lazy, Suspense } from "react";

import Skeleton from "@components/atoms/Skeleton/Skeleton";
import "./Navbar.styles.css";
import Button from "@components/atoms/Button/Button";


const Logo = lazy(() => import("@components/atoms/Logo/Logo"));

interface NavbarProps {
  isLoading?: boolean;
}

const Navbar = ({ isLoading = false }: NavbarProps) => {
  return (
    <nav className="navbar">
      <div className="container navbarContent">
        <Suspense fallback={<Skeleton></Skeleton>}>
          <Logo />
        </Suspense>
        <div className="navLinks">
            <Button  size="sm" isLoading={isLoading} className="navLinks">
              Mi negocio
            </Button>

            <Button  size="sm" isLoading={isLoading} tooltip="Contacta a alguien de soporte">
              <span>Ayuda</span>
              <FiHelpCircle className="helpIcon" />
            </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
