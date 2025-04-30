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
    <div className='p-5 rounded-md shadow-lg bg-white border border-gray-200 flex flex-col h-full'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-500'>
          {daysAgo === 0 ? "Today" : `${daysAgo} days ago`}
        </p>
        <Button variant='outline' className='rounded-full' size='icon'>
          <Bookmark />
        </Button>
      </div>

      <div className='flex items-center gap-2 my-2'>
        <Button className='p-2' variant='outline' size='icon'>
          <Avatar>
            <AvatarImage src={company?.logo?.url} />
          </Avatar>
        </Button>
        <div>
          <h1 className='font-medium text-lg'>{company?.companyName}</h1>
          <p className='text-sm text-gray-500'>{location}</p>
        </div>
      </div>

      <div className='flex-grow'>
        <h1 className='font-bold text-lg my-2 overflow-hidden text-ellipsis whitespace-nowrap'>
          {title}
        </h1>
        <p className='text-sm text-gray-600'>{description}</p>
      </div>

      <div className='flex items-center gap-2 mt-4 flex-wrap'>
        <Badge className={"text-blue-700 font-bold"} variant='ghost'>
          {position} Positions
        </Badge>
        <Badge className={"text-[#F83002] font-bold"} variant='ghost'>
          {jobType}
        </Badge>
        <Badge className={"text-[#7209b7] font-bold"} variant='ghost'>
          ₹{salary}
        </Badge>
      </div>

      <div className='flex justify-between gap-4 mt-4 flex-wrap'>
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant='outline'
        >
          Details
        </Button>
        <Button
          onClick={hasApplied ? null : applyJobHandler}
          className={`bg-[#7209b7] text-white ${
            hasApplied ? "cursor-not-allowed" : ""
          }`}
          disabled={hasApplied}
        >
          {hasApplied ? "Applied" : "Apply Now"}
        </Button>
      </div>
    </div>
  );
};

export default Job;
