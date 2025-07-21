import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import { NumericFormat } from "react-number-format";
import { Link, useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function CardPage() {
  const [card, setCard] = useState(null);
  const [message, setMessage] = useState("");
  const { id } = useParams();

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 11) return "pagi";
    if (hour >= 11 && hour < 15) return "siang";
    if (hour >= 15 && hour < 18) return "sore";
    return "malam";
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("/cards/" + id)
      .then(({ data }) => {
        setCard(data);
      })
      .catch((error) => {
        console.error("Error fetching card data:", error);
      });

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (card) {
      const greeting = getGreeting();
      setMessage(
        encodeURI(
          `Halo, selamat ${greeting}! Saya tertarik dengan ${card.name}. Bisa minta info lebih lanjut?`
        )
      );
    }
  }, [card, getGreeting]);

  const whatsappUrl = useMemo(
    () => `https://wa.me/6282314767964?text=${message}`,
    [message]
  );

  const specsSection = useMemo(
    () => (
      <div className="mt-2 px-2">
        <div className="detail-heading md:text-xl">Spesifikasi</div>
        <div className="flex gap-8 mt-1 ml-5">
          <ul className="flex flex-col items-start md:gap-1">
            <li className="detail-specs-name md:text-base">Jenis Domba</li>
            <li className="detail-specs-name md:text-base">Usia</li>
            {/* <li className="detail-specs-name md:text-base">Tinggi Badan</li> */}
            <li className="detail-specs-name md:text-base">Berat Badan</li>
            {/* <li className="detail-specs-name md:text-base">Warna</li> */}
          </ul>
          <ul className="flex flex-col items-start md:gap-1">
            <li className="detail-specs md:text-base">{card?.category}</li>
            <li className="detail-specs md:text-base">{card?.age} Bulan</li>
            {/* <li className="detail-specs md:text-base">{card?.height} cm</li> */}
            <li className="detail-specs md:text-base">{card?.weight} kg</li>
            {/* <li className="detail-specs md:text-base">{card?.color}</li> */}
          </ul>
        </div>
      </div>
    ),
    [card?.category, card?.age, card?.weight]
  );

  const descriptionSection = useMemo(
    () => (
      <div className="mt-3 px-2">
        <div className="detail-heading md:text-xl">Deskripsi</div>
        <div className="detail-desc mt-1 md:text-base">{card?.desc}</div>
      </div>
    ),
    [card?.desc]
  );

  if (!card) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="">
      <header className="mx-auto bg-white flex flex-wrap items-center justify-between px-4 sm:px-12 md:px-24 py-3">
        <a href="/" className="flex items-center gap-3">
          <img
            src="/images/appbar-logo.svg"
            className="h-10"
            alt="Bimantara Farm Logo"
          />
          <h1 className="text-xl font-bold text-gray-800">Bimantara Farm</h1>
        </a>

        <Link
          to={"/"}
          className="font-medium flex items-center gap-2 bg-[#f97a00] hover:bg-orange-400 py-[10px] px-6 label w-auto text-white rounded-3xl"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Kembali
        </Link>
      </header>

      <div className="md:flex md:max-w-4xl md:m-auto md:mt-2 md:px-4 lg:px-0">
        <div>
          {card.photos && card.photos.length > 0 && (
            <Carousel showThumbs={false} className="md:mt-5 md:w-[30rem]">
              {card.photos.map((photo, index) => (
                <div key={index} className="">
                  <img
                    src={card.photos[0].replace(
                      "/upload/",
                      "/upload/c_fill,f_auto,q_auto/"
                    )}
                    loading="lazy"
                    className="w-full h-72 md:h-[20rem] object-contain bg-gradient-to-r from-gray-600 to-gray-400"
                    alt={`${card.name} ${index + 1}`}
                  />
                </div>
              ))}
            </Carousel>
          )}

          <div className="flex justify-between mt-3 px-2 md:px-0 md:mt-7">
            <div className="detail-name md:text-2xl">
              <span className="mr-1 text-2xl">🐑</span>
              {card.name}
            </div>
            <div className="detail-price flex items-center">
              <span className="mr-1 text-2xl">💸</span>
              <NumericFormat
                value={card.price}
                displayType={"text"}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
                renderText={(formattedValue) => (
                  <span className="font-semibold price-card font-mono text-lg">
                    {formattedValue}
                  </span>
                )}
              />
            </div>
          </div>
        </div>

        <div className="md:pt-2 pl-4 lg:pl-20">
          {specsSection}
          {descriptionSection}
        </div>
      </div>

      <div className="mt-6 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4 lg:px-0 pb-6 md:max-w-4xl md:mx-auto">
        <div className="md:col-span-2 flex items-center text-sm md:text-base text-gray-800 font-medium leading-relaxed">
          Tertarik dengan domba ini? Yuk, hubungi kami untuk info lengkapnya.
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="gap-2 w-full flex justify-center items-center bg-[#f97a00] hover:bg-orange-500 text-white font-semibold py-2 md:py-2.5 px-4 rounded-full transition-colors duration-200 text-sm md:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="20"
            height="20"
            viewBox="0 0 50 50"
            fill="white"
          >
            <path d="M25,2C12.318,2,2,12.318,2,25c0,3.96,1.023,7.854,2.963,11.29L2.037,46.73c-0.096,0.343-0.003,0.711,0.245,0.966 C2.473,47.893,2.733,48,3,48c0.08,0,0.161-0.01,0.24-0.029l10.896-2.699C17.463,47.058,21.21,48,25,48c12.682,0,23-10.318,23-23 S37.682,2,25,2z M36.57,33.116c-0.492,1.362-2.852,2.605-3.986,2.772c-1.018,0.149-2.306,0.213-3.72-0.231 c-0.857-0.27-1.957-0.628-3.366-1.229c-5.923-2.526-9.791-8.415-10.087-8.804C15.116,25.235,13,22.463,13,19.594 s1.525-4.28,2.067-4.864c0.542-0.584,1.181-0.73,1.575-0.73s0.787,0.005,1.132,0.021c0.363,0.018,0.85-0.137,1.329,1.001 c0.492,1.168,1.673,4.037,1.819,4.33c0.148,0.292,0.246,0.633,0.05,1.022c-0.196,0.389-0.294,0.632-0.59,0.973 s-0.62,0.76-0.886,1.022c-0.296,0.291-0.603,0.606-0.259,1.19c0.344,0.584,1.529,2.493,3.285,4.039 c2.255,1.986,4.158,2.602,4.748,2.894c0.59,0.292,0.935,0.243,1.279-0.146c0.344-0.39,1.476-1.703,1.869-2.286 s0.787-0.487,1.329-0.292c0.542,0.194,3.445,1.604,4.035,1.896c0.59,0.292,0.984,0.438,1.132,0.681 C37.062,30.587,37.062,31.755,36.57,33.116z"></path>
          </svg>
          Hubungi Kami
        </a>
      </div>

      <footer className="bg-gray-800 text-white py-8 px-4 sm:px-12 md:px-24 mt-2 md:mt-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
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
                className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300"
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
                className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-colors duration-300"
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
                className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
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
                className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center hover:bg-black transition-colors duration-300"
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
                className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
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
