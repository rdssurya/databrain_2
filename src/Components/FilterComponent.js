import React from "react";
import "../Styles/FilterComponent.css";

export default function FilterComponent(props) {
  const allProducts = JSON.parse(localStorage.getItem("allProducts"));
  const appliedFilters = JSON.parse(localStorage.getItem("appliedFilters"));

  /**
   * Function which is called when any filter value is checked or unchecked
   * @param {Object} updatedFilters
   * If user has not serached for any products then filtering operation will be done on all the store products
   * If user has searched for a product then filtering operation will be done on the list of searched products
   * When we have the required products list according to the above conditions
   * We perform filtering operation by gender, color, type and price one after the other using the prformFilteringOperation function...
   * Atlast we call the handling updates function provided to us a prop to inform the connectorFunction in Filters Copmonent
   *  that new filters are applied to products and connector function informs the Products component to render those filtered products
   */
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

  /**
   * Function which performs filter operation on a list of products with specified filter key
   *
   * @param {Array.<Product>} productsToBeFiltered
   * @param {Object} filtersObject
   * @param {string} filterKey
   * Takes a list of products, filtersObject from local storage and filterKey as arguments
   * If filterKey is 'price' then filtering will be done according to price of product by comparing all the price ranges selected by the user
   * and filtering out the products whose price falls in between the selected price ranges and returns the filtered products...
   * In other cases returns all the products from list of given products which have their product[filterKey] value included in their filtersObject[filterKey]
   * Ex: filtersObject['color'] is an array of filterValues like ['Blue','Red','Yellow',...]
   * Now products with their color, if included in filtersObject['color'] array only those products will be filtered...
   * @returns {Array.<Product>}
   */
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

  /**
   * Function which will be called on clicking a checkbox of the filters
   *
   * @param {string} filterKey
   * @param {string} checkboxValue
   * Takes the particular filterKey like 'Gender', 'Type' and checkboxValue like 'Male', 'Polo' as arguments
   * Now the filterKey will be checked in the filters object, which we have from our local storage which contains
   * details of applied filters, if the filterKey of filters object has our checkbox value that means
   * User has previously checked/applied the filter and now it has been unchecked so we update appliedFilters by excluding that checkbox value
   * If the checkbox value is not present in the filterKey of filters object then we add that particular checkbox value to the filterKey
   * Finally, we set the appliedFilters in local storage with updated filters
   * and We call the filterProductsWithUpdatedFilters function to perform filtering operation
   * Note: appliedFilters are of format ['gender':['Male','Female'],'type':["Polo","Round",..],...]
   */
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