export interface SearchableProject {
  title: string;
  keywords: string[];
}

export function matchesProject(project: SearchableProject, selectedKeywords: string[], query: string) {
  const keywords = project.keywords.map((keyword) => keyword.toLowerCase());
  const fields = [project.title.toLowerCase(), ...keywords];
  const terms = Array.from(query.toLowerCase().matchAll(/"([^"]*)"|(\S+)/g), (match) =>
    (match[1] ?? match[2]).replace(/^"|"$/g, '').trim()
  ).filter(Boolean);

  return selectedKeywords.every((keyword) => keywords.includes(keyword.toLowerCase()))
    && terms.every((term) => fields.some((field) => field.includes(term)));
}
