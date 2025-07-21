import axios from "axios";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { Link, Navigate } from "react-router-dom";
// import PlainHeader from "../../components/PlainHeader";

export default function AdminPage() {
  const [cards, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = ["Bunting", "Cempe cross", "Cempe lokal", "Pejantan"];

  useEffect(() => {
    if (!admin) {
      axios
        .get("/admin")
        .then(({ data }) => {
          if (data) {
            setAdmin(data);
          } else {
            setRedirect(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching admin data: ", error);
          setRedirect(true);
        });
    }
  }, [admin]);

  useEffect(() => {
    axios
      .get("/cards")
      .then(({ data }) => {
        setCard(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch cards:", error);
        setLoading(false);
      });
  }, []);

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsExpanded(false);
  };

  const filteredCards = selectedCategory
    ? cards.filter((card) => card.category === selectedCategory)
    : cards;

  return (
    <div className="root">
      <header className="mx-auto bg-white flex flex-wrap items-center justify-between px-4 sm:px-12 md:px-24 py-3">
        <a href="/" className="flex items-center gap-3">
          <img
            src="/images/appbar-logo.svg"
            className="h-10"
            alt="Bimantara Farm Logo"
          />
          <h1 className="text-xl font-bold text-gray-800">Bimantara Farm</h1>
        </a>

        <div className="flex items-center gap-2">
          <Link
            to={"/"}
            className="text-orange-500 font-semibold hover:bg-orange-50 rounded-lg transition-colors px-1 py-1"
          >
            <img
              src="/barn-logo.svg"
              className="h-7 md:h-10"
              alt="Bimantara Farm Logo"
            />
          </Link>
        </div>
      </header>
      

      <main className="catalog mt-2 pt-4 md:max-w-7xl md:m-auto px-4 sm:px-12 md:px-24">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-800">Admin Page</h2>
            <Link
              to={"/add"}
              className="px-4 py-2 bg-[#f97a00] hover:bg-orange-400 text-white text-sm font-medium rounded-3xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
            >
              Tambah Produk
            </Link>
          </div>
          <div className="relative">
            <button
              onClick={toggleExpanded}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-3xl hover:border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
            >
              <span className="text-gray-700 text-sm font-medium">
                {selectedCategory || "Pilih Kategori"}
              </span>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {isExpanded && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:bg-gray-50"
                    >
                      {category}
                    </button>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => handleCategoryClick("")}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-500 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:bg-gray-50"
                    >
                      Tampilkan semua
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 gap-2 card-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <Link
                to={"/edit/" + card._id}
                key={card._id}
                className="block card bg-slate-100 rounded-3xl shadow"
              >
                <img
                  className={`rounded-t-3xl object-cover w-full h-40 ${
                    card.status === "sold" ? "grayscale" : ""
                  }`}
                  src={card.photos[0].replace(
                    "/upload/",
                    "/upload/c_fill,f_auto,q_auto/"
                  )}
                  alt={card.name}
                />
                <div className="px-2 pb-2">
                  <div className="mt-2 text-xl font-semibold mb-2">
                    {card.name}
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 font-medium">
                      <div className="flex items-center font-normal">
                        <span className="mr-1">⚖️</span>
                        {card.weight} kg
                      </div>
                      <div className="flex items-center font-normal">
                        <span className="mr-1">🗓️</span>
                        {card.age} bulan
                      </div>
                    </div>
                  </div>

                  <span className="mr-1">💸</span>
                  <NumericFormat
                    value={card.price}
                    displayType={"text"}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="Rp "
                    renderText={(formattedValue) => (
                      <span className="text-gray-500 price-card font-mono">
                        {formattedValue}
                      </span>
                    )}
                  />

                  <button className="text-sm font-semibold edit-card w-full p-2 mt-2 rounded-full bg-[#f97a00]">
                    Edit
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-8 bg-white border border-gray-200 rounded-lg">
              <div className="text-gray-400 text-2xl mb-3">🐐</div>
              <div className="text-gray-600 text-sm font-medium mb-1">
                Belum ada kambing tersedia
              </div>
              <div className="text-gray-400 text-xs">
                Coba pilih kategori lain atau cek lagi nanti
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-5 md:mt-8 bg-gray-800 text-white py-8 px-4 sm:px-12 md:px-24">
        <div className="container mx-auto">
          <div className="invisible hidden md:flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Brand Info */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <img
                  alt="Bimantara Farm Logo"
                  className="h-10"
                  src="/images/appbar-logo.svg"
                />
                <h2 className="text-xl font-bold text-white">Bimantara Farm</h2>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex gap-4">
              <a
                href="https://wa.me/6282314767964"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.488" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/peternaknaningsalatiga"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center transition-colors bg-gradient-to-r hover:from-purple-600 hover:to-pink-600"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@peternakningsalatiga"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center hover:bg-black transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-6 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Bimantara Farm. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
