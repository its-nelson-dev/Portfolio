const STACK_LABELS = [
  ["html", "HTML"],
  ["css", "CSS"],
  ["javascript", "JavaScript"],
  ["react", "React"],
  ["nodejs", "Node"],
  ["mongodb", "MongoDB"],
  ["php", "PHP"],
  ["laravel", "Laravel"],
  ["mysql", "MySQL"],
];

export function getStackLabels(imgs) {
  const labels = imgs
    .map((img) => {
      const match = STACK_LABELS.find(([key]) => img.includes(key));
      return match ? match[1] : null;
    })
    .filter(Boolean);

  return [...new Set(labels)];
}

export function getProjectLinks(project) {
  if (!project.link) {
    return { liveUrl: null, codeUrl: null };
  }
  if (project.codeLink) {
    return { liveUrl: project.link, codeUrl: project.codeLink };
  }
  if (project.link.includes("github.com")) {
    return { liveUrl: null, codeUrl: project.link };
  }
  return { liveUrl: project.link, codeUrl: null };
}
