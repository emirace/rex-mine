import { BiSupport } from "react-icons/bi";
function Navbar() {
  return (
    <>
      <div className="fixed top-0 left-0 z-20  right-0 bg-background flex p-4 justify-between items-center text-white shadow-sm shadow-primary">
        <div className="font-bold text-xl">LOGO</div>
        <BiSupport size={28} />
      </div>
      <div className="h-[60px] w-full" />
    </>
  );
}

export default Navbar;
