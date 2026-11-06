import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

/**
 * 页脚组件
 * @returns 页脚组件
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    courses: [
      { name: '零基础入门', href: '/categories/beginner' },
      { name: 'HSK考试', href: '/categories/hsk' },
      { name: '商务中文', href: '/categories/business' },
      { name: '日常对话', href: '/categories/conversation' }
    ],
    support: [
      { name: '帮助中心', href: '/help' },
      { name: '联系我们', href: '/contact' },
      { name: '用户协议', href: '/terms' },
      { name: '隐私政策', href: '/privacy' }
    ],
    company: [
      { name: '关于我们', href: '/about' },
      { name: '加入我们', href: '/careers' },
      { name: '合作伙伴', href: '/partners' },
      { name: '媒体报道', href: '/press' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 公司信息 */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-teal-400" />
              <span className="text-xl font-bold">中文学堂</span>
            </div>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              专业的中文学习平台，为全球中文学习者提供优质的在线课程和学习资源。
              从零基础到高级水平，助您轻松掌握中文。
            </p>
            
            {/* 联系信息 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-teal-400" />
                <span>contact@chineselearning.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-teal-400" />
                <span>+86 400-123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-teal-400" />
                <span>北京市朝阳区中文学习大厦</span>
              </div>
            </div>
          </div>

          {/* 课程分类 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">课程分类</h3>
            <ul className="space-y-2">
              {footerLinks.courses.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-teal-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 帮助支持 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">帮助支持</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-teal-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 公司信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">公司</h3>
            <ul className="space-y-2 mb-6">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-teal-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* 社交媒体 */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-gray-200">关注我们</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="text-gray-400 hover:text-teal-400 transition-colors"
                      aria-label={social.name}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 分割线 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} 中文学堂. 保留所有权利.
            </div>
            
            {/* 底部链接 */}
            <div className="flex space-x-6 text-sm">
              <Link
                to="/terms"
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                服务条款
              </Link>
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                隐私政策
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                Cookie政策
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 备案信息 */}
      <div className="bg-gray-950 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-xs text-gray-500">
            <span>京ICP备12345678号-1</span>
            <span className="mx-2">|</span>
            <span>京公网安备 11010502012345号</span>
            <span className="mx-2">|</span>
            <span>增值电信业务经营许可证：京B2-20123456</span>
          </div>
        </div>
      </div>
    </footer>
  );
};