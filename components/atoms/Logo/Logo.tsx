import Image from "next/image";
import "./Logo.styles.css";


const Logo = () => {
  return (
    <div className={`logo`}>
      <Image
        src="./assets/logo.svg"
        alt="Logo"
        width={120}
        height={100}
      />
    </div>
  );
};

export default Logo;
