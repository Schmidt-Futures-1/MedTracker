import { useEffect, useState } from "react";
import { Trie } from "./Trie";
import { suggestionsDatabase } from "./suggestionsDatabase";

// Credits: https://dev.to/gregorygaines/build-your-own-google-like-autocomplete-using-react-and-javascript-45co

// Create new Trie using array of medicine names in suggestionsDatabase
const trie = new Trie(suggestionsDatabase);

// Uses the Trie functions in order to filter and autocomplete results based on user inputted search query
const useAutocomplete = (searchQuery) => {

  const [autocompleteResults, setAutocompleteResults] = useState([]);

  // Run whenever the searchQuery changes
  useEffect(() => {

    // Set results when user types something into input, else return nothing
    if (searchQuery.trim().length > 0) {
      setAutocompleteResults(trie.getWords(searchQuery));
    } else {
      setAutocompleteResults([]);
    }

  }, [searchQuery]);

  // Limit results to first 10 entries for ease of use
  return autocompleteResults.slice(0,10);
};

export { useAutocomplete };