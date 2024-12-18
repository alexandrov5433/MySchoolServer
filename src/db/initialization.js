import pool from "./db.js";

async function user() {
    const client = await pool.connect();
    const res = await client.query(
        `
        DO
        $$
        BEGIN
            CREATE TYPE _STATUS AS ENUM('student', 'teacher', 'parent');
            EXCEPTION WHEN DUPLICATE_OBJECT THEN
                RAISE NOTICE '_STATUS  exists, Skipping _STATUS creation!';
        END
        $$;

        CREATE TABLE IF NOT EXISTS public.user(
            id SERIAL PRIMARY KEY,
            status _STATUS,
            first_name VARCHAR(256),
            last_name VARCHAR(256),
            date_of_birth VARCHAR(256),
            email VARCHAR(256),
            mobile_number VARCHAR(256),
            home_number VARCHAR(256),
            street VARCHAR(256),
            house_number VARCHAR(256),
            city VARCHAR(256),
            password VARCHAR(256),
            profile_picture integer REFERENCES file (id),
            parental_authentication_code VARCHAR(256),
            uploaded_documents integer[],
            display_id VARCHAR(256),
            parents integer[],
            active_student BOOLEAN DEFAULT false,
            background_image_number VARCHAR(256),
            children integer[]
        )`
    );
    client.release();
    return res;
}

async function file() {
    const client = await pool.connect();
    const res = await client.query(
        `CREATE TABLE IF NOT EXISTS public.file(
            id SERIAL PRIMARY KEY,
            original_name VARCHAR(256),
            unique_name VARCHAR(256),
            pathTo_file VARCHAR(256),
            mime_type VARCHAR(256),
            encoding VARCHAR(256)
        )`
    );
    client.release();
    return res;
}

async function initTables() {
    await file();
    await user();
}

export default initTables;