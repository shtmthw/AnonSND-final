import mongoose from 'mongoose';

type ConnectionObj = {
    isCon: number;
};

const connection: ConnectionObj = { isCon: 0 };

async function DBconnect(): Promise<void> {
    if (connection.isCon) {
        console.log('Already Connected!');
        return; // Prevents unnecessary reconnections
    }

    try {
        const DB = await mongoose.connect("mongodb+srv://Matthew:1234@main.0fbro.mongodb.net/?retryWrites=true&w=majority&appName=MAIN", {
            dbName: 'MAIN', // Specify the database name
        });

        connection.isCon = DB.connections[0].readyState; // Set connection state
        console.log('Connected successfully');
    } catch (e) {
        console.error('Error Connecting To Database:', e);
        process.exit(1); // Exit process on failure
    }
}

export default DBconnect;
