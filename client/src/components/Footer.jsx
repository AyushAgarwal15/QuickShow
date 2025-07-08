import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
        <div className="md:max-w-96">
          <img className="w-36 h-auto" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
            QuickShow is a modern movie-ticket platform that makes discovering
            and booking the latest releases effortless.  Browse curated
            listings, pick your favourite seats in real-time, and secure your
            tickets in just a few taps—anytime, anywhere.
          </p>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="text-primary hover:underline">Home</a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">About us</a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">Contact us</a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">Privacy policy</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+91-8126749140</p>
              <p>ayushagarwal8126@gmail.com</p>
              <a href="http://ayushagarwal.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Developer: Ayush Agarwal
              </a>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center text-sm pb-5">
        Copyright {new Date().getFullYear()} © Ayush Agarwal. All Right
        Reserved.
      </p>
    </footer>
  );
};

export default Footer;
