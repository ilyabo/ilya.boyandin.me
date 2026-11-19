import { useEffect, useRef, useState } from 'react';
import { matchesItem, type SearchableItem } from '../lib/keyword-search';
import {
  CloseIcon, Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput,
  ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue,
} from './ui/combobox';
import './keyword-search.css';

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
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [query, setQuery] = useState('');
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
    setReady(true);
  }, [plural]);

  useEffect(() => {
    if (!ready) return;
    let count = 0;
    for (const result of results.current) {
      result.element.hidden = !matchesItem(result, selectedKeywords, query);
      if (!result.element.hidden) count++;
    }
    setMatchCount(count);
  }, [selectedKeywords, query, ready]);

  function toggleKeyword(keyword: string) {
    setSelectedKeywords((selected) => selected.includes(keyword)
      ? selected.filter((item) => item !== keyword)
      : [...selected, keyword]);
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
                    setSelectedKeywords([]);
                    setQuery('');
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
