export interface SearchableItem {
  title: string;
  keywords: string[];
  details?: string[];
}

export function getKeywordIndex(items: SearchableItem[], pinnedKeywords: string[]) {
  const labels = new Map<string, string>();
  const counts = new Map<string, number>();
  for (const item of items) {
    const seen = new Set<string>();
    for (const keyword of item.keywords) {
      const key = keyword.toLowerCase();
      labels.set(key, keyword);
      seen.add(key);
    }
    for (const key of seen) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  for (const keyword of pinnedKeywords) labels.set(keyword.toLowerCase(), keyword);

  const keywordCounts = Object.fromEntries(
    Array.from(labels, ([key, label]) => [label, counts.get(key) ?? 0] as const)
  );
  const keywords = [...labels.values()].sort((a, b) => keywordCounts[b] - keywordCounts[a] || a.localeCompare(b));
  return { keywords, keywordCounts };
}

export function matchesItem(item: SearchableItem, selectedKeywords: string[], query: string) {
  const keywords = item.keywords.map((keyword) => keyword.toLowerCase());
  const fields = [item.title.toLowerCase(), ...keywords, ...(item.details ?? []).map((detail) => detail.toLowerCase())];
  const terms = Array.from(query.toLowerCase().matchAll(/"([^"]*)"|(\S+)/g), (match) =>
    (match[1] ?? match[2]).replace(/^"|"$/g, '').trim()
  ).filter(Boolean);

  return selectedKeywords.every((keyword) => keywords.includes(keyword.toLowerCase()))
    && terms.every((term) => fields.some((field) => field.includes(term)));
}
