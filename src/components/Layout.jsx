import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 z-40">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
            >
              <ApperIcon name="CheckSquare" size={20} className="text-white" />
            </motion.div>
            <h1 className="text-xl font-heading font-bold text-gray-900">TaskFlow</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Stay organized, stay productive
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;