import { motion } from "framer-motion";

const AISection = () => {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">The Future of Paratransit is Here</h2>
          <p className="text-lg text-gray-400 mt-2">
            Uthutho is at the forefront of revolutionizing paratransit systems across the Global South.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 p-8 rounded-lg"
          >
            <h3 className="text-2xl font-bold mb-4">Phase 1: Data Collection</h3>
            <p className="text-gray-400">
              We are actively mapping paratransit networks, starting with key regions and expanding globally.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800 p-8 rounded-lg"
          >
            <h3 className="text-2xl font-bold mb-4">Phase 2: Real-time Analytics</h3>
            <p className="text-gray-400">
              Our platform will provide live insights into passenger demand, traffic patterns, and vehicle availability.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-800 p-8 rounded-lg"
          >
            <h3 className="text-2xl font-bold mb-4">Phase 3: AI-Powered Optimization</h3>
            <p className="text-gray-400">
              Leveraging artificial intelligence to create dynamic, efficient, and sustainable paratransit for all.
            </p>
          </motion.div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/blog"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Learn More About Our Vision
          </a>
        </div>
      </div>
    </section>
  );
};

export default AISection;
