import { useEffect } from "react";
import logoPrint from '../assets/crowdwrap.svg';
import { ReactComponent as Brand } from '../assets/crowdwrap.svg';
import { ReactComponent as LandingImage } from '../assets/purpleflow.svg';
import "./landingPage.css"
import { BrowserRouter as Router, Route } from "react-router-dom";
import './landingPage.css';
import {Link} from 'react-router-dom';


const NavBar = () => {
  return (
    <nav className="navbar">
      <h3><Brand/></h3>
      <ul className="nav-links">
        <Link to="/" className = "products">
          <li>Products</li>
        </Link>
        <Link to="/" className = "How it works">
          <li>How it works</li>
        </Link>
        <Link to="/" className = "community">
          <li>Community</li>
        </Link>
        <Link to="/" className = "about">
          <li>About</li>
        </Link>
        <Link to="/" className = "contact">
          <li>Contact</li>
        </Link>
        <Link to="/" className = "signup">
          <li>Sign up</li>
        </Link>
        </ul>
    </nav>
  )
}

const MainContent = () => {
  return (
    <div className="main-content">
      <div className="cta-container">
        <h2 className="cta">
          Get inspired. give amazing gifts<br /> and make memories.
        </h2>
        <Image />
      </div>
    </div>
  );
};


const Image = () => {
  return (
    <div className="landing-image">
      <LandingImage />
    </div>
  );
};


export default function LandingPage() {
  useEffect(() => {
    document.title = 'Landing Page';
  }, []);

  return (
    <div className="landing-page">
      <NavBar/>
      <MainContent/>
    </div>
  );
}