// Credits: https://dev.to/gregorygaines/build-your-own-google-like-autocomplete-using-react-and-javascript-45co
export default function SearchBar(props) {

  const name = props.name;  // Name of search bar - needed to differentiate datalist id's

  return (
    
    <>
        {/* Input where user types in their medicine name */}
        {/* list - references which data list is being shown for this input. requires a unique name if more than 1 datalist on a page */}
        <input
          id="med-name-input"
          className="form-control"
          list={"datalistOptions-"+name}
          type="text"
          placeholder="Enter a medication"
          onChange={(e) => {
            if (props.handleOnChange) {
              props.handleOnChange(e);
            }
          }}
          value={props.searchQuery}
        />

        {/* Datalist that shows the filtered medicine names */}
        {/* Uses the autocomplete results to populate the datalist options */}
        <datalist id={"datalistOptions-"+name}>
            {props.autocompleteResults.map((autocompleteResult, idx) => {
              return (
                <option key={autocompleteResult} value={autocompleteResult}/>
              );
            })}
        </datalist>
        
    </>
  );
  };

