import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { Label } from "./ui/label";
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

  // Function to toggle expansion for filter sections
  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Handle checkbox changes
  const changeHandler = (value) => {
    if (selectedFilters.includes(value)) {
      setSelectedFilters((prev) => prev.filter((filter) => filter !== value));
    } else {
      setSelectedFilters((prev) => [...prev, value]);
    }
  };

  // Remove selected filters (chips)
  const removeFilter = (filter) => {
    setSelectedFilters((prev) => prev.filter((f) => f !== filter));
  };

  // Update searchParams when search term or selected filters change
useEffect(() => {
    const dynamicSearchParams = {
      title: searchTerm, // Set title to search term
      location: selectedFilters.filter((filter) =>
        filterData[0].array.includes(filter)
      ),
      jobType: selectedFilters.filter((filter) =>
        filterData[1].array.includes(filter)
      ),
      salary: selectedFilters.filter((filter) =>
        filterData[2].array.includes(filter)
      ).join(", "), // Join selected salary options as a comma-separated string
    };

    setSearchParams((prevParams) => ({
      ...prevParams,
      ...dynamicSearchParams,
    }));
}, [searchTerm, selectedFilters, setSearchParams]);


  return (
    <div className="w-full bg-white px-4 py-2 rounded-md shadow-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-1" />
      {/* Search input for job search by title, designation, etc. */}
      <input
        type="text"
        placeholder="Search Jobs by Designation, Company etc..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-1 border rounded-md focus:outline-none placeholder:text-sm"
      />

      {/* Display selected filters as chips */}
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

      {/* Filter sections */}
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

            {/* Filter options (checkboxes) */}
            <div className="flex flex-col gap-1">
              {isExpanded &&
                data.array.map((item, idx) => {
                  const itemId = `id${index}-${idx}`;
                  return (
                    <div className="flex items-center space-x-2" key={itemId}>
                      <input
                        type="checkbox"
                        id={itemId}
                        checked={selectedFilters.includes(item)}
                        onChange={() => changeHandler(item)}
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
