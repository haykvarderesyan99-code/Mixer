import { GiphyFetch } from "@giphy/js-fetch-api";
import type { IGif } from "@giphy/js-types";
import { Grid, SearchBar, SearchContextManager } from "@giphy/react-components";
import { useMemo, useState } from "react";

type GifPickerProps = {
  onSelect: (gif: IGif) => void;
};

const apiKey = import.meta.env.VITE_GIPHY_API_KEY;

export default function GifPicker({ onSelect }: GifPickerProps) {
  const [term, setTerm] = useState("");
  const [error, setError] = useState("");
  const fetcher = useMemo(() => apiKey ? new GiphyFetch(apiKey) : null, []);

  if (!apiKey || !fetcher) {
    return (
      <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
        Add <strong>VITE_GIPHY_API_KEY</strong> to <strong>.env.local</strong> to enable GIF search.
      </div>
    );
  }

  const fetchGifs = (offset: number) => {
    const request = term.trim()
      ? fetcher.search(term.trim(), { offset, limit: 18, rating: "pg", type: "gifs" })
      : fetcher.trending({ offset, limit: 18, rating: "pg", type: "gifs" });
    return request.catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : "GIPHY could not load GIFs.");
      throw reason;
    });
  };

  return (
    <div className="rounded-[28px] border border-pink-400/20 bg-slate-900 p-4 shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">GIFs for every mood</p>
          <p className="mt-1 text-xs text-slate-400">Trending now · PG rated</p>
        </div>
        <span className="text-xs font-semibold text-slate-400">Powered By GIPHY</span>
      </div>
      <SearchContextManager
        apiKey={apiKey}
        shouldDefaultToTrending
        options={{ rating: "pg", type: "gifs", limit: 18 }}
        theme={{ darkMode: true, searchbarHeight: 44, mobileSearchbarHeight: 44 }}
      >
        <div className="mt-4 overflow-hidden rounded-2xl [&_input]:bg-slate-950 [&_input]:text-white [&_input]:placeholder:text-slate-500">
          <SearchBar
            placeholder="Search GIPHY"
            clear
            searchDebounce={250}
            onEnter={(value) => {
              setError("");
              setTerm(value);
            }}
          />
        </div>
        {error ? (
          <div className="mt-3 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-100">
            <p>GIFs are temporarily unavailable.</p>
            <button type="button" onClick={() => { setError(""); setTerm((value) => `${value} `.trim()); }} className="mt-2 font-semibold underline">Try again</button>
          </div>
        ) : null}
        <div className="mt-4 max-h-80 overflow-y-auto rounded-2xl bg-slate-950/60 p-2">
          <Grid
            width={320}
            columns={3}
            gutter={6}
            fetchGifs={fetchGifs}
            onGifClick={(gif) => onSelect(gif)}
            onGifsFetchError={(reason) => setError(reason.message)}
            noLink
            borderRadius={12}
            noResultsMessage="No GIFs found. Try another search."
          />
        </div>
      </SearchContextManager>
      <p className="mt-3 text-center text-[11px] text-slate-500">Select a GIF to send it to this chat</p>
    </div>
  );
}