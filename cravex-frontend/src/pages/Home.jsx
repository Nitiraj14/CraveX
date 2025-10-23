import React from 'react'
import Menu from '../components/Menu'
import { useEffect } from 'react';
// import ErrorBoundary from '../components/Errorboundaries';

const Home = () => {

      useEffect(() => {
      if (typeof window !== "undefined") {
        if (window.location.hash === "#menu") {
          setTimeout(() => {
            const menuSection = document.getElementById("menu");
            menuSection?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
        }
      }
    }, []);

  return (
    <div className="">
      {/* Hero Section */}
      <div className="bg-white flex flex-col md:flex-row w-full min-h-[80vh] md:min-h-screen sticky">
        {/* Left Half */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center">
          {/* hero text area */}
          <div className="flex flex-col mt-16 md:mt-40 items-start h-full w-11/12 md:w-10/12 md:ml-40 space-y-3 font-extrabold text-black">
            <p className="text-4xl sm:text-6xl md:text-8xl">CraveX.</p>
            <p className="text-xl sm:text-3xl md:text-5xl">YOUR HUNGER IS CALLING YOU</p>
            <p className="text-base sm:text-xl md:text-2xl">
              with us, you can satisfy your cravings anytime, anywhere
              <span className="block text-lg sm:text-2xl md:text-3xl m-4 md:m-10 p-2 md:p-3 text-center w-fit bg-amber-600 rounded-3xl text-white">ORDER NOW</span>
            </p>
          </div>
        </div>
        {/* Right Half */}
        <div className="w-full md:w-1/2 flex justify-center items-center relative min-h-[300px] md:min-h-0">
          <div className="w-11/12 md:w-10/12 h-48 md:h-4/5 rounded-l-full bg-[rgb(239,139,100)] absolute right-0 top-0 md:top-auto md:right-0">
            <img src="src/assets/image/—Pngtree—ultimate burger bliss a colorful_20543115.png" alt="Burger" className="h-full w-full object-cover md:rotate-[340deg] absolute" />
          </div>
        </div>
      </div>
      {/* menu components */}
      <Menu />
    </div>
  );
}

export default Home
