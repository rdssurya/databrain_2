import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Filters from "./Filters";
import "../Styles/Products.css";


export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtersButtonIsClosed, setFiltersButtonIsClosed] = useState(true);
  const [currentlyShowing, setCurrentlyShowing] = useState("");

  /**
   * useEffect Hook to retrieve JSON data from API endpoint on page load
   */
  useEffect(() => {
    makingAPICallToFetchProducts();
    initializeKeysInLocalStorage();
  }, []);

  /**
   * Definition of makingAPICallToFetchProducts()
   * Function that is called inside useEffect Hook on intial page load
   *
   * API endpoint - GET 'https://dummyjson.com/products'
   * Handles any errors by displaying an error message on the screen
   */
  const makingAPICallToFetchProducts = async () => {
    try {
      const url =
        "https://dummyjson.com/products";
      const response = await fetch(url);
      const data = await response.json();
      data.products.sort((a,b)=>a.price - b.price);
      setProducts([...data.products]);
      localStorage.setItem("allProducts", JSON.stringify([...data.products]));
    } catch (e) {
      throw new Error(e);
    }
  };

  /**
   * Function which is called in useEffect Hook
   * If there are cartItems in localStorage that means we need to retain cartItems data for the user across pages
   * This function sets the required keys to empty arrays on local storage only when there are no cartItems in local storage
   * We store data in these arrays so as to use the corresponding data across our pages
   * Also we initialise appliedFilters to the required data structure
   */
  const initializeKeysInLocalStorage = () => {
      const keysOfLocalStorage = [
        "allProducts",
      ];
      keysOfLocalStorage.forEach((key) => {
        localStorage.setItem(key, JSON.stringify([]));
      });
      localStorage.setItem(
        "appliedFilters",
        JSON.stringify({
          brand: [],
          category: [],
        })
      );
  };


  /**
   * Function which is called on clicking Apply/Clear Filters
   * If previously the filters are closed(not displayed) i.e. button is closed before clicking event
   * Then first all the filters are set to empty arrays in local storage so as to allow user to apply filters afresh.
   * If previously the filters are open (displayed) i.e. button is open before clicking event
   * All the products will be shown on the screen by updating products array once we click the filters button (closing the filters)
   */
  const handleFiltersClick = () => {
    if (filtersButtonIsClosed) {
      localStorage.setItem(
        "appliedFilters",
        JSON.stringify({
          brand: [],
          category: [],
        })
      );
    } else {
      setCurrentlyShowing("");
      const allAvailableProducts = JSON.parse(
        localStorage.getItem("allProducts")
      );
      if(document.getElementById("sort")[1].selected === true){
        setProducts(allAvailableProducts.sort((a,b)=>a.price-b.price));
      }
      else{
        setProducts(allAvailableProducts.sort((a,b)=>b.price-a.price));
      }
    }
    setFiltersButtonIsClosed(!filtersButtonIsClosed);
  };

  const handleSort = (e) => {
    let arr = products.sort((a,b) => b.price-a.price);
    if(e.target.value === "high"){
      setProducts([...arr]);
    }
    else{
      setProducts([...arr.reverse()]);
    }
  }
  /**
   * Updates the products list according to the applied filters
   * Function which is called when there is a change in applied filters
   *
   * @param { Array.<Product> } filteredProducts - Array of filtered products
   *      Array of objects with complete data on all products according to filters
   * This function is PASSED AS PROPS TO FILTERS component which is used whenever there is change of filters
   * Updates the products array so as to display the filtered products
   */
  const filteredProductsListUpdater = (filteredProducts) => {
    setProducts(filteredProducts);
  };

  // Products component
  return (
    <>
        <>
        <span>Price: </span><select name="Sort By" id="sort" style={{margin:"10px"}} onChange={handleSort}>
          <option value="high">High to Low</option>
          <option value="low" selected>Low to High</option>
        </select>
          {/* Container with products and filters */}
          <div className="parent-grid-container">
            <div className="display-filters-md">
              <button
                onClick={handleFiltersClick}
              >
                <span className="filters-btn">Apply/Clear Filters</span>
              </button>
              {filtersButtonIsClosed ? (
                <></>
              ) : (
                <Filters
                  listedProducts={products}
                  updaterProp={filteredProductsListUpdater}
                />
              )}
            </div>

            
              {products.length === 0 ? (
                <h2 className="sorry-msg">
                  Sorry! Products based on your requirements are not available.
                  Clear filters to view available products.
                </h2>
              ) : (
                <>
                  {currentlyShowing !== "" ? (
                    <h3>Currently Showing: {currentlyShowing}</h3>
                  ) : (
                    <></>
                  )}
                  <div className="products-grid-container">
                    {products.map((product) => (
                      <div key={product.id} className="product-card">
                        <ProductCard
                          name={product.title}
                          cost={product.price}
                          image={product.thumbnail}
                          currency={product.currency}
                          id={product.id}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          
        </>
      
    </>
  );
}