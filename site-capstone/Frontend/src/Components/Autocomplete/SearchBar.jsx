

export default function SearchBar(props) {
  // Check if we have any autocomplete results
  const hasSearchResults = props.autocompleteResults.length > 0;

  return (
    <>
      <div
        className={`border `}
      >
        {/* <div className="grid place-items-center z-40">
          <MagnifyingGlass />
        </div> */}
        <input
          className="form-control"
          list="datalistOptions"
          type="text"
          onChange={(e) => {
            if (props.handleOnChange) {
              props.handleOnChange(e);
            }
          }}
          value={props.searchQuery}
        />
        <datalist id="datalistOptions">
            {props.autocompleteResults.map((autocompleteResult, idx) => {
              console.log(props.searchQuery)
              return (
                <option key={idx} value={autocompleteResult}/>
              );
            })}
        </datalist>
      </div>
      {/* {!hasSearchResults && <SearchButtons />} */}
      {//</>hasSearchResults && (
        // <div className="searchBar mx-auto border border-t-0 rounded-2xl rounded-t-none py-3 shadow-lg">
        //   <ul>
        //     {props.autocompleteResults.map((autocompleteResult) => {
        //       return (
        //         <li>
        //           {/* <MagnifyingGlass />{" "} */}
        //           {boldPassedPrefix(autocompleteResult, props.searchQuery)}
        //         </li>
        //       );
        //     })}
        //   </ul>

        //   {/* <SearchButtons /> */}
        // </div>
      //)
    }

    </>
  );
  };

export function boldPassedPrefix(text, prefix) {
    return (
      <span>
        {text.slice(0, prefix.length)}
        <span className="font-bold">{text.slice(prefix.length)}</span>
      </span>
    );
  };