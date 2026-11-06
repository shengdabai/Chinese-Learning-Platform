import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Users, BookOpen, ShoppingCart, ArrowLeft, PlayCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useStore, mockCourses } from '@/store/useStore';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useStore();

  const course = mockCourses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">课程未找到</h1>
          <Link to="/">
            <Button variant="primary">返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (course.status !== 'published') return;
    if (useStore.getState().cart.some(item => item.courseId === course.id)) {
      toast.info(`「${course.title}」已在购物车中`);
      return;
    }
    addToCart(course);
    toast.success(`已添加「${course.title}」到购物车`);
  };

  const levelLabels: Record<string, string> = {
    beginner: '零基础',
    intermediate: '中级',
    advanced: '高级',
  };

  // 模拟课程大纲
  const lessons = Array.from({ length: Math.min(course.lessons, 8) }, (_, i) => ({
    id: i + 1,
    title: `第 ${i + 1} 课：${['拼音基础', '日常问候', '数字与时间', '购物场景', '餐厅点餐', '交通出行', '看病就医', '工作面试'][i] || '综合练习'}`,
    duration: `${15 + (i % 5) * 5} 分钟`,
    free: i < 3,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-teal-600">
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回首页
          </Link>
        </div>
      </div>

      {/* 课程头部 */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <span className="inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm mb-4">
                {levelLabels[course.level]}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg opacity-90 mb-6">{course.description}</p>

              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-300 mr-1 fill-yellow-300" />
                  {course.rating} ({course.reviewCount} 条评价)
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {Math.floor(Math.random() * 500 + 200)} 人在学
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.duration} 分钟
                </span>
              </div>
            </div>

            <div className="md:pl-8">
              <Card className="bg-white text-gray-900">
                <CardContent className="p-6">
                  <div className="mb-4">
                    {course.originalPrice ? (
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-teal-600">
                          {formatPrice(course.price)}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          {formatPrice(course.originalPrice)}
                        </span>
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                          省 {formatPrice(course.originalPrice - course.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-teal-600">
                        {formatPrice(course.price)}
                      </span>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    className="w-full py-3 text-lg mb-3"
                    onClick={handleAddToCart}
                    disabled={course.status !== 'published'}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {course.status === 'published' ? '加入购物车' : '即将上线'}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={course.status !== 'published'}
                    onClick={() => {
                      toast.info('免费试听功能即将上线');
                    }}
                  >
                    <PlayCircle className="h-5 w-5 mr-2" />
                    免费试听
                  </Button>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {course.lessons} 节课程
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      总时长 {course.duration} 分钟
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      讲师：{course.instructor}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 课程大纲 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">课程大纲</h2>
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <Card key={lesson.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  {lesson.free ? (
                    <PlayCircle className="h-5 w-5 text-teal-600 mr-3" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400 mr-3" />
                  )}
                  <div>
                    <span className="font-medium text-gray-900">{lesson.title}</span>
                    {lesson.free && (
                      <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded">
                        免费试听
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-gray-500 text-sm">{lesson.duration}</span>
              </CardContent>
            </Card>
          ))}
          {course.lessons > 8 && (
            <p className="text-center text-gray-500 py-4">
              还有 {course.lessons - 8} 节课程，购买后查看全部内容
            </p>
          )}
        </div>
      </div>

      {/* 讲师介绍 */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">关于讲师</h2>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-2xl font-bold text-teal-600">
              {course.instructor[0]}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{course.instructor}</h3>
              <p className="text-gray-600 mt-1">
                资深中文教师，拥有 10+ 年教学经验，擅长将复杂的中文知识以简单有趣的方式传授给学生。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
