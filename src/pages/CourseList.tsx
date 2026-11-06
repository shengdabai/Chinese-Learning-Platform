import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { CourseCard } from '@/components/CourseCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { mockCourses } from '@/store/useStore';

const allCategories = ['全部', '初学入门', '考试备考', '商务中文', '日常对话', '文化课程'];
const allLevels = [
  { value: 'all', label: '全部级别' },
  { value: 'beginner', label: '零基础' },
  { value: 'intermediate', label: '中级' },
  { value: 'advanced', label: '高级' },
];

export const CourseList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '全部';
  const selectedLevel = searchParams.get('level') || 'all';
  const requestedSort = searchParams.get('sort');
  const sortBy = requestedSort === 'newest' || requestedSort === 'price' ? requestedSort : 'popular';
  const searchQuery = searchParams.get('q') || '';

  const setFilter = (key: string, value: string, defaultValue = '') => {
    const next = new URLSearchParams(searchParams);
    if (value === defaultValue) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: key === 'q' });
  };

  // 过滤课程
  let filtered = mockCourses.filter((c) => c.status === 'published');

  if (selectedCategory !== '全部') {
    filtered = filtered.filter((c) => c.category === selectedCategory);
  }

  if (selectedLevel !== 'all') {
    filtered = filtered.filter((c) => c.level === selectedLevel);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // 排序
  filtered.sort((a, b) => {
    if (sortBy === 'popular') return b.reviewCount - a.reviewCount;
    if (sortBy === 'newest') return b.createdAt.localeCompare(a.createdAt);
    if (sortBy === 'price') return a.price - b.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">全部课程</h1>
          <p className="text-gray-600">找到适合你的中文学习课程</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 侧边栏筛选 */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  <Filter className="inline h-4 w-4 mr-1" />
                  筛选条件
                </h3>

                {/* 搜索框 */}
                <div className="mb-6">
                  <label htmlFor="course-search" className="block text-sm font-medium text-gray-700 mb-2">搜索</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="course-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setFilter('q', e.target.value)}
                      placeholder="搜索课程或标签..."
                      className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* 课程分类 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">课程分类</label>
                  <div className="space-y-2">
                    {allCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilter('category', cat, '全部')}
                        aria-pressed={selectedCategory === cat}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat
                            ? 'bg-teal-100 text-teal-700 font-medium'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 难度级别 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">难度级别</label>
                  <div className="space-y-2">
                    {allLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setFilter('level', level.value, 'all')}
                        aria-pressed={selectedLevel === level.value}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedLevel === level.value
                            ? 'bg-teal-100 text-teal-700 font-medium'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 课程列表 */}
          <div className="flex-1">
            {/* 排序和结果数 */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-600">共 {filtered.length} 门课程</span>
              <div className="flex items-center gap-2">
                <label htmlFor="course-sort" className="text-sm text-gray-500">排序：</label>
                <select
                  id="course-sort"
                  value={sortBy}
                  onChange={(e) => setFilter('sort', e.target.value, 'popular')}
                  className="border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-teal-500"
                >
                  <option value="popular">最受欢迎</option>
                  <option value="newest">最新上线</option>
                  <option value="price">价格从低到高</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg">
                <p className="text-gray-500 text-lg">没有找到匹配的课程</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchParams({})}
                >
                  清除筛选条件
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
