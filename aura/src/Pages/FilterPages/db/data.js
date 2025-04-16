import { AiFillStar } from "react-icons/ai";

// const data = [
//   {
//     img: "/CoverImages_Aura/0e773ad6-14d4-483c-bf0c-7741704b21a8.jpeg",
//     title: "Annouk",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(12 reviews)",
//     prevPrice: "$90,00",
//     newPrice: "60",
//     company: "Forever 21",
//     color: "brown",
//     category: "Tops & T-Shirts",
//   },
//   {
//     img: "/CoverImages_Aura/3b13bf21-3319-4f3a-a581-2ac154fbdb24.jpeg",
//     title: "Vapormax ",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(123 reviews)",
//     prevPrice: "$70,00",
//     newPrice: "200",
//     company: "H & M",
//     color: "yellow",
//     category: "Dresses & Jumpsuits",
//   },

//   {
//     img: "/CoverImages_Aura/5b09a772-c498-42c8-ac29-53b0eaedb7db.jpeg",
//     title: "Waffle",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(123 reviews)",
//     prevPrice: "$140,00",
//     newPrice: "200",
//     company: "Zara",
//     color: "green",
//     category: "Tops & T-Shirts",
//   },
//   {
//     img: "/CoverImages_Aura/6ea7c887-4b88-4aec-95c6-d30ca1b6d09c.jpeg",
//     title: "Office Suit",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(123 reviews)",
//     prevPrice: "$140,00",
//     newPrice: "200",
//     company: "Roadster",
//     color: "brown",
//     category: "sneakers",
//   },
//   {
//     img: "/CoverImages_Aura/7bff2ba1-0139-4ca3-984b-0e04aca03e42.jpeg",
//     title: "Tank Pumps",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(123 reviews)",
//     prevPrice: "$100,00",
//     newPrice: "90",
//     company: "Levi's",
//     color: "white",
//     category: "Tops & T-Shirts",
//   },
//   {
//     img: "/CoverImages_Aura/14K Gold Plate Stainless Steel Huggie Hoop Earrings.jpeg",
//     title: "Knit Jumpsuit",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(123 reviews)",
//     prevPrice: "$140,00",
//     newPrice: "50",
//     company: "ONLY",
//     color: "brown",
//     category: "Dresses & Jumpsuits",
//   },

//   {
//     img: "/CoverImages_Aura/94a5e443-9ea6-45a9-bc60-79ad683524bf.jpeg",
//     title: "Loafer Jumpsuit",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(123 reviews)",
//     prevPrice: "$840,00",
//     newPrice: "900",
//     company: "Vero Moda",
//     color: "brown",
//     category: "Dresses & Jumpsuits",
//   },

//   {
//     img: "/CoverImages_Aura/Bermudas de lino.jpeg",
//     title: "Zoom Freak",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(123 reviews)",
//     prevPrice: "$340,00",
//     newPrice: "90",
//     company: "Aura OG",
//     color: "brown",
//     category: "Bottoms",
//   },

//   {
//     img: "/CoverImages_Aura/Wildflower By Krishna _ Pink Crepe Printed & Embroidered Anarkali Set _ End Of Season Sale.jpeg",
//     title: "Churi Chatha",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(123 reviews)",
//     prevPrice: "$140,00",
//     newPrice: "200",
//     company: "H & M",
//     color: "pink",
//     category: "Ethnic & Traditional Wear",
//   },

//   {
//     img: "/CoverImages_Aura/Valeria Stripy Shirt Dress Blue _ Girl In Mind _ SilkFred US.jpeg",
//     title: "Lengthy-OCE",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(123 reviews)",
//     prevPrice: "$140,00",
//     newPrice: "150",
//     company: "Zara",
//     color: "blue",
//     category: "Dresses & Jumpsuits",
//   },
//   {
//     img: "/CoverImages_Aura/The Secret Behind Staud_s Massive Success (& What To Expect Next).jpeg",
//     title: "Pacer Suit",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(123 reviews)",
//     prevPrice: "$80,00",
//     newPrice: "50",
//     company: "ONLY",
//     color: "cream",
//     category: "Dresses & Jumpsuits",
//   },
//   {
//     img: "/CoverImages_Aura/Rothy’s_ Washable Shoes & Bags Made with Recycled Materials.jpeg",
//     title: "Adult Super",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(123 reviews)",
//     prevPrice: "$90,00",
//     newPrice: "80",
//     company: "Levi's",
//     color: "brown",
//     category: "Dresses & Jumpsuits",
//   },
//   {
//     img: "/CoverImages_Aura/13d3643b-48ac-454d-a2c4-63d92a8124c9.jpeg",
//     title: "Roma Bluesuit",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(123 reviews)",
//     prevPrice: "$140,00",
//     newPrice: "100",
//     company: "Forever 21",
//     color: "blue",
//     category: "Dresses & Jumpsuits",
//   },
//   {
//     img: "/CoverImages_Aura/36d75c00-a772-4168-9457-681d38393bb9.jpeg",
//     title: "Pacer Traditional",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(123 reviews)",
//     prevPrice: "$170,00",
//     newPrice: "90",
//     company: "Levi's",
//     color: "green",
//     category: "Ethnic & Traditional Wear",
//   },

//   {
//     img: "/CoverImages_Aura/Designer Skirt Sets Online _ Co-Ord Sets for Women _ Anita Dongre.jpeg",
//     title: "Fusion Skirt",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(123 reviews)",
//     prevPrice: "$540,00",
//     newPrice: "80",
//     company: "Zara",
//     color: "white",
//     category: "Ethnic & Traditional Wear",
//   },
//   {
//     img: "/CoverImages_Aura/d173e91b-0200-4cf0-9422-f51fa01a6985.jpeg",
//     title: "Chex Skirt",
//     star: <AiFillStar className="rating-star" />,
//     reviews: "(123 reviews)",
//     prevPrice: "$240,00",
//     newPrice: "150",
//     company: "Roadster",
//     color: "yellow",
//     category: "Ethnic & Traditional Wear",
//   },

// ];

// export default data;

// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// export const pool = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "",
//   database: "ecommerce", // make sure your DB name is correct
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// export const checkConnection = async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log("✅ Connected to the MySQL database.");
//     connection.release();
//   } catch (error) {
//     console.error("❌ Unable to connect to the database:", error);
//   }
// };
