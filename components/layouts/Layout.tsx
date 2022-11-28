import { FC } from "react";
import { useEffect, useState } from "react";
// import Footer from "../Ui/Footer";
// import Navbar from "../Nav/Navbar";

interface Props {
  children: React.ReactNode;
}

type HandleScroll = () => void;

const Layout: FC<Props> = ({ children }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll: HandleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col justify-between min-h-screen">
      {/* <Navbar scrollPosition={scrollPosition} /> */}
      <main className="w-full h-full">{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
