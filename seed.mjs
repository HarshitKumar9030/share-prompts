import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/get-text';

const DataSchema = new mongoose.Schema({
  identifier: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: false, index: true },
  content: { type: String, required: true },
});

const DataModel = mongoose.models.Data || mongoose.model('Data', DataSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  
  await DataModel.deleteMany({});
  
  await DataModel.create([
    {
      identifier: '123',
      name: 'hello-world',
      content: '# Hello World!\n\nThis is a *markdown* example with some **bold** text.\n\n- Soft pastel colors are cute\n- No borders or shadows used!\n\n![Puppy](https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop)'
    },
    {
      identifier: '789',
      name: 'resources',
      content: '## Useful Resources\n\nCheck out [Tailwind CSS](https://tailwindcss.com) and [Next.js](https://nextjs.org).\n\nAwesome links for the project!'
    }
  ]);
  
  console.log('Database seeded!');
  process.exit(0);
}

seed().catch(console.error);
