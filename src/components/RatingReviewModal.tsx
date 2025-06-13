import React, { useState } from 'react';
import { Star, X, Camera, Send, ThumbsUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface RatingReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export default function RatingReviewModal({ isOpen, onClose, order }: RatingReviewModalProps) {
  const { dispatch } = useApp();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedAspects, setSelectedAspects] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const aspects = [
    'Food Quality',
    'Service Speed',
    'Presentation',
    'Value for Money',
    'Portion Size',
    'Temperature',
  ];

  const handleSubmitReview = () => {
    if (rating === 0) return;

    const reviewData = {
      orderId: order.id,
      rating,
      comment: review,
      aspects: selectedAspects,
      images,
      timestamp: new Date(),
    };

    dispatch({
      type: 'ADD_REVIEW',
      payload: reviewData,
    });

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        type: 'system',
        title: 'Review Submitted',
        message: 'Thank you for your feedback!',
        priority: 'low',
      }
    });

    onClose();
    resetForm();
  };

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setReview('');
    setSelectedAspects([]);
    setImages([]);
  };

  const toggleAspect = (aspect: string) => {
    setSelectedAspects(prev =>
      prev.includes(aspect)
        ? prev.filter(a => a !== aspect)
        : [...prev, aspect]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-md max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">Rate Your Experience</h2>
                <p className="text-yellow-100 text-sm">Order #{order?.id?.slice(-4)}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Star Rating */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">How was your meal?</h3>
              <div className="flex justify-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-300">
                {rating === 0 && 'Tap to rate'}
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            </div>

            {/* Aspects */}
            {rating > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-3">What did you like?</h4>
                <div className="grid grid-cols-2 gap-2">
                  {aspects.map((aspect) => (
                    <button
                      key={aspect}
                      onClick={() => toggleAspect(aspect)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        selectedAspects.includes(aspect)
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 text-white'
                          : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {selectedAspects.includes(aspect) && (
                        <ThumbsUp className="w-4 h-4 inline mr-1" />
                      )}
                      {aspect}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Written Review */}
            {rating > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-3">Tell us more (optional)</h4>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with other customers..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
                />
              </div>
            )}

            {/* Photo Upload */}
            {rating > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-3">Add Photos (optional)</h4>
                <button className="w-full p-4 border-2 border-dashed border-white/30 rounded-xl text-gray-300 hover:border-white/50 hover:text-white transition-colors">
                  <Camera className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">Tap to add photos</span>
                </button>
              </div>
            )}

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="font-semibold text-white mb-3">Your Order</h4>
              <div className="space-y-2">
                {order?.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white text-sm">{item.name}</div>
                      <div className="text-xs text-gray-300">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/20">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={rating === 0}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}