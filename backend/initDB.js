import { pool } from './database.js';
import fs from 'fs/promises';
import path from 'path';

async function showDatabaseTables() {
    try {
        // Show all tables in the database
        const [tables] = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = ?`, 
            [process.env.MYSQL_DATABASE]
        );
        
        console.log('\nDatabase Tables:');
        console.log('----------------');
        tables.forEach(table => {
            console.log(table.TABLE_NAME);
        });

        // For each table, show its structure
        for (const table of tables) {
            const [columns] = await pool.query(`
                SHOW COLUMNS FROM ${table.TABLE_NAME}
            `);
            
            console.log(`\nStructure of ${table.TABLE_NAME}:`);
            console.log('------------------------');
            columns.forEach(column => {
                console.log(`${column.Field}: ${column.Type}`);
            });
        }

    } catch (error) {
        console.error('Error showing database tables:', error);
    } finally {
        await pool.end();
    }
}

// Run the function
showDatabaseTables();