export default function Navbar() {
  return (
    <nav
      className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between text-white"
      style={{ backgroundColor: "#27233A" }}
    >
      {/* Left: Logo + Text */}
      <div className="flex items-center space-x-3 mb-2 md:mb-0">
        <img src="/logo.png" alt="Logo" className="h-20 w-20" />
        <span className="text-xl font-bold">growamuscle.com</span>
      </div>

      {/* Right: Nav Links + Login */}
      <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
        <a href="#" className="hover:text-blue-400">Workouts</a>
        <a href="#" className="hover:text-blue-400">Programs</a>
        <a href="#" className="hover:text-blue-400">Progress</a>
        <a href="#" className="hover:text-blue-400">BMI Calculator</a>
        <a href="#" className="hover:text-blue-400">Healthy Living</a>
        <a
          href="#"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </a>
      </div>
    </nav>
  );
}
