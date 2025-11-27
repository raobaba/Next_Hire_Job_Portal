import React, { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { applyJob } from "@/redux/slices/application.slice";
import { toast } from "react-toastify";
import { getToken } from "@/utils/constant";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const [hasApplied, setHasApplied] = useState(
    job?.applications?.some(
      (application) => application?.applicant === user?._id
    )
  );

  // Memoize days ago calculation for performance optimization
  const daysAgo = useMemo(() => {
    const createdAt = new Date(job?.createdAt);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  }, [job?.createdAt]);

  const applyJobHandler = () => {
    const token = getToken();
    if (!token) return navigate("/login");
    setHasApplied(true);
    dispatch(applyJob(job?._id))
      .then((res) => {
        if (res?.payload?.status === 200) {
          toast.success(res?.payload?.message);
        } else {
          setHasApplied(false);
          toast.info(res?.payload?.message);
        }
      })
      .catch((error) => {
        console.error("Error applying for job:", error);
        toast.error(
          error?.response?.data?.message || "Failed to apply for job."
        );
        setHasApplied(false);
      });
  };

  const { company, location, title, description, position, jobType, salary } =
    job;

  return (
    <div className='group relative p-6 rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 flex flex-col h-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:border-[#6A38C2]/30 overflow-hidden'>
      {/* Gradient overlay on hover */}
      <div className='absolute inset-0 bg-gradient-to-br from-[#6A38C2]/5 to-[#F83002]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
      
      <div className='relative z-10 flex flex-col h-full'>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>
            {daysAgo === 0 ? "Today" : `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`}
          </p>
          <Button variant='outline' className='rounded-full border-gray-200 hover:border-[#6A38C2] hover:bg-[#6A38C2]/10' size='icon'>
            <Bookmark className='h-4 w-4' />
          </Button>
        </div>

        <div className='flex items-center gap-3 mb-4'>
          <div className='w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-200 group-hover:border-[#6A38C2]/30 transition-colors duration-300 flex-shrink-0'>
            <Avatar className='w-full h-full'>
              <AvatarImage src={company?.logo?.url} className='object-cover' />
            </Avatar>
          </div>
          <div className='flex-1 min-w-0'>
            <h1 className='font-bold text-lg text-gray-900 group-hover:text-[#6A38C2] transition-colors duration-300 truncate'>{company?.companyName}</h1>
            <p className='text-sm text-gray-500 truncate'>{location}</p>
          </div>
        </div>

        <div className='flex-grow mb-4'>
          <h2 className='font-extrabold text-xl text-gray-900 mb-2 group-hover:text-[#6A38C2] transition-colors duration-300 line-clamp-2'>
            {title}
          </h2>
          <p className='text-sm text-gray-600 line-clamp-2 leading-relaxed'>{description}</p>
        </div>

        <div className='flex items-center gap-2 mb-4 flex-wrap'>
          <Badge className='text-blue-700 font-semibold bg-blue-100 border border-blue-200 px-3 py-1' variant='ghost'>
            {position} Position{position > 1 ? 's' : ''}
          </Badge>
          <Badge className='text-[#F83002] font-semibold bg-red-100 border border-red-200 px-3 py-1' variant='ghost'>
            {jobType}
          </Badge>
          <Badge className='text-[#6A38C2] font-semibold bg-purple-100 border border-purple-200 px-3 py-1' variant='ghost'>
            ₹{salary} LPA
          </Badge>
        </div>

        <div className='flex justify-between gap-3 mt-auto pt-4 border-t border-gray-100'>
          <Button
            onClick={() => navigate(`/description/${job?._id}`)}
            variant='outline'
            className='flex-1 border-2 border-gray-200 hover:border-[#6A38C2] hover:text-[#6A38C2] transition-all duration-300'
          >
            Details
          </Button>
          <Button
            onClick={hasApplied ? null : applyJobHandler}
            className={`flex-1 bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white transition-all duration-300 shadow-md hover:shadow-lg ${
              hasApplied ? "cursor-not-allowed opacity-60" : ""
            }`}
            disabled={hasApplied}
          >
            {hasApplied ? "Applied" : "Apply Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Job;
