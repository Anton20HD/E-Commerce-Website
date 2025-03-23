
"use client"


import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    image: string[];
    category: string;
    subCategory: string;
  }

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: Product[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {

    const fetchProducts = async() => {
        try {
            const response = await fetch("/api/products");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }
    fetchProducts();
  }, []);

  useEffect(() => {

    setFilteredProducts(
        products.filter((product) => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
  }, [searchTerm, products]);


  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, filteredProducts }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if(!context) {
        throw new Error("useSearch must be used within a SearchProvider")
    }
    return context;
}
