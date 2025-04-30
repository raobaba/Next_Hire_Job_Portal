import React, { useState, useEffect } from "react";
import { FiPlus, FiMinus, FiX } from "react-icons/fi";

const FilterCard = ({ setSearchParams,filterOptions }) => {

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);


  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleFilterSelection = (filterType, filterValue) => {
    const filterKey = filterType.toLowerCase();

    // Handle unique selections for Location, Job Type, and Salary
    if (["location", "job type", "salary"].includes(filterKey)) {
      const existingFilter = selectedFilters.find(
        (filter) => filter.type === filterKey
      );

      // Update or add new filter
      if (existingFilter) {
        setSelectedFilters((prev) =>
          prev.map((filter) =>
            filter.type === filterKey
              ? { ...filter, value: filterValue }
              : filter
          )
        );
      } else {
        setSelectedFilters((prev) => [
          ...prev,
          { type: filterKey, value: filterValue },
        ]);
      }
    } else {
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
    }
  };

  // Remove a filter chip
  const removeFilter = (filterType, filterValue) => {
    setSelectedFilters((prev) =>
      prev.filter(
        (filter) =>
          !(
            filter.type === filterType.toLowerCase() &&
            filter.value === filterValue
          )
      )
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 600);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const updatedSearchParams = {
      title: debouncedSearchTerm,
      location: selectedFilters.find((f) => f.type === "location")?.value || "",
      jobType: selectedFilters.find((f) => f.type === "job type")?.value || "",
      salary: selectedFilters.find((f) => f.type === "salary")?.value || "",
      page: 1,
    };

    setSearchParams((prevParams) => ({
      ...prevParams,
      ...updatedSearchParams,
    }));
  }, [selectedFilters, debouncedSearchTerm, setSearchParams]);

  return (
    <div className='border rounded-lg p-4'>
      <h2 className='font-bold mb-2'>Filters</h2>
      <div className='space-y-4'>
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Search by title, skills, company name...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='border rounded w-full p-2'
          />
        </div>
        {selectedFilters.length > 0 && (
          <div>
            <div className='flex flex-wrap'>
              {selectedFilters.map((filter, index) => (
                <div
                  key={index}
                  className='flex items-center bg-blue-100 text-blue-600 rounded-md m-[3px] px-1 py-1'
                >
                  <span className='text-[10px]'>{filter.value}</span>
                  <FiX
                    className='ml-1 text-[12px] cursor-pointer'
                    onClick={() => removeFilter(filter.type, filter.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {filterOptions.map((filter, index) => (
          <div key={filter.filterType}>
            <div
              className='flex items-center justify-between cursor-pointer'
              onClick={() => toggleExpand(index)}
            >
              <h3 className='font-semibold'>{filter.filterType}</h3>
              {expandedIndex === index ? <FiMinus /> : <FiPlus />}
            </div>
            {expandedIndex === index && (
              <div className='mt-1 space-y-1'>
                {filter.array.map((item) => (
                  <div key={item} className='flex items-center'>
                    <input
                      type='checkbox'
                      id={item}
                      checked={selectedFilters.some(
                        (filter) => filter.value === item
                      )}
                      onChange={() =>
                        handleFilterSelection(filter.filterType, item)
                      }
                      className='mr-1'
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
