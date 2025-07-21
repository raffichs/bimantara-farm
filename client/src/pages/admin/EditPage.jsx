import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

export default function EditPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  // const [type, setType] = useState("");
  const [age, setAge] = useState("");
  // const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  // const [color, setColor] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [linkPhotos, setLinkPhotos] = useState("");
  const [admin, setAdmin] = useState(null);
  const [redirect, setRedirect] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (!admin) {
      axios
        .get("/admin")
        .then(({ data }) => {
          if (data) {
            setAdmin(data);
          } else {
            setRedirect("/login");
          }
        })
        .catch((error) => {
          console.error("Error fetching admin data: ", error);
          setRedirect("/login");
        });
    }
  }, [admin]);

  useEffect(() => {
    axios
      .get("/cards/" + id)
      .then(({ data }) => {
        setName(data.name);
        setPrice(data.price);
        // setType(data.type);
        setAge(data.age);
        // setHeight(data.height);
        setWeight(data.weight);
        // setColor(data.color);
        setDesc(data.desc);
        setCategory(data.category);
        setStatus(data.status);
        setAddedPhotos(data.photos);
      })
      .catch((error) => {
        console.error("Error fetching card data:", error);
      });
  }, [id]);

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  if (!name) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    if (!linkPhotos) {
      alert("Link cannot be empty");
      return;
    }

    try {
      setIsLoading(true);

      const { data: filename } = await axios.post("/upload-by-link", {
        link: linkPhotos,
      });

      setAddedPhotos((prev) => {
        return [...prev, filename];
      });
      setLinkPhotos("");
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function uploadPhoto(ev) {
    setIsLoading(true);

    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        setAddedPhotos((prev) => {
          return [...prev, ...filenames];
        });
      })
      .catch((error) => {
        console.error("Error uploading photos:", error);
        alert("Failed to upload photos. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleStatus(ev) {
    setStatus(ev.target.value);
  }

  function handleCategory(ev) {
    setCategory(ev.target.value);
  }

  // function handleType(ev) {
  //   setType(ev.target.value);
  // }

  async function editCard(ev) {
    ev.preventDefault();
    try {
      await axios.put("/edit/" + id, {
        name,
        price,
        // type,
        age,
        // height,
        weight,
        // color,
        desc,
        category,
        status,
        photos: addedPhotos,
      });
      setRedirect("/admin");
    } catch (error) {
      console.error("Error updating card: ", error);
    }
  }

  const deleteCard = async () => {
    const confirm = window.confirm(
      "Apakah anda yakin ingin menghapus domba ini?"
    );
    if (confirm) {
      try {
        await axios.delete("/delete/" + id);
        setRedirect("/admin");
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  function removePhoto(filename) {
    const confirm = window.confirm("Hapus foto?");
    if (confirm) {
      setAddedPhotos((prevPhotos) =>
        prevPhotos.filter((photo) => photo !== filename)
      );

      axios
        .delete("/remove", { data: { filename } })
        .then((response) => {
          console.log("Photo deleted successfully: ", response.data);
        })
        .catch((error) => {
          console.error("Error deleting photo: ", error);
        });
    }
  }

  function starPhoto(filename) {
    setAddedPhotos((prevPhotos) => {
      const updatedPhotos = prevPhotos.filter((photo) => photo !== filename);
      return [filename, ...updatedPhotos];
    });
  }

  return (
    <div>
      <header className="mx-auto max-w-6xl bg-white flex flex-wrap items-center justify-between px-4 sm:px-12 md:px-24 py-3">
        <a href="" className="flex items-center gap-3">
          <img
            src="/images/appbar-logo.svg"
            className="h-10"
            alt="Bimantara Farm Logo"
          />
          <h1 className="text-xl font-bold text-gray-800">
            Edit Page
          </h1>
        </a>

        <Link
          to={"/admin"}
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

      <div className="mt-2 p-2 md:max-w-4xl md:m-auto">
        <form className="mt-3" onSubmit={editCard}>
          <div className="flex items-center">
            <label htmlFor="name">Nama</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="price" className="flex items-end">
              Harga{" "}
              <div className=" flex item-center text-gray-500 text-[12px]">
                &nbsp;(ex: 2500000)
              </div>
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="category">Kategori Domba</label>
            <select
              name=""
              id="category"
              className="input"
              value={category}
              onChange={handleCategory}
            >
              <option value="" disabled selected hidden></option>
              <option value="Bunting">Domba bunting</option>
              <option value="Cross">Cempe cross</option>
              <option value="Lokal">Cempe lokal</option>
              <option value="Pejantan">Pejantan</option>
            </select>
          </div>
          <div className="flex items-center">
            <label htmlFor="age" className="flex items-center">
              Usia{" "}
              <div className=" flex item-center text-gray-500 text-[12px]">
                &nbsp;(dalam bulan)
              </div>
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(ev) => setAge(ev.target.value)}
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="weight" className="flex items-center">
              Berat Badan{" "}
              <div className=" flex item-center text-gray-500 text-[12px]">
                &nbsp;(kg)
              </div>
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(ev) => setWeight(ev.target.value)}
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="desc">Deskripsi</label>
            <textarea
              name=""
              id="desc"
              value={desc}
              onChange={(ev) => setDesc(ev.target.value)}
            ></textarea>
          </div>
          <div className="grid grid-cols-2 mt-2">
            <div className="label">Status</div>
            <div className="grid grid-cols-2">
              <div className="flex gap-2">
                <input
                  className="w-4"
                  type="radio"
                  value="active"
                  name="status"
                  checked={status === "active"}
                  onChange={handleStatus}
                />{" "}
                <label htmlFor="active">Aktif</label>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-4"
                  type="radio"
                  value="sold"
                  name="status"
                  checked={status === "sold"}
                  onChange={handleStatus}
                />{" "}
                <label htmlFor="sold">Sold&nbsp;Out</label>
              </div>
            </div>
          </div>
          <div className="label mt-3">Tambah Foto</div>
          <div className="flex items-center gap-2 mt-1">
            <input
              className="p-2"
              type="text"
              placeholder="kambing.jpg"
              value={linkPhotos}
              onChange={(ev) => setLinkPhotos(ev.target.value)}
            />
            <button
              onClick={addPhotoByLink}
              className="bg-[#f97a00] hover:bg-orange-400 label text-white p-2 rounded-md w-[6rem]"
            >
              Tambah
            </button>
          </div>
          <div className="mt-2 gap-2 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6">
            {addedPhotos.length > 0 &&
              addedPhotos.map((link) => (
                <div className="flex relative h-30" key={link}>
                  <img
                    className="rounded-xl w-full object-cover h-28"
                    src={link.replace(
                      "/upload/",
                      "/upload/c_fill,f_auto,q_auto/"
                    )}
                    alt=""
                  />
                  <div
                    onClick={() => removePhoto(link)}
                    className="cursor-pointer absolute bottom-1 right-1 bg-black bg-opacity-50 py-1 px-2 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 9 9"
                      fill="none"
                    >
                      <path
                        d="M1.83331 9C1.55831 9 1.32298 8.90217 1.12731 8.7065C0.931646 8.51083 0.833646 8.27533 0.833313 8V1.5H0.333313V0.5H2.83331V0H5.83331V0.5H8.33331V1.5H7.83331V8C7.83331 8.275 7.73548 8.5105 7.53981 8.7065C7.34415 8.9025 7.10865 9.00033 6.83331 9H1.83331ZM6.83331 1.5H1.83331V8H6.83331V1.5ZM2.83331 7H3.83331V2.5H2.83331V7ZM4.83331 7H5.83331V2.5H4.83331V7Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div
                    onClick={() => starPhoto(link)}
                    className="cursor-pointer absolute bottom-1 left-1 bg-black bg-opacity-50 py-1 px-2 rounded-full"
                  >
                    {link === addedPhotos[0] && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-[10px] text-white"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {link !== addedPhotos[0] && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="size-[10px] text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            <div
              className={
                isLoading ? "flex justify-center items-center" : "hidden"
              }
            >
              <div className="spinner w-10 h-10"></div>
            </div>
            <label className="label h-30 flex w-auto items-center justify-center border border-gray-600 bg-transparent rounded-xl px-2 py-8 cursor-pointer">
              <input
                type="file"
                multiple
                className="hidden"
                name=""
                id=""
                onChange={uploadPhoto}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                // className="md:w-20 md:h-20"
                width="18"
                height="18"
                viewBox="0 0 14 13"
                fill="none"
              >
                <path
                  d="M7.00001 4.99999V11.75M7.00001 4.99999L9.25001 7.24999M7.00001 4.99999L4.75001 7.24999M11.125 8.74999C12.2643 8.74999 13 7.82674 13 6.68749C13 6.23645 12.8521 5.79786 12.579 5.43889C12.3059 5.07993 11.9227 4.82037 11.488 4.69999C11.4211 3.85883 11.0725 3.06481 10.4985 2.44631C9.92454 1.8278 9.15872 1.42096 8.32489 1.29156C7.49106 1.16215 6.63796 1.31776 5.9035 1.7332C5.16905 2.14865 4.59618 2.79966 4.27751 3.58099C3.60658 3.395 2.88925 3.48316 2.28332 3.82607C1.67739 4.16898 1.2325 4.73856 1.04651 5.40949C0.860529 6.08042 0.948689 6.79775 1.2916 7.40368C1.63451 8.00961 2.20408 8.4545 2.87501 8.64049"
                  stroke="black"
                  strokeOpacity="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              &nbsp; Upload
            </label>
          </div>
          <div className="flex gap-4">
            <div
              onClick={deleteCard}
              className="flex justify-center items-center bg-red-50 hover:bg-red-100 text-red-600 label w-12 py-1 px-3 mt-5 rounded-lg text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </div>
            
            <button className="bg-[#f97a00] hover:bg-orange-400 label w-full text-white p-3 mt-5 rounded-lg">
              Simpan Edit
            </button>
          </div>
        </form>
      </div>

      <footer className="mt-8 bg-gray-800 text-white py-8 px-4 sm:px-12 md:px-24">
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
