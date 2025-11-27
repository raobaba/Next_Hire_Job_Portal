import React, { useEffect, useState, useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { Button } from "../../ui/button";
import { CarouselSkeleton } from "../../ui/skeleton";
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
            const defaultData = [
              { _id: '1', title: 'Software Engineer' },
              { _id: '2', title: 'Data Scientist' },
              { _id: '3', title: 'Product Manager' },
              { _id: '4', title: 'UX Designer' },
              { _id: '5', title: 'Marketing Manager' },
              { _id: '6', title: 'Sales Executive' },
              { _id: '7', title: 'DevOps Engineer' },
              { _id: '8', title: 'Business Analyst' }
            ];
            setCarousels(defaultData);
          }
        })
        .catch((error) => {
          console.error("Error fetching carousel data:", error);
          // Set some default data if API fails
          const defaultData = [
            { _id: '1', title: 'Software Engineer' },
            { _id: '2', title: 'Data Scientist' },
            { _id: '3', title: 'Product Manager' },
            { _id: '4', title: 'UX Designer' },
            { _id: '5', title: 'Marketing Manager' },
            { _id: '6', title: 'Sales Executive' },
            { _id: '7', title: 'DevOps Engineer' },
            { _id: '8', title: 'Business Analyst' }
          ];
          setCarousels(defaultData);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, carousels]);

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
    <div className='relative py-20 md:py-24 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/30 overflow-visible'>
      {/* Background decoration */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#6A38C2]/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#F83002]/5 rounded-full blur-3xl'></div>
      </div>

      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12 md:mb-16'>
          <h2 className='text-4xl md:text-5xl font-extrabold mb-4'>
            <span className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
              Popular{" "}
            </span>
            <span className='bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent'>
              Job Categories
            </span>
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Explore trending job categories and find your perfect match across various industries
          </p>
        </div>
        
        <div className='relative w-full overflow-visible py-4'>
          <div className='px-12 md:px-16 lg:px-20'>
            <Carousel className='w-full'>
              <CarouselContent className='grow-0 shrink-0 min-w-0 flex gap-4'>
                {carouselItems?.map((cat, index) => (
                  <CarouselItem
                    key={index}
                    className='grow-0 shrink-0 min-w-0 basis-auto md:basis-1/3 lg:basis-1/4'
                  >
                    <Button
                      onClick={() => searchJobHandler(cat)}
                      variant='outline'
                      className='rounded-2xl w-full max-w-full truncate px-6 py-5 text-base font-semibold text-start whitespace-nowrap overflow-hidden border-2 border-gray-200/60 hover:border-[#6A38C2] hover:bg-gradient-to-r hover:from-[#6A38C2]/10 hover:to-[#F83002]/10 hover:text-[#6A38C2] transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-110 group bg-white/95 backdrop-blur-sm'
                    >
                      <div className='flex items-center gap-3 w-full'>
                        <div className='w-3 h-3 bg-gradient-to-r from-[#6A38C2] to-[#F83002] rounded-full group-hover:scale-125 transition-transform duration-300 flex-shrink-0'></div>
                        <span className='truncate'>{cat?.title}</span>
                      </div>
                    </Button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='left-0 md:left-4 bg-white/95 backdrop-blur-md border-2 border-gray-200/60 hover:border-[#6A38C2] hover:bg-gradient-to-r hover:from-[#6A38C2] hover:to-[#5b30a6] hover:text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 z-10 h-10 w-10' />
              <CarouselNext className='right-0 md:right-4 bg-white/95 backdrop-blur-md border-2 border-gray-200/60 hover:border-[#6A38C2] hover:bg-gradient-to-r hover:from-[#6A38C2] hover:to-[#5b30a6] hover:text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 z-10 h-10 w-10' />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCarousel;
