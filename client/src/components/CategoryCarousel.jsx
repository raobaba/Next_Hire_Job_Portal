import React, { useEffect, useState, useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCarouselData } from "@/redux/slices/job.slice";

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { carousel } = useSelector((state) => state.job);
  const [carousels, setCarousels] = useState(carousel?.jobs);

  // Search job handler
  const searchJobHandler = (query) => {
    navigate(`/description/${query?._id}`);
  };

  // Fetch carousel data if not available
  useEffect(() => {
    if (!carousels) {
      dispatch(getCarouselData())
        .then((res) => {
          if (res?.payload?.status === 200) {
            setCarousels(res?.payload?.jobs);
          }
        })
        .catch((error) => {
          console.error("Error fetching carousel data:", error);
        });
    }
  }, [carousels, dispatch]);

  // Memoized sliced carousels for performance
  const carouselItems = useMemo(() => carousels?.slice(0, 10), [carousels]);

  if (!carousels) {
    return <div>Loading...</div>; // Or use a loading spinner
  }

  return (
    <div>
      <Carousel className='w-full max-w-xl mx-auto my-10'>
        <CarouselContent className='grow-0 shrink-0 min-w-0 flex'>
          {carouselItems.map((cat, index) => (
            <CarouselItem
              key={index}
              className='grow-0 shrink-0 min-w-0 md:basis-1/2'
            >
              <Button
                onClick={() => searchJobHandler(cat)}
                variant='outline'
                className='rounded-full w-full max-w-full truncate px-4 py-2 text-sm text-start whitespace-nowrap overflow-hidden'
              >
                {cat?.title}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
