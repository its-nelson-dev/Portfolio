import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Services.css";

const iconProps = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const ShieldLockIcon = () => (
  <svg {...iconProps}>
    <path d="M12 2 20 5v6c0 5.25-3.4 9.24-8 11-4.6-1.76-8-5.75-8-11V5z" />
    <rect x="9" y="12" width="6" height="5" rx="1" />
    <path d="M10.2 12v-1.6a1.8 1.8 0 0 1 3.6 0V12" />
  </svg>
);

const ShieldSearchIcon = () => (
  <svg {...iconProps}>
    <path d="M12 2 20 5v6c0 5.25-3.4 9.24-8 11-4.6-1.76-8-5.75-8-11V5z" />
    <circle cx="10.5" cy="11.5" r="2.5" />
    <line x1="12.4" y1="13.4" x2="14.5" y2="15.5" />
  </svg>
);

const LayersIcon = () => (
  <svg {...iconProps}>
    <polygon points="12 3 3 8 12 13 21 8 12 3" />
    <polyline points="3 13 12 18 21 13" />
    <polyline points="3 18 12 22 21 18" />
  </svg>
);

const ToolIcon = () => (
  <svg {...iconProps}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.4-3.4a6 6 0 0 1-8 8l-6.6 6.6a2.1 2.1 0 0 1-3-3l6.6-6.6a6 6 0 0 1 8-8z" />
  </svg>
);

const services = [
  {
    title: "Secure Web Development",
    icon: ShieldLockIcon,
    text: "I build websites and web applications with security as a priority from day one. Every project follows secure development practices, including safe authentication, data protection, input validation, and proper server configuration.",
  },
  {
    title: "Security & Code Improvements",
    icon: ShieldSearchIcon,
    text: "I review and strengthen existing applications by identifying security risks, improving code quality, and fixing vulnerabilities to help keep your business and customer data protected.",
  },
  {
    title: "Complete Web Application Development",
    icon: LayersIcon,
    text: "From planning and development to testing, deployment, and documentation, I create complete web solutions using modern technologies like Laravel, MySQL, and Git, tailored to your business needs.",
  },
  {
    title: "Maintenance & Updates",
    icon: ToolIcon,
    text: "I help keep your website running smoothly with regular updates, dependency maintenance, bug fixes, backups, and improvements to maintain security, performance, and reliability.",
  },
];

function Services() {
  return (
    <motion.div
      className="servicesPage"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18 }}
    >
      <header className="servicesHeader">
        <h1 className="servicesHeading">Services</h1>
        <p className="servicesSubhead">
          Freelance web development, built security-first.
        </p>
      </header>

      <div className="servicesCta">
        <p className="ctaText">Have a project in mind?</p>
        <Link className="ctaButton" to="/Portfolio/About#contact">
          LET'S TALK ↗
        </Link>
      </div>

      <div className="servicesGrid">
        {services.map((service) => (
          <div className="serviceCard" key={service.title}>
            <div className="serviceIcon">
              <service.icon />
            </div>
            <h2 className="serviceTitle">{service.title}</h2>
            <p className="serviceText">{service.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Services;
