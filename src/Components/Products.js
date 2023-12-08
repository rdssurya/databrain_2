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
