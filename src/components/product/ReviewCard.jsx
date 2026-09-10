import { Star } from 'lucide-react';

const ReviewCard = ({ review }) => {
  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 font-bold text-sm uppercase">
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-sm text-gray-800">{review.name}</p>
            <p className="text-[10px] text-gray-400 font-medium">Verified Buyer • {new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-green-600">
          <span className="text-xs font-black">{review.rating}</span>
          <Star className="size-3 fill-current" />
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">&quot;{review.comment}&quot;</p>
      
      {/* Review Badges */}
      <div className="flex gap-2 mt-4">
        {['Great Quality', 'Fast Shipping'].map((badge) => (
          <span key={badge} className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded border border-dashed">
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ReviewCard;
