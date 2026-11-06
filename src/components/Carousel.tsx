import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import banner1 from '@/assets/covers/banner-1.svg';
import banner2 from '@/assets/covers/banner-2.svg';
import banner3 from '@/assets/covers/banner-3.svg';

export interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
}

export interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  onItemClick?: (item: CarouselItem) => void;
}

/**
 * 轮播图组件
 * @param items - 轮播项目数据
 * @param autoPlay - 是否自动播放
 * @param autoPlayInterval - 自动播放间隔时间（毫秒）
 * @param showDots - 是否显示指示点
 * @param showArrows - 是否显示左右箭头
 * @param className - 额外的CSS类名
 * @param onItemClick - 点击轮播项的回调函数
 * @returns 轮播图组件
 */
export const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className,
  onItemClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const activeIndex = items.length ? currentIndex % items.length : 0;

  // Auto play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || isFocused || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, isFocused, items.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  }, [items.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  const handleItemClick = (item: CarouselItem) => {
    onItemClick?.(item);
  };

  if (items.length === 0) {
    return (
      <div className={cn('w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center', className)}>
        <p className="text-gray-500">暂无轮播内容</p>
      </div>
    );
  }

  return (
    <div 
      role="region"
      aria-roledescription="轮播图"
      aria-label="推荐课程"
      className={cn('relative w-full h-96 overflow-hidden rounded-lg group', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false);
      }}
    >
      {/* Carousel Items */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            role="group"
            aria-roledescription="幻灯片"
            aria-label={`第 ${index + 1} 张，共 ${items.length} 张`}
            aria-hidden={index !== activeIndex}
            className="w-full h-full flex-shrink-0 relative cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url("${item.image}")`,
                backgroundColor: item.backgroundColor || '#f3f4f6'
              }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            
            {/* Content */}
            <div className="relative h-full flex items-center justify-center text-center text-white p-8">
              <div className="max-w-2xl">
                {item.subtitle && (
                  <p className="text-lg mb-2 opacity-90">
                    {item.subtitle}
                  </p>
                )}
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  {item.title}
                </h2>
                {item.description && (
                  <p className="text-xl mb-6 opacity-90">
                    {item.description}
                  </p>
                )}
                {item.buttonText && (
                  <Button
                    tabIndex={index === activeIndex ? 0 : -1}
                    variant="secondary"
                    size="lg"
                    className="bg-teal-500 hover:bg-teal-600"
                  >
                    {item.buttonText}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <Button
            aria-label="上一张"
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            aria-label="下一张"
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
            onClick={goToNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              aria-label={`转到第 ${index + 1} 张`}
              aria-current={index === activeIndex ? 'true' : undefined}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-200',
                index === activeIndex
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              )}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 模拟轮播数据
export const mockCarouselItems: CarouselItem[] = [
  {
    id: '1',
    title: '新用户专享优惠',
    subtitle: '限时特惠',
    description: '注册即享受全站课程8折优惠，开启你的中文学习之旅',
    image: banner1,
    buttonText: '立即注册',
    backgroundColor: '#4ECDC4'
  },
  {
    id: '2',
    title: 'HSK考试冲刺班',
    subtitle: '考试季来临',
    description: '专业老师指导，真题练习，助你顺利通过HSK考试',
    image: banner2,
    buttonText: '了解详情',
    backgroundColor: '#F7F3E9'
  },
  {
    id: '3',
    title: '商务中文实战',
    subtitle: '职场必备',
    description: '提升职场竞争力，掌握商务中文沟通技巧',
    image: banner3,
    buttonText: '开始学习',
    backgroundColor: '#2C3E50'
  }
];
