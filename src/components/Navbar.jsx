import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-base-300 shadow-sm px-4 md:px-8 py-2 relative">
            {/* Conteneur principal centré */}
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-center space-y-2 md:space-y-0 md:space-x-6">

                {/* Logo */}
                <Link to="/" className="btn btn-ghost text-xl">
                    IceStats
                </Link>

                {/* Liens desktop */}
                <ul className="hidden md:flex space-x-6 text-sl">
                    <li><Link to="/teams">Teams</Link></li>
                    <li><Link to="/stats">Stats</Link></li>
                    <li><Link to="/standings">Standings</Link></li>
                </ul>

                {/* Recherche */}
                <input
                    type="text"
                    placeholder="Search"
                    className="input input-bordered outline-0 w-24 md:w-40"
                />

                <label className="flex cursor-pointer gap-2 items-center">
                    {/* nord */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                    </svg>

                    <input
                        type="checkbox"
                        className="toggle"
                        onChange={(e) =>
                            document.documentElement.setAttribute(
                                "data-theme",
                                e.target.checked ? "dark" : "nord"
                            )
                        }
                    />

                    {/* dark */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                </label>

                {/* Burger menu mobile */}
                <button
                    className="md:hidden btn btn-ghost text-lg"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    ☰
                </button>
            </div>

            {/* Menu mobile */}
            {isOpen && (
                <ul className="flex flex-col items-center space-y-2 mt-2 md:hidden text-sl">
                    <li><Link to="/teams">Teams</Link></li>
                    <li><Link to="/stats">Stats</Link></li>
                    <li><Link to="/standings">Standings</Link></li>
                </ul>
            )}
        </nav>
    );
};

export default Navbar;


