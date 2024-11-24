import Skeleton from "@components/atoms/Skeleton/Skeleton";

export default function NavbarLoading() {
  return (
    <nav className="navbar">
      <div className="navbarContent">
        <Skeleton 
          width={120} 
          height={100}
          borderRadius={8}
          animation="wave"
        />
        
        <div className="navLinks">
          <Skeleton 
            width={100} 
            height={36}
            borderRadius={8}
            animation="wave"
            style={{ marginRight: '1rem' }}
          />
          
          <Skeleton 
            width={120} 
            height={36}
            borderRadius={8}
            animation="wave"
          />
        </div>
      </div>
    </nav>
  );
}