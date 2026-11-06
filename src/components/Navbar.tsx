import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

/**
 * 导航栏组件
 * @returns 导航栏组件
 */
export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isLoggedIn, cart, logout } = useStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    navigate(`/courses${query ? `?${params}` : ''}`);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const navigationItems = [
    { name: '首页', href: '/', current: pathname === '/' },
    { name: '课程', href: '/courses', current: pathname === '/courses' || pathname.startsWith('/courses/') },
    { name: '分类', href: '/categories', current: pathname === '/categories' || pathname.startsWith('/categories/') },
    { name: '关于我们', href: '/about', current: pathname === '/about' },
    { name: '联系我们', href: '/contact', current: pathname === '/contact' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-teal-500" />
              <span className="text-xl font-bold text-gray-900">
                中文学堂
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    item.current
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <form role="search" aria-label="课程搜索" onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                aria-label="搜索课程"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="搜索课程..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
              />
            </div>
          </form>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile search toggle */}
            <button
              type="button"
              aria-label="搜索课程"
              aria-expanded={isSearchOpen}
              aria-controls="mobile-course-search"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Shopping Cart */}
            <button
              aria-label="购物车"
              onClick={handleCartClick}
              className="relative p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isLoggedIn && user ? (
              <div className="relative group">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                  <span className="hidden lg:block text-sm font-medium">
                    {user.name}
                  </span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    个人中心
                  </Link>
                  <Link
                    to="/my-courses"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    我的课程
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    订单记录
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogin}
                  className="hidden lg:inline-flex"
                >
                  登录
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="hidden lg:inline-flex"
                >
                  注册
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              aria-label="导航菜单"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <form id="mobile-course-search" role="search" aria-label="移动端课程搜索" onSubmit={handleSearch} className="lg:hidden px-4 pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              aria-label="搜索课程"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="搜索课程..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
            />
          </div>
        </form>
      )}

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-navigation" className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                  item.current
                    ? 'text-teal-600 bg-teal-50'
                    : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            {!isLoggedIn && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3 space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1"
                  >
                    登录
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      navigate('/register');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1"
                  >
                    注册
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
