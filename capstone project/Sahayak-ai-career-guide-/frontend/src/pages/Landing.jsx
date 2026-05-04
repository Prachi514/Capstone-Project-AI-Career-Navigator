import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    { q: 'How does Manzil recommend careers?', a: 'We combine a short aptitude test, your interests, and real-world college/career data to suggest personalized pathways.' },
    { q: 'Is Manzil free?', a: 'Core features like college discovery and the quick assessment are free. Premium features (mentoring, mock interviews) will be optional.' },
    { q: 'How accurate are recommendations?', a: 'Recommendations are a guidance tool — best used with your own research and counseling for final decisions.' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-indigo-50 via-white to-indigo-50 text-gray-900">
      {/* Top navigation */}
      <nav className="z-30 sticky top-0 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-tr from-indigo-600 to-pink-500 text-white flex items-center justify-center font-bold shadow-lg">S</div>
              <span className="font-bold text-lg">Manzil</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="hover:text-indigo-600">Features</a>
              <a href="#how" className="hover:text-indigo-600">How it works</a>
            
              <Link to="/login" className="px-3 py-1 rounded-md">Login</Link>
              <Link to="/signup" className="px-4 py-2 rounded-md bg-linear-to-r from-indigo-600 to-pink-500 text-white shadow-md">Get Started</Link>
            </div>

            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
                <p className="inline-flex items-center gap-2 text-sm rounded-full bg-pink-50 text-pink-600 px-3 py-1 mb-4">
                  <span className="text-xs font-medium">New</span>
                  <span className="text-xs">AI-driven career match</span>
                </p>

                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">Turn your strengths into a clear career path — with Manzil.</h1>
                <p className="text-lg text-gray-700 mb-8 max-w-xl">Discover colleges, compare courses, and get a personalized roadmap with actionable steps and timelines. Quick, visual and student-friendly.</p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/signup" className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-linear-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition">Create Free Account</Link>
                  <a href="#features" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 bg-white hover:shadow">Explore Features</a>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4 max-w-xs">
                  <Stat label="Colleges" value="20k+" />
                  <Stat label="Careers" value="15+" />
                  <Stat label="Rating" value="4.8/5" />
                </div>
              </motion.div>
            </div>

            <div className="relative">
              <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className="bg-white rounded-xl shadow-2xl p-6">
                <InteractivePreview />
              </motion.div>

              <FloatingCard top="-8" left="-8" text="Top colleges" sub="Filter by course & location" />
              <FloatingCard top="24" right="-8" text="Personal roadmap" sub="5‑minute assessment" />
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Built for students who want clarity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard title="Career Match" desc="AI matches your interests and skills to real career paths with required skills and timelines." icon="🔍"/>
            <FeatureCard title="College Explorer" desc="Deep filters for course, fees, cutoff trends, placement stats and nearby options." icon="🏛️"/>
            <FeatureCard title="Prep Hub" desc="Mock interviews, recommended courses, scholarships and study plans in one place." icon="🎯"/>
          </div>

          <div className="mt-10 bg-linear-to-r from-indigo-50 to-pink-50 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Take the 5-minute Career Snapshot</h3>
              <p className="text-gray-700">Quick assessment to jump-start personalized recommendations — students who take it find relevant options 3x faster.</p>
            </div>
            <div>
              <Link to="/signup" className="px-5 py-2 rounded-full bg-linear-to-r from-indigo-600 to-pink-500 text-white font-medium">Start Snapshot</Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center mb-10">How Manzil works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Steps number={1} title="Create Profile" text="Add interests, education and career goals." />
            <Steps number={2} title="Take Snapshot" text="Short assessment — 5 minutes — to surface matches." />
            <Steps number={3} title="Explore & Apply" text="View top-fit colleges, make a plan, prepare and apply." />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center mb-8">Success stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Testimonial name="Asha" role="12th Grader" text="The roadmap helped me focus my study plan — I applied to 3 colleges I liked." />
            <Testimonial name="Vikram" role="UG Aspirant" text="Easy filters made college discovery much faster. Saved me weeks of research." />
            <Testimonial name="Neha" role="Career Changer" text="Practical resources and timelines made switching streams feel doable." />
          </div>
        </div>
      </section>

      {/* FAQ + CTA */}
      <section id="faq" className="py-16 bg-linear-to-b from-white to-indigo-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-6">Frequently asked</h3>
            <div className="space-y-3">
              {faqs.map((f, idx) => (
                <div key={idx} className="border rounded-lg overflow-hidden bg-white">
                  <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full text-left px-4 py-3 flex justify-between items-center">
                    <span className="font-medium">{f.q}</span>
                    <span className="text-indigo-600">{openFaq === idx ? '−' : '+'}</span>
                  </button>
                  {openFaq === idx && <div className="px-4 pb-4 text-gray-700">{f.a}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-6 bg-linear-to-r from-pink-500 to-indigo-600 text-white">
            <h4 className="text-xl font-semibold mb-2">Ready to get clarity?</h4>
            <p className="mb-4">Create a free account and take a short assessment to get a personalized roadmap.</p>
            <Link to="/signup" className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white text-pink-600 font-semibold">Create Free Account</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="font-bold text-white mb-2">Manzil</h5>
            <p className="text-sm">Make confident choices about college and career with clear, actionable steps.</p>
          </div>

          {/* <div>
            <h5 className="font-semibold mb-2">Product</h5>
            <ul className="text-sm space-y-2">
              <li><Link to="/colleges" className="hover:underline">College Explorer</Link></li>
              <li><Link to="/careers" className="hover:underline">Career Match</Link></li>
              <li><Link to="/assess" className="hover:underline">Assessments</Link></li>
            </ul>
          </div> */}

          <div>
            <h5 className="font-semibold mb-2">Company</h5>
            <ul className="text-sm space-y-2">
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
              
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">© 2025 Manzil. All rights reserved.</div>
      </footer>
    </div>
  );
}

/* ----- Small components ----- */
function MobileMenu(){
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="p-2 rounded-md bg-white shadow">☰</button>
      {open && (
        <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg p-3">
          <a href="#features" className="block py-2">Features</a>
          <a href="#how" className="block py-2">How it works</a>
          
          <Link to="/signup" className="block py-2 font-semibold text-indigo-600">Get Started</Link>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }){
  return (
    <div className="bg-white rounded-full px-4 py-2 shadow-sm text-center">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function InteractivePreview(){
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-linear-to-r from-indigo-600 to-pink-500 text-white flex items-center justify-center font-bold">AI</div>
        <div>
          <div className="text-sm font-semibold">AI Career Match</div>
          <div className="text-xs text-gray-500">Find careers that fit your profile</div>
        </div>
      </div>

      <div className="bg-gray-50 border rounded-lg p-3">
        <div className="flex items-center justify-between text-sm mb-2">
          <span>Top Fit</span>
          <span className="font-medium">Data Science</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-2 rounded-full bg-linear-to-r from-indigo-600 to-pink-500 w-3/4"></div>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 px-3 py-2 rounded-md bg-white border">View Colleges</button>
        <button className="flex-1 px-3 py-2 rounded-md bg-indigo-600 text-white">Save</button>
      </div>
    </div>
  );
}

function FloatingCard({ top, left, right, text, sub }){
  const style = { position: 'absolute', top: top || 'auto', left: left || 'auto', right: right || 'auto' };
  return (
    <div style={style} className="bg-white rounded-xl p-3 shadow-lg w-44 hidden lg:block">
      <div className="text-sm font-semibold">{text}</div>
      <div className="text-xs text-gray-500">{sub}</div>
    </div>
  );
}

function FeatureCard({ title, desc, icon }){
  return (
    <motion.div whileHover={{ y: -6 }} className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
      <div className="text-3xl mb-4">{icon}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
    </motion.div>
  );
}

function Steps({ number, title, text }){
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 rounded-full bg-linear-to-r from-indigo-600 to-pink-500 text-white flex items-center justify-center font-semibold">{number}</div>
      <div>
        <h5 className="font-semibold">{title}</h5>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  );
}

function Testimonial({ name, role, text }){
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-linear-to-r from-white to-indigo-50 rounded-xl p-5 shadow">
      <p className="italic text-gray-700">"{text}"</p>
      <div className="mt-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-linear-to-r from-indigo-600 to-pink-500 text-white flex items-center justify-center font-semibold">{name.charAt(0)}</div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-500">{role}</div>
        </div>
      </div>
    </motion.div>
  );
}
