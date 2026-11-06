import React from 'react';
import { BookOpen, Globe, Award, Target, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export const About: React.FC = () => {
  const mission = [
    { icon: Globe, title: '全球化教学', desc: '面向全球中文学习者，覆盖50+国家' },
    { icon: Target, title: '分级教学', desc: '从零基础到HSK6级，精准匹配水平' },
    { icon: Award, title: '专业师资', desc: '10年以上教学经验的中文教师团队' },
    { icon: Heart, title: '以学为本', desc: '实战驱动，每课包含练习和场景应用' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">关于中文学堂</h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            我们致力于让全球每个人都能轻松、高效、有趣地学习中文
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white -mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mission.map((m, i) => {
              const Icon = m.icon;
              return (
                <Card key={i}>
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex p-3 bg-teal-100 rounded-lg text-teal-600 mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{m.title}</h3>
                    <p className="text-gray-600">{m.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">我们的故事</h2>
          <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
            <p>中文学堂诞生于一个简单但有力的想法：让中文学习不再困难。</p>
            <p>我们相信，无论是为了工作、考试、旅行还是纯粹的兴趣，每个人都应该有机会接触到高质量的中文教学资源。因此，我们汇集了经验丰富的中文教师、教育技术专家和内容创作者，打造了这个覆盖零基础到高级水平的完整学习平台。</p>
            <p>从HSK考试备考到商务中文实战，从日常对话到文化理解，我们的课程体系经过精心设计，帮助你在每个阶段都能找到最适合的学习路径。</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-1">50,000+</div>
              <div className="text-gray-600">注册学员</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-1">200+</div>
              <div className="text-gray-600">精品课程</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-1">50+</div>
              <div className="text-gray-600">覆盖国家</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-1">4.8</div>
              <div className="text-gray-600">平均评分</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
