import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/5] bg-gray-100 rounded-2xl mb-4"></div>
      
      {/* Content Skeleton */}
      <div className="space-y-3 px-2">
        <div className="h-2 w-16 bg-gray-100 rounded-full"></div>
        <div className="h-4 w-full bg-gray-100 rounded-full"></div>
        <div className="h-4 w-2/3 bg-gray-100 rounded-full"></div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-20 bg-gray-100 rounded-full"></div>
          <div className="size-10 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
