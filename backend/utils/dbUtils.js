import { pool } from '../config/db.js';

// Create all necessary tables
const createTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                img TEXT NOT NULL,
                title VARCHAR(255) NOT NULL UNIQUE,
                star INT DEFAULT 0,
                reviews VARCHAR(50),
                prev_price VARCHAR(50),
                new_price DECIMAL(10, 2) NOT NULL,
                company VARCHAR(255) NOT NULL,
                color VARCHAR(50),
                category VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ 'products' table created successfully!");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            gender VARCHAR(10),
            dob DATE,
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `);
        console.log("✅ 'users' table created successfully!");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS address (
            add_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            fullName VARCHAR(255),
            mobile VARCHAR(10),
            address TEXT,
            pincode VARCHAR(6),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
            
        );
        `);
        console.log("✅ 'address' table created successfully!");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS feedback (
                fed_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                name VARCHAR(100),
                email VARCHAR(100),
                rating INT,
                comments TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
        );
        `);
        console.log("✅ 'feedback' table created successfully!");


        await pool.query(`
            CREATE TABLE IF NOT EXISTS cart (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT DEFAULT 1,
                size VARCHAR(10),
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            );
        `);
        console.log("✅ 'cart' table created successfully!");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS wishlist (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            );
        `);
        console.log("✅ 'Wishlist' table created successfully!");

        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          user_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
  
          `);
          console.log("✅ 'Newsletter' table created successfully!");

        await pool.query(`
          CREATE TABLE IF NOT EXISTS upi (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            upi_id VARCHAR(255) NOT NULL,
            remember_upi BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        `);
        console.log("✅ 'upi' table created successfully!");


        await pool.query(
            `CREATE TABLE IF NOT EXISTS orders (
                order_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT DEFAULT 1,
                size VARCHAR(10),
                total_price DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            );`
        );
        console.log("✅ 'orders' table created successfully!");
        


    } catch (error) {
        console.error("❌ Error creating tables:", error);
    }
};



// Insert sample products if not already present
const insertProducts = async () => {
    try {
        const [rows] = await pool.query("SELECT COUNT(*) AS count FROM products");
        if (rows[0].count > 0) {
            console.log("✅ Products already exist, skipping insertion.");
            return;
        }

        const products = [
            ["/CoverImages_Aura/0e773ad6-14d4-483c-bf0c-7741704b21a8.jpeg", "Annouk", 5, "(120 reviews)", "$90.00", 60, "Forever 21", "brown", "Tops & T-Shirts"],
            ["/CoverImages_Aura/3b13bf21-3319-4f3a-a581-2ac154fbdb24.jpeg", "Vapormax", 3, "(23 reviews)", "$70.00", 200, "H & M", "yellow", "Dresses & Jumpsuits"],
            ["/CoverImages_Aura/5b09a772-c498-42c8-ac29-53b0eaedb7db.jpeg", "Waffle", 4, "(13 reviews)", "$140.00", 200, "Zara", "green", "Tops & T-Shirts"],
            ["/CoverImages_Aura/6ea7c887-4b88-4aec-95c6-d30ca1b6d09c.jpeg", "Office Suit", 4, "(123 reviews)", "$140.00", 200, "Roadster", "brown", "Dresses & Jumpsuits"],
            ["/CoverImages_Aura/7bff2ba1-0139-4ca3-984b-0e04aca03e42.jpeg", "Tank Pumps", 3, "(123 reviews)", "$100.00", 90, "Levi's", "white", "Tops & T-Shirts"],
            ["/CoverImages_Aura/14K Gold Plate Stainless Steel Huggie Hoop Earrings.jpeg", "Knit Jumpsuit", 5, "(1203 reviews)", "$140.00", 50, "ONLY", "brown", "Dresses & Jumpsuits"],
            ["/CoverImages_Aura/94a5e443-9ea6-45a9-bc60-79ad683524bf.jpeg", "Loafer Jumpsuit", 5, "(123 reviews)", "$840.00", 900, "Vero Moda", "brown", "Dresses & Jumpsuits"],
            ["/CoverImages_Aura/Bermudas de lino.jpeg", "Zoom Freak", 5, "(123 reviews)", "$340.00", 90, "Aura OG", "brown", "Bottoms"],
            ["/CoverImages_Aura/Wildflower By Krishna _ Pink Crepe Printed & Embroidered Anarkali Set _ End Of Season Sale.jpeg", "Churi Chatha", 2, "(123 reviews)", "$140.00", 200, "H & M", "pink", "Ethnic & Traditional Wear"],
            ["/CoverImages_Aura/Valeria Stripy Shirt Dress Blue _ Girl In Mind _ SilkFred US.jpeg", "Lengthy-OCE", 5, "(123 reviews)", "$140.00", 150, "Zara", "blue", "Dresses & Jumpsuits"],
            ["/CoverImages_Aura/The Secret Behind Staud_s Massive Success (& What To Expect Next).jpeg", "Pacer Suit", 5, "(123 reviews)", "$80.00", 50, "ONLY", "cream", "Dresses & Jumpsuits"],
            ["/CoverImages_Aura/Rothy’s_ Washable Shoes & Bags Made with Recycled Materials.jpeg", "Adult Super", 2, "(123 reviews)", "$90.00", 80, "Levi's", "brown", "Dresses & Jumpsuits"],
            ["/CoverImages_Aura/13d3643b-48ac-454d-a2c4-63d92a8124c9.jpeg", "Roma Bluesuit", 3, "(123 reviews)", "$140.00", 100, "Forever 21", "blue", "Dresses & Jumpsuits"],
            ["/CoverImages_Aura/36d75c00-a772-4168-9457-681d38393bb9.jpeg", "Pacer Traditional", 4, "(123 reviews)", "$170.00", 90, "Levi's", "green", "Ethnic & Traditional Wear"],
            ["/CoverImages_Aura/Designer Skirt Sets Online _ Co-Ord Sets for Women _ Anita Dongre.jpeg", "Fusion Skirt", 5, "(123 reviews)", "$540.00", 80, "Zara", "white", "Ethnic & Traditional Wear"],
            ["/CoverImages_Aura/d173e91b-0200-4cf0-9422-f51fa01a6985.jpeg", "Chex Skirt", 1, "(123 reviews)", "$240.00", 150, "Roadster", "yellow", "Ethnic & Traditional Wear"]
        ];

        const query = `
            INSERT INTO products 
            (img, title, star, reviews, prev_price, new_price, company, color, category) 
            VALUES ?
        `;
        await pool.query(query, [products]);
        console.log("✅ Sample products inserted successfully!");

    } catch (error) {
        console.error("❌ Error inserting products:", error);
    }
};

export { createTable, insertProducts };
