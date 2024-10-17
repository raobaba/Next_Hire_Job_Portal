import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { FiPlus, FiMinus, FiX } from "react-icons/fi"; // Import icons

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"],
  },
];

const FilterCard = ({ setFilterJobs, setSearchParams }) => {
  const [selectedFilters, setSelectedFilters] = useState([]); // Track selected filters
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const changeHandler = (value) => {
    // Check if the filter is already selected
    if (selectedFilters.includes(value)) {
      // If selected, remove it
      setSelectedFilters((prev) => prev.filter((filter) => filter !== value));
    } else {
      // If not selected, add it
      setSelectedFilters((prev) => [...prev, value]);
    }
  };

  const removeFilter = (filter) => {
    setSelectedFilters((prev) => prev.filter((f) => f !== filter)); // Remove selected filter from state
  };

  // Update search parameters and filtered jobs based on selected filters and search term
  useEffect(() => {
    // Prepare the dynamic search parameters
    const dynamicSearchParams = {
      title: searchTerm,
      location: selectedFilters.filter((filter) =>
        filterData[0].array.includes(filter)
      ), // Example of how to use filters
      industry: selectedFilters.filter((filter) =>
        filterData[1].array.includes(filter)
      ),
      salary: selectedFilters.filter((filter) =>
        filterData[2].array.includes(filter)
      ),
    };

    // Set search parameters in parent component
    setSearchParams(dynamicSearchParams);

    // Here, you can implement additional filtering logic if necessary
    // setFilterJobs(filteredJobs);
  }, [searchTerm, selectedFilters, setSearchParams]);

  return (
    <div className="w-full bg-white px-4 py-2 rounded-md shadow-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-1" />

      {/* Search Field */}
      <input
        type="text"
        placeholder="Search Jobs by Designation, Company etc..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-1 border rounded-md focus:outline-none placeholder:text-sm"
      />

      {/* Selected Filters */}
      <div className="flex flex-wrap gap-1 mb-1">
        {selectedFilters.map((filter, index) => (
          <div
            key={index}
            className="flex items-center bg-blue-500 text-white rounded-full px-1 h-[20px]"
          >
            <span style={{ fontSize: "10px" }}>{filter}</span>
            <button
              className="ml-2 text-white"
              onClick={() => removeFilter(filter)}
            >
              <FiX size={10} />
            </button>
          </div>
        ))}
      </div>

      {filterData.map((data, index) => {
        const isExpanded = expandedIndex === index;
        return (
          <div key={index} className="my-1">
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-lg">{data.filterType}</h1>
              <button
                onClick={() => toggleExpand(index)}
                className="text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                {isExpanded ? <FiMinus size={20} /> : <FiPlus size={20} />}
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {isExpanded &&
                data.array.map((item, idx) => {
                  const itemId = `id${index}-${idx}`;
                  return (
                    <div className="flex items-center space-x-2" key={itemId}>
                      <input
                        type="checkbox"
                        id={itemId}
                        checked={selectedFilters.includes(item)} // Check if the item is in selectedFilters
                        onChange={() => changeHandler(item)} // Call changeHandler on change
                      />
                      <Label htmlFor={itemId}>{item}</Label>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FilterCard;
