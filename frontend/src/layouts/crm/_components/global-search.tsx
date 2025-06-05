// import { api } from "@/api";
import { useIsMobile } from '@/hooks/use-mobile';
import { SearchIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'throttle-debounce';

import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
// import { api } from '@/lib/api';

// type Data = {
//   id: number;
//   name: string;
//   email_address: string;
//   phone: string;
//   status: string;
// };

// type Highlighting = {
//   [K in keyof Data]?: string;
// };

// type ResponseData = {
//   data: Data;
//   highlighting: Highlighting;
// };

const DEBOUNCE_DELAY = 500;
const SHORTCUT_KEY = 'k';

// interface SearchResultItemProps {
//   item: ResponseData;
//   onSelect: () => void;
// }

// const SearchResultItem = ({ item, onSelect }: SearchResultItemProps) => (
//   <div
//     className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-muted"
//     onClick={onSelect}
//   >
//     {Object.keys(item.data).map((key) => {
//       const value = item.data[key as keyof Data];
//       const highlightedValue = item.highlighting[key as keyof Data];
//       return (
//         <div
//           key={key}
//           className="grid grid-cols-[7rem_1fr] items-center leading-6"
//         >
//           <span className="capitalize text-muted-foreground">
//             {key.replace('_', ' ')}:
//           </span>
//           {highlightedValue ? (
//             <span
//               dangerouslySetInnerHTML={{
//                 __html: highlightedValue,
//               }}
//             />
//           ) : (
//             <span>{value}</span>
//           )}
//         </div>
//       );
//     })}
//   </div>
// );

export function GlobalSearch() {
  // const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // const [results, setResults] = useState<ResponseData[]>([]);
  // const [isSearching, setIsSearching] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    console.log('query', query);
    // if (!query.trim()) {
    //   setResults([]);
    //   setIsSearching(false);
    //   return;
    // }

    // try {
    //   const response = await api.get(
    //     `/search?query=${encodeURIComponent(query)}`
    //   );
    //   setResults(response.data);
    //   setError(null);
    // } catch (error) {
    //   console.error(error);
    //   setResults([]);
    //   setError('Failed to fetch search results');
    // } finally {
    //   setIsSearching(false);
    // }
  }, []);

  const debouncedSearch = useCallback(
    debounce(DEBOUNCE_DELAY, handleSearch, { atBegin: false }),
    [handleSearch]
  );

  const handleInputChange = (search: string) => {
    // setIsSearching(true);
    setSearchTerm(search);
    debouncedSearch(search);
  };

  // const handleResultSelect = (itemId: number) => {
  //   setOpen(false);
  //   navigate(`/crm/requests/${itemId}`);
  // };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === SHORTCUT_KEY && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size={isMobile ? 'icon' : 'default'}
      >
        <SearchIcon />
        <span className="hidden md:block">Search anything...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 md:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
        {/* <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd> */}
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          // isLoading={isSearching}
          placeholder="Search anything"
          value={searchTerm}
          onValueChange={handleInputChange}
        />
        <CommandList className="max-h-[470px]">
          {/* {error && <CommandEmpty>{error}</CommandEmpty>}
          {!error && results.length < 1 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )} */}
          <div className="divide-y">
            {/* {results.map((item, index) => (
              <SearchResultItem
                key={`${item.data.id}-${index}`}
                item={item}
                onSelect={() => handleResultSelect(item.data.id)}
              />
            ))} */}
          </div>
        </CommandList>
      </CommandDialog>
    </>
  );
}
