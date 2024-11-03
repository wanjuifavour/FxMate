import type { NextPage } from 'next';
import { NavBar } from '../components/NavBar';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to FxMate
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Real-time forex data and analysis at your fingertips
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <FeatureCard
              title="Real-Time Rates"
              description="Get live exchange rates for major currency pairs"
            />
            <FeatureCard
              title="Historical Data"
              description="Access and analyze historical forex data"
            />
            <FeatureCard
              title="Custom Alerts"
              description="Set alerts for your target exchange rates"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;
