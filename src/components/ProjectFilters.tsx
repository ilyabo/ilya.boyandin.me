import { useEffect, useRef, useState } from 'react';
import { matchesProject, type SearchableProject } from '../lib/project-search';
import {
  CloseIcon, Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput,
  ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue,
} from './ui/combobox';
import './project-filters.css';

interface Props {
  keywords: string[];
  pinnedKeywords: string[];
}

export default function ProjectFilters({ keywords, pinnedKeywords }: Props) {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [ready, setReady] = useState(false);
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const cards = useRef<(SearchableProject & { element: HTMLElement })[]>([]);

  useEffect(() => {
    cards.current = Array.from(document.querySelectorAll<HTMLElement>('#projects .content-card'), (element) => ({
      element,
      title: element.querySelector('h2')!.textContent,
      keywords: JSON.parse(element.dataset.keywords!) as string[],
    }));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    let count = 0;
    for (const card of cards.current) {
      card.element.hidden = !matchesProject(card, selectedKeywords, query);
      if (!card.element.hidden) count++;
    }
    setMatchCount(count);
  }, [selectedKeywords, query, ready]);

  function toggleKeyword(keyword: string) {
    setSelectedKeywords((selected) => selected.includes(keyword)
      ? selected.filter((item) => item !== keyword)
      : [...selected, keyword]);
  }

  return (
    <div className="project-filters">
      <div className="projects-heading">
        <h1 className="page-title">Projects</h1>
        <div className="project-search" role="search">
          <Combobox
            items={keywords}
            multiple
            value={selectedKeywords}
            onValueChange={setSelectedKeywords}
            inputValue={query}
            onInputValueChange={(value, details) => {
              // Keep free-text searches when the popup closes or focus moves away.
              if (details.reason === 'input-change' || details.isItemPress) setQuery(value);
            }}
            disabled={!ready}
          >
            <ComboboxChips ref={anchor}>
              <svg className="search-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" />
              </svg>
              <ComboboxValue>
                {(values: string[]) => values.map((keyword) => (
                  <ComboboxChip key={keyword}>{keyword}</ComboboxChip>
                ))}
              </ComboboxValue>
              <ComboboxChipsInput
                ref={input}
                id="project-search"
                aria-label="Search projects and add keyword filters"
                aria-describedby="project-search-help"
                placeholder={selectedKeywords.length ? 'Search…' : 'Search projects…'}
              />
              {(query || selectedKeywords.length > 0) && (
                <button
                  id="clear-project-search"
                  className="clear-project-search"
                  type="button"
                  aria-label="Clear project search and filters"
                  onClick={() => {
                    setSelectedKeywords([]);
                    setQuery('');
                    input.current?.focus();
                  }}
                ><CloseIcon /></button>
              )}
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>No matching keywords. Your text still searches projects.</ComboboxEmpty>
              <ComboboxList>
                {(keyword: string) => <ComboboxItem key={keyword} value={keyword}>{keyword}</ComboboxItem>}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
      <p id="project-search-help" className="sr-only">Select keywords to match all of them. Type to search names and keywords; use quotes for phrases.</p>
      <div className="keyword-badges" role="group" aria-label="Filter by keyword">
        {pinnedKeywords.map((keyword) => (
          <button
            key={keyword}
            type="button"
            data-keyword={keyword}
            aria-pressed={selectedKeywords.includes(keyword)}
            disabled={!ready}
            onClick={() => toggleKeyword(keyword)}
          >{keyword}</button>
        ))}
      </div>
      <p id="project-search-status" role="status" className={matchCount === 0 ? '' : 'sr-only'}>
        {matchCount === null ? '' : matchCount === 0 ? 'No projects found.' : `${matchCount} projects found.`}
      </p>
    </div>
  );
}
