import React, { useEffect, useState } from "react";
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

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "FullStack Developer",
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { carousel } = useSelector((state) => state.job);
  const [carousels, setCarousels] = useState(carousel?.jobs);
  const searchJobHandler = (query) => {
    navigate(`/description/${query?._id}`);
  };

  useEffect(() => {
    if (!carousels) {
      dispatch(getCarouselData())
        .then((res) => {
          if (res?.payload?.status == 200) {
            setCarousels("res", res?.payload?.jobs);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, []);

  console.log("carousels", carousels);

  return (
    <div>
      <Carousel className='w-full max-w-xl mx-auto my-10'>
        <CarouselContent className='grow-0 shrink-0 min-w-0 flex'>
          {carousels.slice(0, 10).map((cat, index) => (
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
