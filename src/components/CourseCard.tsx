import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, User, Tag } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Course, useStore } from '@/store/useStore';
import { cn, formatDuration } from '@/lib/utils';

export interface CourseCardProps {
  course: Course;
  onAddToCart?: (course: Course) => void;
  onViewDetails?: (courseId: string) => void;
  className?: string;
}

/**
 * 课程卡片组件
 * @param course - 课程数据
 * @param onAddToCart - 添加到购物车的回调函数
 * @param onViewDetails - 查看详情的回调函数
 * @param className - 额外的CSS类名
 * @returns 课程卡片组件
 */
export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onAddToCart,
  onViewDetails,
  className
}) => {
  const navigate = useNavigate();
  const addToCart = useStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    (onAddToCart ?? addToCart)(course);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(course.id);
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={cn(
          'w-4 h-4',
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        )}
      />
    ));
  };

  return (
    <Card 
      className={cn(
        'cursor-pointer hover:shadow-lg transition-all duration-300 group',
        course.status === 'coming_soon' && 'opacity-75',
        className
      )}
      onClick={handleViewDetails}
    >
      {/* Course Image */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Coming Soon Badge */}
        {course.status === 'coming_soon' && (
          <div className="absolute top-4 right-4 bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            即将上线
          </div>
        )}
        
        {/* Discount Badge */}
        {course.originalPrice && course.originalPrice > course.price && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            限时优惠
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Category & Level */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Tag className="w-3 h-3 mr-1" />
            {course.category}
          </span>
          <span className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            course.level === 'beginner' && 'bg-green-100 text-green-800',
            course.level === 'intermediate' && 'bg-yellow-100 text-yellow-800',
            course.level === 'advanced' && 'bg-red-100 text-red-800'
          )}>
            {course.level === 'beginner' && '初级'}
            {course.level === 'intermediate' && '中级'}
            {course.level === 'advanced' && '高级'}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
          <button
            type="button"
            className="text-left"
            onClick={(event) => {
              event.stopPropagation();
              handleViewDetails();
            }}
          >
            {course.title}
          </button>
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.description}
        </p>

        {/* Instructor & Duration */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(course.duration)}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {renderStars(course.rating)}
          </div>
          <span className="text-sm font-medium text-gray-900">
            {course.rating}
          </span>
          <span className="text-sm text-gray-500">
            ({course.reviewCount}条评价)
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* Price & Actions */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ¥{course.price}
            </span>
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="text-lg text-gray-500 line-through">
                ¥{course.originalPrice}
              </span>
            )}
          </div>
          
          {course.status !== 'coming_soon' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddToCart}
              className="shrink-0"
            >
              加入购物车
            </Button>
          )}
          
          {course.status === 'coming_soon' && (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="shrink-0"
            >
              敬请期待
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
