import React from "react";
import "../Styles/FilterComponent.css";

export default function FilterComponent(props) {
  const allProducts = JSON.parse(localStorage.getItem("allProducts"));
  const appliedFilters = JSON.parse(localStorage.getItem("appliedFilters"));

  
  const filterProductsWithUpdatedFilters = (updatedFilters) => {
    const productsList = [...allProducts];
    const productsFilteredByBrand = performingFilteringOperation(
      productsList,
      updatedFilters,
      "brand"
    );
    const productsFilteredByCategory = performingFilteringOperation(
      productsFilteredByBrand,
      updatedFilters,
      "category"
    );
  
    const filteredProductsWithAllTheAppliedFilters = [
      ...productsFilteredByCategory,
    ];
    if(document.getElementById("sort")[0].selected === true){
      filteredProductsWithAllTheAppliedFilters.sort((a,b)=>b.price-a.price);
    }
    else{
      filteredProductsWithAllTheAppliedFilters.sort((a,b)=>a.price-b.price);
    }
    props.handlingUpdates(filteredProductsWithAllTheAppliedFilters);
  };

  
  const performingFilteringOperation = (
    productsToBeFiltered,
    filtersObject,
    filterKey
  ) => {
      const filteredProductsAccordingToFilterKey = productsToBeFiltered.filter(
        (product) =>
          filtersObject[filterKey].length === 0 ||
          filtersObject[filterKey].includes(product[filterKey])
      );
      return filteredProductsAccordingToFilterKey;
  };

  
  const handleCheckboxClick = (filterKey, checkboxValue) => {
    filterKey = filterKey.toLowerCase();
    const updatedFilters = {
      ...appliedFilters,
      [filterKey]: appliedFilters[filterKey].includes(checkboxValue)
        ? appliedFilters[filterKey].filter((item) => item !== checkboxValue)
        : [...appliedFilters[filterKey], checkboxValue],
    };
    localStorage.setItem("appliedFilters", JSON.stringify(updatedFilters));
    filterProductsWithUpdatedFilters(updatedFilters);
  };

  // Return a component with Filter Key as heading and Filter values as checkboxes
  return (
    <div className="filter-component">
      {/* Filter Key will be shown here */}
      <span className="filter-heading">{props.filterKey}</span>
      <br />
      {/* Filter values will be shown here */}
      {props.filterValues.map((filterValue) => (
        <label key={filterValue} className="filter-values">
          <input
            type="checkbox"
            name={props.filterKey}
            onChange={(e) => handleCheckboxClick(e.target.name, e.target.value)}
            value={filterValue}
          />
          {filterValue}
          <br />
        </label>
      ))}
    </div>
  );
}
