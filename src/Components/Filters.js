import React, { useEffect, useState } from "react";
import FilterComponent from "./FilterComponent";


export default function Filters(props) {
  const [listOfFilters, setListOfFilters] = useState([]);

  /**
   * Use Effect Hook ensures that we have our list of filters with us once the component mounts
   */
  useEffect(() => {
    const availableProducts = [
      ...JSON.parse(localStorage.getItem("allProducts")),
    ];

    /**
     * Defintion of Unique filters array
     * Function which is called when component mounts
     * @param {Array.<Product>} arrayOfAvailableProducts
     * Returns us the unique filters array with each element in the format [ filterKey, [filterValues]]
     * Ex: Output: [["Gender",["Male","Female"]],["Color",["Red","Black"]]]
     * Filter Values will have no duplicate values
     */
    const arrayOfUniqueFilterKeysAndValues = (arrayOfAvailableProducts) => {
      const uniqueBrands = [
        "Brand",
        getUniqueFilterValues(arrayOfAvailableProducts, "brand"),
      ];
      const uniqueCategories = [
        "Category",
        getUniqueFilterValues(arrayOfAvailableProducts, "category"),
      ];
      setListOfFilters([uniqueBrands, uniqueCategories]);
    };

    //calling the above function
    arrayOfUniqueFilterKeysAndValues(availableProducts);
  }, []);

  /**
   * Extracts unique values from a list of products based on a specified filter key
   *
   * @param {Array.<Product>} productsList
   * @param {string} filterKey
   * @returns {Array} - Array of unique filter values
   * Returns all the unique filter values possible based on the given products list and filter key
   * Ex: Output: ["Male","Female"]
   */
  const getUniqueFilterValues = (productsList, filterKey) => {
    const filterValuesWithDuplicates = productsList.map(
      (product) => product[filterKey]
    );
    const uniqueFilterValues = [...new Set(filterValuesWithDuplicates)];
    return uniqueFilterValues;
  };

  /**
   * Connector function between Products component and FilterComponent
   *
   * @param {Array<Product>} filteredProductsArray
   * This function calls the filteredProductsListUpdater in Products component which updates the
   * products list with the filtered products accordingly
   */
  const connectorFunction = (updatedFilteredProducts) => {
    props.updaterProp(updatedFilteredProducts);
  };

  // Filters returns a JSX component which provides the FilterComponent with our unique list of filters
  return (
    <div className="filters-div">
      {/* Dynamically updating the page by passing filter keys and values as props to FilterComponent */}
      {listOfFilters.map((filter) => (
        <FilterComponent
          filterKey={filter[0]}
          filterValues={filter[1]}
          key={filter[0]}
          handlingUpdates={connectorFunction}
        />
      ))}
    </div>
  );
}