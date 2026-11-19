import { useEffect, useRef, useState } from 'react';
import { matchesItem, readSearchFilters, writeSearchFilters, type SearchableItem, type SearchFilters } from '../lib/keyword-search';
import {
  CloseIcon, Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput,
  ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue,
} from './ui/combobox';
import './keyword-search.css';
import './keyword-badges.css';

interface Props {
  collection: 'project' | 'talk';
  keywords: string[];
  keywordCounts: Record<string, number>;
  pinnedKeywords: string[];
}

export default function KeywordSearch({ collection, keywords, keywordCounts, pinnedKeywords }: Props) {
  const heading = collection === 'project' ? 'Projects' : 'Talks';
  const plural = heading.toLowerCase();
  const searchId = `${collection}-search`;
  const [{ selectedKeywords, query }, setFilters] = useState<SearchFilters>({ selectedKeywords: [], query: '' });
  const [ready, setReady] = useState(false);
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const results = useRef<(SearchableItem & { element: HTMLElement })[]>([]);

  useEffect(() => {
    const section = document.getElementById(plural);
    if (!section) return;
    results.current = Array.from(section.querySelectorAll<HTMLElement>('[data-keywords]'), (element) => ({
      element,
      title: element.querySelector('[data-search-title]')?.textContent ?? '',
      keywords: JSON.parse(element.dataset.keywords!) as string[],
      details: Array.from(element.querySelectorAll('[data-search-detail]'), (detail) => detail.textContent ?? ''),
    }));

    function restoreFilters() {
      setFilters(readSearchFilters(new URLSearchParams(window.location.search), keywords));
    }

    restoreFilters();
    setReady(true);
    window.addEventListener('popstate', restoreFilters);
    return () => window.removeEventListener('popstate', restoreFilters);
  }, [keywords, plural]);

  useEffect(() => {
    if (!ready) return;
    let count = 0;
    for (const result of results.current) {
      result.element.hidden = !matchesItem(result, selectedKeywords, query);
      if (!result.element.hidden) count++;
    }
    setMatchCount(count);
  }, [selectedKeywords, query, ready]);

  function updateFilters(update: Partial<SearchFilters>) {
    const url = new URL(window.location.href);
    // A combobox selection can change both the keywords and the input in the same event.
    const filters = { ...readSearchFilters(url.searchParams, keywords), ...update };
    writeSearchFilters(url.searchParams, filters);
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
    setFilters(filters);
  }

  function toggleKeyword(keyword: string) {
    updateFilters({
      selectedKeywords: selectedKeywords.includes(keyword)
        ? selectedKeywords.filter((item) => item !== keyword)
        : [...selectedKeywords, keyword],
    });
  }

  return (
    <div className="keyword-search">
      <div className="keyword-search-heading">
        <h1 className="page-title">{heading}</h1>
        <div className="keyword-search-field" role="search">
          <Combobox
            items={keywords}
            multiple
            value={selectedKeywords}
            onValueChange={(value) => updateFilters({ selectedKeywords: value })}
            inputValue={query}
            onInputValueChange={(value, details) => {
              // Keep free-text searches when the popup closes or focus moves away.
              if (details.reason === 'input-change' || details.isItemPress) updateFilters({ query: value });
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
                id={searchId}
                aria-label={`Search ${plural} and add keyword filters`}
                aria-describedby={`${searchId}-help`}
                placeholder={selectedKeywords.length ? 'Search…' : `Search ${plural}…`}
              />
              {(query || selectedKeywords.length > 0) && (
                <button
                  id={`clear-${searchId}`}
                  className="clear-keyword-search"
                  type="button"
                  aria-label={`Clear ${collection} search and filters`}
                  onClick={() => {
                    updateFilters({ selectedKeywords: [], query: '' });
                    input.current?.focus();
                  }}
                ><CloseIcon /></button>
              )}
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>No matching keywords. Your text still searches {plural}.</ComboboxEmpty>
              <ComboboxList>
                {(keyword: string) => (
                  <ComboboxItem key={keyword} value={keyword} className="keyword-search-option">
                    <span>{keyword}</span>
                    <span className="keyword-search-count">
                      {keywordCounts[keyword]}<span className="sr-only"> {keywordCounts[keyword] === 1 ? collection : plural}</span>
                    </span>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
      <p id={`${searchId}-help`} className="sr-only">Select keywords to match all of them. Use quotes to search for a phrase.</p>
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
      <p id={`${searchId}-status`} role="status" className={matchCount === 0 ? '' : 'sr-only'}>
        {matchCount === null ? '' : matchCount === 0 ? `No ${plural} found.` : `${matchCount} ${matchCount === 1 ? collection : plural} found.`}
      </p>
    </div>
  );
}
