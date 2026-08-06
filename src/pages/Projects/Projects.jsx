import React, { useEffect, useState } from "react";
import "./Projects.css";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { projects } from "../../details";
import { getStackLabels, getProjectLinks } from "../../utils/projectMeta";
import ProjectPlaceholder from "./ProjectPlaceholder";
import ProjectSlideshow from "./ProjectSlideshow";

function ProjectDetailsCard({ project, showFeaturedLabel }) {
  const { liveUrl, codeUrl } = getProjectLinks(project);
  const stackLabels = getStackLabels(project.imgs);

  return (
    <div className="spotlight">
      {project.gallery?.length ? (
        <ProjectSlideshow
          images={project.gallery}
          alt={project.title}
          variant="spotlight"
        />
      ) : (
        <ProjectPlaceholder
          variant="spotlight"
          image={project.image}
          alt={project.title}
        />
      )}
      <div className="spotlightBody">
        {showFeaturedLabel && (
          <span className="spotlightLabel">
            FEATURED{project.year ? ` · ${project.year}` : ""}
          </span>
        )}
        <h2 className="spotlightTitle">{project.title}</h2>
        <p className="spotlightDescription">{project.description}</p>
        <div className="stackTags">
          {stackLabels.map((label) => (
            <span className="stackTag" key={label}>
              {label}
            </span>
          ))}
        </div>
        <div className="spotlightLinks">
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              Try it here ↗
            </a>
          )}
          {liveUrl && codeUrl && <span className="linkDivider">·</span>}
          {codeUrl && (
            <a href={codeUrl} target="_blank" rel="noopener noreferrer">
              Code ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const location = useLocation();
  const [projectList, setProjectList] = useState(projects);
  const spotlightProject = projectList[0];

  useEffect(() => {
    if (location.hash !== "#spotlight") return;
    document
      .getElementById("spotlight")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  const promoteProject = (id) => {
    setProjectList((current) => {
      const selected = current.find((project) => project.id === id);
      const rest = current.filter((project) => project.id !== id);
      return [selected, ...rest];
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      className="projectsPage"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18 }}
    >
      <header className="projectsHeader">
        <h1 className="projectsHeading">Projects</h1>
        <p className="projectsSubhead">{projectList.length} shipped.</p>
      </header>

      <div className="spotlightWrap" id="spotlight">
        <ProjectDetailsCard project={spotlightProject} showFeaturedLabel />
      </div>

      <hr className="rule" />

      <div className="projectsGrid">
        {projectList.map((project) => (
          <button
            type="button"
            className="gridItem"
            key={project.id}
            onClick={() => promoteProject(project.id)}
          >
            <ProjectPlaceholder
              variant="grid"
              image={project.image}
              alt={project.title}
            />
            <h3 className="gridTitle">{project.title}</h3>
          </button>
        ))}
      </div>

      <div className="mobileProjectList">
        {projectList.map((project) => (
          <ProjectDetailsCard key={project.id} project={project} />
        ))}
      </div>
    </motion.div>
  );
}

export default Projects;
