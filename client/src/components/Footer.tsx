
import { Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Footer = () => {
  return (
    <footer className="bg-emerald-400 w-full h-3/12 p-16 pb-6 flex flex-col justify-around text-white">
      <h1 className="text-3xl font-bold">
        <span className="text-red-700 font-extrabold text-4xl">/</span>
        <span className="text-xl ml-2">Mini</span>
        <span className="ml-2 text-4xl text-red-600 italic">X</span>
      </h1>
      <section className="links md:flex md:justify-between my-4">
        <ul className="mb-6 md:mb-0">
          <p className="font-bold uppercase m-4 underline">company</p>
          <li className="mb-2 hover:text-red-600">
            <Link to="/about">About</Link>
          </li>
          <li className="mb-2 hover:text-red-600">
            <Link to="/features">Features</Link>
          </li>
          <li className="mb-2 hover:text-red-600">
            <Link to="/works">Works</Link>
          </li>
          <li className="mb-2 hover:text-red-600">
            <Link to="/career">Career</Link>
          </li>
        </ul>
        <ul className="mb-6 md:mb-0">
          <p className="font-bold uppercase m-4 underline">Help</p>
          <li className="mb-2 hover:text-red-600">
            <Link to="/support">Customer Support</Link>
          </li>
          <li className="mb-2 hover:text-red-600">
            <Link to="/delivery">Delivery Details</Link>
          </li>
          <li className="mb-2 hover:text-red-600">
            <Link to="/terms">Terms & Conditions</Link>
          </li>
          <li className="mb-2 hover:text-red-600">
            <Link to="/privacy">Privacy Policy</Link>
          </li>
        </ul>
        <ul className="mb-6 md:mb-0">
          <p className="font-bold uppercase m-4 underline">resources</p>
          <li className="mb-2 hover:text-red-600">
            <Link to="/blog">Blog</Link>
          </li>
          <li className="mb-2 hover:text-red-600">
            <Link to="/documentation">Documentation</Link>
          </li>
          <li className="mb-2 hover:text-red-600">
            <Link to="/api-reference">API Reference</Link>
          </li>
          <li className="mb-2 hover:text-red-600">
            <Link to="/community">Community</Link>
          </li>
        </ul>
        <section className="contact mt-12">
          <h1 className="font-bold text-lg uppercase">Subscribe to our newsletter</h1>
          <form className="flex my-8">
            <input className="shadow-[0px_0px_10px_6px_rgba(900,50,80,0.8)] p-3 rounded-s-2xl w-3/4 bg-white  text-black" type="email" placeholder="Enter your email" />
            <button className="bg-black text-white p-3 cursor-pointer rounded-e-2xl w-1/4 hover:bg-red-800 hover:scale-105" type="submit">Join</button>
          </form>
        </section>
        <section className="contact-info my-12 justify-around gap-4">
          <section className="md:ml-16">
            <p className="uppercase text-lg font-semibold underline">call us</p>
            <p className="text-2xl font-bold my-2 text-red-800">+1 (555) 123-4567</p>
          </section>
          <section className="md:ml-16 ">
            <p className="uppercase text-lg font-semibold underline">email us</p>
            <p className="text-2xl font-bold my-2 text-red-800">info@minix.com</p>
          </section>
        </section>
      </section>
      <section className="mt-6 border-t-1 md:flex justify-around items-center ">
        <h2 className="pt-6 text-center">©Copyright 2023, ALL RIGHTS RESERVED</h2>
        <section className="social flex justify-center md:ml-96 mt-6">
          <ul className="flex gap-12">
            <li className="hover:text-red-600 hover:scale-120 transition-transform duration-200">
              <Link to="/facebook"><i className="bi bi-facebook text-3xl"></i></Link>
            </li>
            <li className="hover:text-red-600 hover:scale-120 transition-transform duration-200">
              <Link to="/linkedin"><i className="bi bi-linkedin text-3xl"></i></Link>
            </li>
            <li className="hover:text-red-600 hover:scale-120 transition-transform duration-200">
              <Link to="/instagram"><i className="bi bi-instagram text-3xl"></i></Link>
            </li>
          </ul>
        </section>
      </section>
    </footer>
  );
}

export default Footer;