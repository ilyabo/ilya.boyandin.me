export interface SearchableProject {
  title: string;
  keywords: string[];
}

export function getKeywordIndex(projects: SearchableProject[], pinnedKeywords: string[]) {
  const labels = new Map<string, string>();
  const counts = new Map<string, number>();
  for (const project of projects) {
    const seen = new Set<string>();
    for (const keyword of project.keywords) {
      const key = keyword.toLowerCase();
      labels.set(key, keyword);
      seen.add(key);
    }
    for (const key of seen) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  for (const keyword of pinnedKeywords) labels.set(keyword.toLowerCase(), keyword);

  const projectCounts = Object.fromEntries(
    Array.from(labels, ([key, label]) => [label, counts.get(key) ?? 0] as const)
  );
  const keywords = [...labels.values()].sort((a, b) => projectCounts[b] - projectCounts[a] || a.localeCompare(b));
  return { keywords, projectCounts };
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
