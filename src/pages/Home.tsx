import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, BookOpen, ArrowRight, Gift } from 'lucide-react';
import { Carousel } from '@/components/Carousel';
import banner1 from '@/assets/covers/banner-1.svg';
import banner2 from '@/assets/covers/banner-2.svg';
import banner3 from '@/assets/covers/banner-3.svg';
import { CourseCard } from '@/components/CourseCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useStore, mockCourses } from '@/store/useStore';

/**
 * 首页组件
 * @returns 首页组件
 */
export const Home: React.FC = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const { courses: storedCourses, isLoggedIn } = useStore();
  const courses = storedCourses.length ? storedCourses : mockCourses;
  const navigate = useNavigate();

  // 检查是否为新用户
  useEffect(() => {
    if (isLoggedIn) return;
    try {
      if (localStorage.getItem('hasVisited')) return;
      localStorage.setItem('hasVisited', 'true');
    } catch {
      // 存储被浏览器隐私设置禁用或写满时，仍允许浏览课程。
    }
    setShowWelcomeModal(true);
  }, [isLoggedIn]);

  // 轮播图数据
  const carouselItems = [
    {
      id: '1',
      title: '零基础中文入门课程',
      subtitle: '从拼音开始，轻松掌握中文基础',
      image: banner1,
      buttonText: '立即学习',
      buttonLink: '/courses/1'
    },
    {
      id: '2',
      title: 'HSK考试冲刺班',
      subtitle: '专业老师指导，高效备考HSK',
      image: banner2,
      buttonText: '了解详情',
      buttonLink: '/courses/3'
    },
    {
      id: '3',
      title: '商务中文实战课',
      subtitle: '提升职场中文沟通能力',
      image: banner3,
      buttonText: '查看课程',
      buttonLink: '/courses/2'
    }
  ];

  // 获取推荐课程
  const featuredCourses = courses.filter(course => course.featured).slice(0, 3);
  const popularCourses = courses.filter(course => course.popular).slice(0, 4);
  const newCourses = courses.filter(course => course.isNew).slice(0, 4);

  // 学习统计数据
  const stats = [
    { icon: Users, label: '学员总数', value: '50,000+' },
    { icon: BookOpen, label: '课程数量', value: '200+' },
    { icon: Star, label: '平均评分', value: '4.8' },
    { icon: Clock, label: '学习时长', value: '100万+小时' }
  ];

  // 课程分类
  const categories = [
    {
      name: '零基础入门',
      description: '从零开始学中文',
      icon: '🌱',
      courseCount: 25,
      link: '/categories/beginner'
    },
    {
      name: 'HSK考试',
      description: '专业考试辅导',
      icon: '📝',
      courseCount: 18,
      link: '/categories/hsk'
    },
    {
      name: '商务中文',
      description: '职场必备技能',
      icon: '💼',
      courseCount: 12,
      link: '/categories/business'
    },
    {
      name: '日常对话',
      description: '生活实用口语',
      icon: '💬',
      courseCount: 30,
      link: '/categories/conversation'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 轮播图区域 */}
      <section className="relative">
        <Carousel
          items={carouselItems}
          onItemClick={(item) => {
            if (item.buttonLink) navigate(item.buttonLink);
          }}
          autoPlay
          autoPlayInterval={5000}
          className="h-96 md:h-[500px]"
        />
      </section>

      {/* 统计数据 */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-teal-100 rounded-full">
                      <IconComponent className="h-6 w-6 text-teal-600" />
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 课程分类 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              热门分类
            </h2>
            <p className="text-lg text-gray-600">
              选择适合你的学习路径
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={index} to={category.link}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="text-sm text-teal-600 font-medium">
                      {category.courseCount} 门课程
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 精选课程 */}
      {featuredCourses.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  精选课程
                </h2>
                <p className="text-lg text-gray-600">
                  编辑精心挑选的优质课程
                </p>
              </div>
              <Link to="/courses">
                <Button variant="outline">
                  查看全部
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 热门课程 */}
      {popularCourses.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  热门课程
                </h2>
                <p className="text-lg text-gray-600">
                  最受学员欢迎的课程
                </p>
              </div>
              <Link to="/courses?sort=popular">
                <Button variant="outline">
                  查看更多
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 最新课程 */}
      {newCourses.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  最新课程
                </h2>
                <p className="text-lg text-gray-600">
                  刚刚上线的新鲜内容
                </p>
              </div>
              <Link to="/courses?sort=newest">
                <Button variant="outline">
                  查看更多
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 敬请期待区域 */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-4">
              更多精彩内容
            </h2>
            <p className="text-xl mb-8 opacity-90">
              我们正在准备更多优质的中文学习资源
            </p>
            <div className="inline-flex items-center justify-center p-8 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
              <Gift className="h-12 w-12 text-white mb-4" />
              <div className="ml-4">
                <div className="text-2xl font-bold">敬请期待</div>
                <div className="text-lg opacity-90">Coming Soon</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 新用户欢迎弹窗 */}
      <Modal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        title="欢迎来到中文学堂！"
        size="md"
      >
        <div className="text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-teal-600" />
            </div>
            <p className="text-gray-600 mb-6">
              感谢您选择中文学堂！我们为您准备了丰富的中文学习资源，
              从零基础到高级水平，助您轻松掌握中文。
            </p>
            <div className="bg-teal-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center mb-2">
                <Gift className="h-5 w-5 text-teal-600 mr-2" />
                <span className="font-semibold text-teal-800">新用户专享</span>
              </div>
              <p className="text-teal-700 text-sm">
                注册即可获得首门课程9折优惠！
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowWelcomeModal(false)}
              className="flex-1"
            >
              稍后再说
            </Button>
            <Link to="/register" className="flex-1">
              <Button
                variant="primary"
                onClick={() => setShowWelcomeModal(false)}
                className="w-full"
              >
                立即注册
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
};
