import React, { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

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

const FilterCard = ({ setSearchedQuery }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [expandedFilters, setExpandedFilters] = useState(
    filterData.map(() => false) // Initialize collapse for each filter group
  );

  const toggleExpand = (index) => {
    const newExpandedFilters = [...expandedFilters];
    newExpandedFilters[index] = !newExpandedFilters[index]; // Toggle the expansion state
    setExpandedFilters(newExpandedFilters);
  };

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    setSearchedQuery(selectedValue);
  }, [selectedValue, setSearchedQuery]);

  return (
    <div className="w-full bg-white p-4 rounded-md shadow-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-1" />
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((data, index) => {
          const isExpanded = expandedFilters[index];
          const visibleItems = isExpanded ? data.array.length : 2; // Initially show 2 items, show all when expanded
          return (
            <div key={index} className="my-3">
              <h1 className="font-bold text-lg">{data.filterType}</h1>
              <div className="flex flex-col sm:grid sm:grid-cols- md:flex md:flex-col gap-2">
                {data.array.slice(0, visibleItems).map((item, idx) => {
                  const itemId = `id${index}-${idx}`;
                  return (
                    <div className="flex items-center space-x-2" key={itemId}>
                      <RadioGroupItem value={item} id={itemId} />
                      <Label htmlFor={itemId}>{item}</Label>
                    </div>
                  );
                })}
              </div>

              {/* Toggle Button */}
              <button
                onClick={() => toggleExpand(index)}
                className="mt-2 text-blue-500 hover:text-blue-700 focus:outline-none text-sm"
              >
                {isExpanded ? "Show Less" : "Show More"}
              </button>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
