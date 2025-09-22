import React, { useEffect, useState, useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { CarouselSkeleton } from "./ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCarouselData } from "@/redux/slices/job.slice";

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { carousel } = useSelector((state) => state.job);
  const [carousels, setCarousels] = useState(carousel?.jobs || []);
  const [loading, setLoading] = useState(false);

  // Search job handler
  const searchJobHandler = (query) => {
    navigate(`/description/${query?._id}`);
  };

  // Fetch carousel data if not available
  useEffect(() => {
    if (!carousels || carousels.length === 0) {
      setLoading(true);
      dispatch(getCarouselData())
        .then((res) => {
          if (res?.payload?.status === 200) {
            setCarousels(res?.payload?.jobs || []);
          } else {
            console.error("Failed to fetch carousel data:", res?.payload?.message);
            // Set some default data if API fails
            setCarousels([
              { _id: '1', title: 'Software Engineer' },
              { _id: '2', title: 'Data Scientist' },
              { _id: '3', title: 'Product Manager' },
              { _id: '4', title: 'UX Designer' },
              { _id: '5', title: 'Marketing Manager' },
              { _id: '6', title: 'Sales Executive' },
              { _id: '7', title: 'DevOps Engineer' },
              { _id: '8', title: 'Business Analyst' }
            ]);
          }
        })
        .catch((error) => {
          console.error("Error fetching carousel data:", error);
          // Set some default data if API fails
          setCarousels([
            { _id: '1', title: 'Software Engineer' },
            { _id: '2', title: 'Data Scientist' },
            { _id: '3', title: 'Product Manager' },
            { _id: '4', title: 'UX Designer' },
            { _id: '5', title: 'Marketing Manager' },
            { _id: '6', title: 'Sales Executive' },
            { _id: '7', title: 'DevOps Engineer' },
            { _id: '8', title: 'Business Analyst' }
          ]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch]);

  // Memoized sliced carousels for performance
  const carouselItems = useMemo(() => carousels?.slice(0, 10), [carousels]);

  if (loading) {
    return <CarouselSkeleton />;
  }

  if (!carouselItems || carouselItems.length === 0) {
    return (
      <div className='relative'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-gray-800 mb-2'>
            Popular <span className='text-[#6A38C2]'>Job Categories</span>
          </h2>
          <p className='text-gray-600'>Explore trending job categories and find your perfect match</p>
        </div>
        <div className='text-center py-8'>
          <p className='text-gray-500'>No categories available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='relative'>
      <div className='text-center mb-8'>
        <h2 className='text-3xl font-bold text-gray-800 mb-2'>
          Popular <span className='text-[#6A38C2]'>Job Categories</span>
        </h2>
        <p className='text-gray-600'>Explore trending job categories and find your perfect match</p>
      </div>
      
      <Carousel className='w-full max-w-4xl mx-auto my-10'>
        <CarouselContent className='grow-0 shrink-0 min-w-0 flex gap-4'>
          {carouselItems?.map((cat, index) => (
            <CarouselItem
              key={index}
              className='grow-0 shrink-0 min-w-0 md:basis-1/3 lg:basis-1/4'
            >
              <Button
                onClick={() => searchJobHandler(cat)}
                variant='outline'
                className='rounded-2xl w-full max-w-full truncate px-6 py-4 text-sm font-medium text-start whitespace-nowrap overflow-hidden border-2 border-gray-200 hover:border-[#6A38C2] hover:bg-gradient-to-r hover:from-[#6A38C2]/5 hover:to-[#F83002]/5 hover:text-[#6A38C2] transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105 group'
              >
                <div className='flex items-center gap-2 w-full'>
                  <div className='w-2 h-2 bg-[#6A38C2] rounded-full group-hover:bg-[#F83002] transition-colors duration-300'></div>
                  <span className='truncate'>{cat?.title}</span>
                </div>
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='left-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-[#6A38C2] hover:bg-[#6A38C2] hover:text-white shadow-lg hover:shadow-xl transition-all duration-300' />
        <CarouselNext className='right-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-[#6A38C2] hover:bg-[#6A38C2] hover:text-white shadow-lg hover:shadow-xl transition-all duration-300' />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
