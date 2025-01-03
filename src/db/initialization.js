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
            profile_picture integer REFERENCES public.file (id),
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

async function subject() {
    const client = await pool.connect();
    const res = await client.query(`
        CREATE TABLE IF NOT EXISTS public.subject(
            id SERIAL PRIMARY KEY,
            teacher integer REFERENCES public.user (id),
            title VARCHAR(256),
            materials integer[],
            displayId VARCHAR(256),
            participants integer[],
            assignments integer[],
            announcements integer[],
            backgroundImageNumber VARCHAR(256)
        )`
    );
    return res;
}

async function grading() {
    const client = await pool.connect();
    const res = await client.query(`
        CREATE TABLE IF NOT EXISTS public.grading(
            id SERIAL PRIMARY KEY,
            student integer REFERENCES public.user (id) NOT NULL,
            subject integer REFERENCES public.subject (id) NOT NULL,
            grades integer[]
        )`
    );
    return res;
}

async function grade() {
    const client = await pool.connect();
    const res = await client.query(`
        CREATE TABLE IF NOT EXISTS public.grade(
            id SERIAL PRIMARY KEY,
            value VARCHAR(256) NOT NULL
        )    
    `);
    return res;
}

async function form() {
    const client = await pool.connect();
    const res = await client.query(`
        CREATE TABLE IF NOT EXISTS public.form(
            id SERIAL PRIMARY KEY,
            file integer REFERENCES public.file (id)
        )    
    `);
    return res;
}

async function faqEntry() {
    const client = await pool.connect();
    const res = await client.query(`
        CREATE TABLE IF NOT EXISTS public.faqEntry(
            id SERIAL PRIMARY KEY,
            question VARCHAR(256) NOT NULL,
            answer VARCHAR(256) NOT NULL
        )    
    `);
    return res;
}

async function assignmentSubmition() {
    const client = await pool.connect();
    const res = await client.query(`
        CREATE TABLE IF NOT EXISTS public.assignmentSubmition(
            id SERIAL PRIMARY KEY,
            student integer REFERENCES public.user (id) NOT NULL,
            document integer REFERENCES public.file (id) NOT NULL
        )    
    `);
    return res;
}

async function assignment() {
    const client = await pool.connect();
    const res = await client.query(`
        CREATE TABLE IF NOT EXISTS public.assignment(
            id SERIAL PRIMARY KEY,
            teacher integer REFERENCES public.user (id) NOT NULL,
            title VARCHAR(256),
            description VARCHAR(256),
            deadline VARCHAR(256),
            resource integer REFERENCES public.file (id) NOT NULL,
            assignmentSubmitions integer[]
        )    
    `);
    return res;
}

async function application() {
    const client = await pool.connect();
    const res = await client.query(`
        DO
        $$
        BEGIN
            CREATE TYPE _APP_STATUS AS ENUM('pending', 'accepted', 'rejected');
            EXCEPTION WHEN DUPLICATE_OBJECT THEN
                RAISE NOTICE '_APP_STATUS  exists, Skipping _APP_STATUS creation!';
        END
        $$;

        CREATE TABLE IF NOT EXISTS public.application(
            id SERIAL PRIMARY KEY,
            status _APP_STATUS NOT NULL,
            applicationDocuments integer[],
            applicant integer REFERENCES public.user (id) NOT NULL
        )    
    `);
    return res;
}

async function announcement() {
    const client = await pool.connect();
    const res = await client.query(`
        CREATE TABLE IF NOT EXISTS public.announcement(
            id SERIAL PRIMARY KEY,
            teacher integer REFERENCES public.user (id) NOT NULL,
            title VARCHAR(256),
            description VARCHAR(256),
            dateTime VARCHAR(256)
        )    
    `);
    return res;
}

async function initTables() {
    await file();
    await user();
    await subject();
    await grade();
    await grading();
    await form();
    await faqEntry();
    await assignmentSubmition();
    await assignment();
    await application();
    await announcement();
}

export default initTables;