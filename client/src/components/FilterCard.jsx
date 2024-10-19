import React, { useState, useEffect } from "react";
import { FiPlus, FiMinus, FiX } from "react-icons/fi";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Job Type",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"],
  },
];

const FilterCard = ({ setFilterJobs, setSearchParams }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleFilterSelection = (filterType, filterValue) => {
    const filterKey = filterType.toLowerCase();
    const isSelected = selectedFilters.some(
      (filter) => filter.type === filterKey && filter.value === filterValue
    );

    if (isSelected) {
      setSelectedFilters((prev) =>
        prev.filter(
          (filter) =>
            !(filter.type === filterKey && filter.value === filterValue)
        )
      );
    } else {
      setSelectedFilters((prev) => [
        ...prev,
        { type: filterKey, value: filterValue },
      ]);
    }
  };

  // Debounced effect for searchTerm
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const dynamicSearchParams = { title: searchTerm };
      setSearchParams((prevParams) => ({
        ...prevParams,
        ...dynamicSearchParams,
      }));
    }, 300); // Debounce delay

    return () => clearTimeout(timeoutId); // Cleanup on component unmount or when searchTerm changes
  }, [searchTerm, setSearchParams]);

  return (
    <div className="border rounded-lg p-4">
      <h2 className="font-bold mb-2">Filters</h2>
      <div className="space-y-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        {selectedFilters.length > 0 && (
          <div className="mt-2">
            <h4 className="font-semibold">Selected Filters:</h4>
            <div className="flex flex-wrap">
              {selectedFilters.map((filter, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-600 rounded-md px-1 py-1"
                >
                  <span className="text-[10px]">{filter.value}</span>
                  <FiX
                    className="ml-1 text-[12px] cursor-pointer"
                    onClick={() =>
                      handleFilterSelection(filter.type, filter.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {filterData.map((filter, index) => (
          <div key={filter.filterType}>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <h3 className="font-semibold">{filter.filterType}</h3>
              {expandedIndex === index ? <FiMinus /> : <FiPlus />}
            </div>
            {expandedIndex === index && (
              <div className="mt-1 space-y-1">
                {filter.array.map((item) => (
                  <div key={item} className="flex items-center">
                    <input
                      type="checkbox"
                      id={item}
                      checked={selectedFilters.some(
                        (filter) => filter.value === item
                      )}
                      onChange={() =>
                        handleFilterSelection(filter.filterType, item)
                      }
                      className="mr-1"
                    />
                    <label htmlFor={item}>{item}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;
