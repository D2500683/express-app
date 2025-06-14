const { MongoClient } = require('mongodb');


const MONGODB_URI = 'mongodb+srv://daniel:danielih5@cluster0.5bptv.mongodb.net/';
const DB_NAME = 'lessonshop';

const lessons = [
  { subject: 'Mathematics', price: 100, location: 'Lagos', spaces: 5, icon: '/images/math.jpeg' },
  { subject: 'Physics', price: 75, location: 'Abuja', spaces: 5, icon: '/images/physics.jpeg' },
  { subject: 'Chemistry', price: 90, location: 'Italy', spaces: 5, icon: '/images/chemistry.jpeg' },
  { subject: 'Biology', price: 100, location: 'Germany', spaces: 5, icon: '/images/biology.jpeg' },
  { subject: 'English', price: 100, location: 'Sheffield', spaces: 5, icon: '/images/english.jpeg' },
  { subject: 'History', price: 150, location: 'Liverpool', spaces: 5, icon: '/images/history.jpeg' },
  { subject: 'Geography', price: 90, location: 'Kano', spaces: 5, icon: '/images/geography.jpeg' },
  { subject: 'Computer Science', price: 100, location: 'New York', spaces: 5, icon: '/images/computer.jpeg' }
];

async function seed() {
  const client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('lessons');
    await collection.deleteMany({});
    const result = await collection.insertMany(lessons);
    console.log(`${result.insertedCount} lessons inserted.`);
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.close();
  }
}

seed();