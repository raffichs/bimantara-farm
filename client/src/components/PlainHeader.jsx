// import React from "react";

const PlainHeader = () => {
  return (
    <header>
      <nav className="flex justify-center items-center gap-2 p-2 bg-[#ffffff]">
        <img src={"/images/appbar-logo.svg"} className="h-11" alt="logo" />
        <span className="md:text-2xl text-gray-800">Bimantara Farm</span>
      </nav>
    </header>
  );
};

export default PlainHeader;