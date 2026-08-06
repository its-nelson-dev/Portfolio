import "./Home.css";
import React, { useState } from "react";
import { TypeAnimation } from "react-type-animation";

import HomeWord from "../../components/HomeWord";

function Home() {
  const [active, setActive] = useState(null);
  const clear = () => setActive(null);

  return (
    <div className="homePage" onClick={clear}>
      <div className={active ? "homeCenter hoverActive" : "homeCenter"}>
        <div className="rightWords" onMouseLeave={clear}>
          <HomeWord
            id="boring"
            idleText="BORING"
            revealedText="PROJECTS"
            to="/Portfolio/Projects"
            active={active}
            onEnter={() => setActive("boring")}
            onLeave={clear}
            onReveal={() => setActive("boring")}
          />
          <HomeWord
            id="bad"
            idleText="IS BAD"
            revealedText="SERVICES"
            to="/Portfolio/Services"
            active={active}
            onEnter={() => setActive("bad")}
            onLeave={clear}
            onReveal={() => setActive("bad")}
          />
        </div>
        <div className="leftWords" onMouseLeave={clear}>
          <HomeWord
            id="for"
            idleText="FOR"
            revealedText="ABOUT ME"
            to="/Portfolio/About"
            active={active}
            onEnter={() => setActive("for")}
            onLeave={clear}
            onReveal={() => setActive("for")}
          />
          <HomeWord
            id="business"
            idleText="BUSINESS"
            idleContent={
              <>
                <span className="desktopOnly">
                  <TypeAnimation
                    sequence={["BUSINESS", 7000, "CAT", 2000]}
                    repeat={Infinity}
                    deletionSpeed={90}
                    speed={1}
                  />
                </span>
                <span className="mobileOnly">BUSINESS</span>
              </>
            }
            revealedText="LET'S TALK"
            to="/Portfolio/About#contact"
            active={active}
            onEnter={() => setActive("business")}
            onLeave={clear}
            onReveal={() => setActive("business")}
          />
        </div>
      </div>

      <div className="homeHintDesktop">{active === null ? "hover a word →" : ""}</div>
      <div className="homeHintMobile">
        {active === null ? "tap a word" : "tap again to open"}
      </div>
    </div>
  );
}

export default Home;
