const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');
const Task = require('../models/Task');
const logger = require('../utils/logger');

const seedUsers = [
  {
    name: 'Demo SRE Lead',
    email: 'demo@dftasks.com',
    password: 'Password123!',
    role: 'admin'
  },
  {
    name: 'Agile Product Manager',
    email: 'pm@dftasks.com',
    password: 'Password123!',
    role: 'user'
  }
];

const sampleTasks = [
  {
    title: 'Deploy Kubernetes Helm chart to Staging Cluster',
    description: 'Verify canary rollout metrics and test automated rollback playbooks.',
    category: 'Work',
    priority: 'Urgent',
    status: 'Active',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
    tags: ['DevOps', 'Kubernetes', 'K8s']
  },
  {
    title: 'Complete System Architecture Review with Lead Architect',
    description: 'Audit microservice boundaries and ensure SOLID adherence for Sprint 4.',
    category: 'Work',
    priority: 'High',
    status: 'Completed',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    completedAt: new Date(),
    tags: ['Architecture', 'Agile']
  },
  {
    title: 'Study Distributed Consensus & Raft Protocol',
    description: 'Read the original paper and summarize leader election log replication steps.',
    category: 'Study',
    priority: 'Medium',
    status: 'Active',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    tags: ['DistributedSystems', 'Raft']
  },
  {
    title: '30-minute HIIT Cardio Session & Stretching',
    description: 'Maintain peak focus and physical health during intense sprint delivery.',
    category: 'Health',
    priority: 'Medium',
    status: 'Completed',
    completedAt: new Date(),
    dueDate: new Date(),
    tags: ['Fitness', 'Cardio']
  },
  {
    title: 'Audit AWS CloudWatch & APM Ingestion Invoices',
    description: 'Identify overprovisioned EC2 node pools to save 25% on monthly infrastructure spend.',
    category: 'Finance',
    priority: 'High',
    status: 'Active',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    tags: ['FinOps', 'AWS']
  },
  {
    title: 'Weekly Grocery Restock: Fresh Greens & High Protein',
    description: 'Almonds, organic oats, berries, eggs, and hydration electrolytes.',
    category: 'Personal',
    priority: 'Low',
    status: 'Active',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    tags: ['Personal', 'Nutrition']
  },
  {
    title: 'P1 Incident Root Cause Post-Mortem Documentation',
    description: 'Document Redis connection leak mitigation and submit final report to leadership.',
    category: 'Urgent',
    priority: 'Urgent',
    status: 'Active',
    dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // in 12 hours
    tags: ['Incident', 'P1', 'SRE']
  },
  {
    title: 'Review Framer Motion Spring Physics Animation Specs',
    description: 'Ensure smooth micro-interactions on all cards, modal dialogs, and button hovers.',
    category: 'Study',
    priority: 'Low',
    status: 'Completed',
    completedAt: new Date(),
    dueDate: new Date(),
    tags: ['Frontend', 'FramerMotion', 'UI/UX']
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('Connected to MongoDB for database seeding.');

    // Clean existing collections
    await User.deleteMany({});
    await Task.deleteMany({});
    logger.info('Cleared existing Users and Tasks.');

    // Seed Users
    const createdUsers = await User.create(seedUsers);
    const primaryUser = createdUsers[0];
    logger.info(`Seeded ${createdUsers.length} users successfully. Primary: ${primaryUser.email}`);

    // Seed Tasks bound to Primary User
    const tasksWithUser = sampleTasks.map((t, idx) => ({
      ...t,
      user: primaryUser._id,
      orderIndex: idx
    }));

    const createdTasks = await Task.create(tasksWithUser);
    logger.info(`✅ Seeded ${createdTasks.length} production sample tasks successfully!`);

    console.log('\n=========================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Credentials for Testing:');
    console.log(`Email:    ${primaryUser.email}`);
    console.log('Password: Password123!');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    logger.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
