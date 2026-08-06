import React, { useState } from "react";
import { motion } from "framer-motion";
import profile from "/profile-blurred.jpg";

import { experiences, education } from "../../details";

import "./About.css";

const contactIconProps = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const MailIcon = () => (
  <svg {...contactIconProps}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m3 6 8.5 7L20 6" />
  </svg>
);

const PhoneIcon = () => (
  <svg {...contactIconProps}>
    <path d="M4.5 3h4l2 5-2.5 2a12 12 0 0 0 5.5 5.5l2-2.5 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 2.5 5a2 2 0 0 1 2-2z" />
  </svg>
);

function About() {
  const [mobileTab, setMobileTab] = useState("experience");
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = async () => {
    const email = "its.nelson.dev@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 1500);
  };

  return (
    <motion.div
      className="aboutPage"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18 }}
    >
      <header className="aboutHeader">
        <h1 className="aboutHeading">About Me</h1>
      </header>
      <div className="containerAbout">
        <div className="info">
          <div className="leftSide">
            <img className="image" src={profile} alt="" />
          </div>
          <div className="rightSide" id="contact">
            <h2>Web Developer</h2>
            <p>
              Web Developer with 2 years of experience building web
              applications using Laravel, MySQL, Git, and modern AI-powered development tools such as Claude Code to improve productivity and code quality.
            </p>
            <div className="ctaRow">
              <button
                type="button"
                className="contactLink"
                onClick={handleCopyEmail}
              >
                <MailIcon />
                {emailCopied ? "Copied!" : "its.nelson.dev@gmail.com"}
              </button>
              <a className="contactLink" href="tel:09453208711">
                <PhoneIcon />
                0945 320 8711 ↗
              </a>
            </div>
          </div>
        </div>

        <div className="segmentedControl">
          <button
            className={mobileTab === "experience" ? "active" : ""}
            onClick={() => setMobileTab("experience")}
          >
            EXPERIENCE
          </button>
          <button
            className={mobileTab === "education" ? "active" : ""}
            onClick={() => setMobileTab("education")}
          >
            EDUCATION
          </button>
        </div>

        <div className="twoColumns">
          <div
            className={`column ${
              mobileTab === "experience" ? "mobileShow" : "mobileHide"
            }`}
          >
            <div className="columnHeading">EXPERIENCE</div>
            <div className="ruledList">
              {experiences.map((experience) => (
                <div className="ruledItem" key={experience.id}>
                  <div className="ruledDate">{experience.date}</div>
                  <div className="ruledTitle">{experience.jobRole}</div>
                  <div className="ruledSub">{experience.companyName}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`column ${
              mobileTab === "education" ? "mobileShow" : "mobileHide"
            }`}
          >
            <div className="columnHeading">EDUCATION</div>
            <div className="ruledList">
              {education.map((educ) => (
                <div className="ruledItem" key={educ.id}>
                  <div className="ruledDate">{educ.date}</div>
                  <div className="ruledTitle">{educ.course}</div>
                  <div className="ruledSub">{educ.school}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default About;
