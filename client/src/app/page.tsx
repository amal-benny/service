import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { ArrowRight, CheckCircle, Star, Shield, Zap, Users, Trophy } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px] opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <SparkleIcon className="w-4 h-4 mr-2" />
                The Future of Professional Services
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight mb-8">
                Find the perfect <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                  professional for you
                </span>
              </h1>
              <p className="text-xl text-gray-500 font-medium mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect with top-rated service providers in your area. From expert home repairs to elite personal training, we bring excellence to your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center group active:scale-95"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/services"
                  className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-[2rem] font-black text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center active:scale-95"
                >
                  Browse Services
                </Link>
              </div>
              
              <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center space-x-2">
                   <Shield className="w-5 h-5" />
                   <span className="text-sm font-bold">Secure Payments</span>
                </div>
                <div className="flex items-center space-x-2">
                   <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                   <span className="text-sm font-bold">4.9/5 Rating</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-5 relative">
              <div className="relative z-10 w-full h-[600px] rounded-[4rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                <img
                  className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000"
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Professionals collaborating"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-50 z-20 animate-bounce-slow">
                 <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                       <CheckCircle size={24} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-gray-900">Verified Expert</p>
                       <p className="text-xs text-gray-500 font-bold">Background checked</p>
                    </div>
                 </div>
              </div>
              <div className="absolute top-10 -right-10 w-32 h-32 bg-indigo-600 rounded-full -z-10 blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               <div className="text-center space-y-2">
                  <div className="text-4xl font-black text-indigo-600">10k+</div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Active Users</div>
               </div>
               <div className="text-center space-y-2">
                  <div className="text-4xl font-black text-indigo-600">500+</div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Expert Pros</div>
               </div>
               <div className="text-center space-y-2">
                  <div className="text-4xl font-black text-indigo-600">25k+</div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Jobs Done</div>
               </div>
               <div className="text-center space-y-2">
                  <div className="text-4xl font-black text-indigo-600">4.9/5</div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Avg Rating</div>
               </div>
            </div>
         </div>
      </div>

      {/* Features Section */}
      <div className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-indigo-600 font-black text-sm uppercase tracking-[0.3em] mb-4">Why Choose Us</h2>
            <p className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              A better way to book services
            </p>
            <p className="mt-6 max-w-2xl text-xl text-gray-500 font-medium mx-auto">
              We've redesigned the service experience from the ground up to be secure, fast, and remarkably easy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             <div className="group p-10 rounded-[3rem] bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-300">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform">
                   <Zap size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Super Fast</h3>
                <p className="text-gray-500 font-medium leading-relaxed">Book a professional in under 60 seconds. Our lightning-fast flow gets you what you need instantly.</p>
             </div>
             
             <div className="group p-10 rounded-[3rem] bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-300">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform">
                   <Shield size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Secure & Trusted</h3>
                <p className="text-gray-500 font-medium leading-relaxed">Every provider is background checked and verified. Your safety and satisfaction are our top priorities.</p>
             </div>

             <div className="group p-10 rounded-[3rem] bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-300">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-8 group-hover:scale-110 transition-transform">
                   <div className="flex -space-x-2">
                      <Users size={32} />
                   </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Curated Experts</h3>
                <p className="text-gray-500 font-medium leading-relaxed">We only accept the top 5% of applicants. You're guaranteed to work with the best in the industry.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
         <div className="bg-indigo-600 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
               <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to transform your lifestyle?</h2>
               <p className="text-indigo-100 text-xl font-medium mb-12">Join thousands of others who have simplified their lives with our platform.</p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link href="/auth/register" className="px-10 py-5 bg-white text-indigo-600 rounded-[2rem] font-black text-xl hover:bg-gray-50 transition-all shadow-xl active:scale-95">
                     Create Your Account
                  </Link>
                  <Link href="/services" className="px-10 py-5 bg-indigo-500 text-white border border-indigo-400 rounded-[2rem] font-black text-xl hover:bg-indigo-400 transition-all active:scale-95">
                     Explore Services
                  </Link>
               </div>
            </div>
         </div>
      </div>

      <footer className="bg-white border-t border-gray-100 py-12">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center space-x-2">
               <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <Trophy size={20} />
               </div>
               <span className="text-2xl font-black text-gray-900">ServiceMarket</span>
            </div>
            <div className="flex space-x-12">
               <Link href="/services" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">Find Pros</Link>
               <Link href="/dashboard/support" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">Support</Link>
               <Link href="#" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">Career</Link>
            </div>
            <div className="text-sm font-bold text-gray-400">
               &copy; 2026 ServiceMarket Inc. All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
    </svg>
  );
}
