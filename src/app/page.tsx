export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center mt-20 px-4">
      <section className="bg-gradient-to-r from-purple-400  to-purple-600 rounded-3xl p-8 shadow-lg text-center max-w-3xl w-full animate-fade-in">
        
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
          🎉 Welcome to Pixel TODOs! 🎉
        </h1>
        <p className="text-white/90 mb-6 text-lg md:text-xl">
          Organize your day, track your tasks, and have fun while doing it!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/signup">
            <button className="px-6 py-3 bg-white text-purple-500 font-semibold rounded-full shadow-md hover:scale-105 transition-transform">
              Signup Now 🚀
            </button>
          </a>
          <a href="/login">
            <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-md hover:scale-105 transition-transform">
              Login ✨
            </button>
          </a>
        </div>

        <p className="mt-6 text-white/80 text-sm">
          Simple, fun, and cute way to manage your tasks.
        </p>
      </section>

    </div>
  );
}
