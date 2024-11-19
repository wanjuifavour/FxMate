'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, BarChart2, Bell, Globe, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
export default function Component() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const features = [
    {
      icon: <BarChart2 className="h-8 w-8 text-blue-400" />,
      title: "Real-Time Rates",
      description: "Get live exchange rates for major currency pairs",
      detailedDescription: "Stay ahead of the market with our lightning-fast real-time rates. Whether you're a day trader or a long-term investor, our up-to-the-second exchange rates for all major currency pairs ensure you're always making informed decisions. With FxMate, you'll never miss a beat in the fast-paced world of forex trading.",
      personalizedMessage: "Imagine always knowing the exact moment to make your move in the market. That's the power of FxMate's real-time rates at your fingertips."
    },
    {
      icon: <Globe className="h-8 w-8 text-teal-400" />,
      title: "Historical Data",
      description: "Access and analyze historical forex data",
      detailedDescription: "Dive deep into the past to predict the future. Our comprehensive historical data allows you to analyze trends, backtest your strategies, and gain insights that can give you a significant edge. With data going back decades, you'll have all the information you need to make data-driven decisions.",
      personalizedMessage: "Your trading strategy is unique. Shouldn't your data be too? With FxMate's historical data, you can tailor your analysis to your specific needs and trading style."
    },
    {
      icon: <Bell className="h-8 w-8 text-purple-400" />,
      title: "Custom Alerts",
      description: "Set alerts for your target exchange rates",
      detailedDescription: "Never miss an opportunity with our custom alert system. Set alerts for any currency pair at your target rates, and we'll notify you immediately when the market hits your specified levels. Whether you're at your desk or on the go, you'll always be in the know.",
      personalizedMessage: "Your time is valuable. Let FxMate watch the markets for you, so you can focus on what really matters - making profitable trades."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              FxMate
            </span>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <motion.h1 
            className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to FxMate
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Real-time forex data and analysis at your fingertips
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => router.push('/register')}
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              detailedDescription={feature.detailedDescription}
              personalizedMessage={feature.personalizedMessage}
              index={index}
              isHovered={hoveredCard === index}
              setHovered={setHoveredCard}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  detailedDescription: string
  personalizedMessage: string
  index: number
  isHovered: boolean
  setHovered: (index: number | null) => void
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  detailedDescription,
  personalizedMessage,
  index, 
  isHovered, 
  setHovered 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
  >
    <Card className={`bg-gray-800 border-gray-700 transition-all duration-300 ${isHovered ? 'transform scale-105 shadow-lg' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">{description}</p>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
              Learn more <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {icon}
                <span>{title}</span>
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <p className="text-sm text-gray-300 mb-4">{detailedDescription}</p>
              <p className="text-sm font-semibold text-blue-400">{personalizedMessage}</p>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  </motion.div>
)