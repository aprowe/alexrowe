import mongoose from 'mongoose';
import config from 'config';

// Export a connection
export default mongoose.createConnection(config.LYRICS_DB_URL);
