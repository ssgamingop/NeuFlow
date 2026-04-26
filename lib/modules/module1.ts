import { Bot, BarChart3, Database, Calculator } from "lucide-react";
import { LessonData } from "../lesson.types";

export const module1: LessonData[] = [
  {
    slug: "what-is-ai",
    title: "The Foundations of AI",
    description:
      "Discover what artificial intelligence really means. Break past the sci-fi tropes and understand the fundamental logic behind modern learning systems.",
    icon: Bot,
    color: "#8b5cf6",
    duration: "8 min",
    difficulty: "Beginner",
    order: 1,
    module: 1,
    sections: [
      {
        title: "The Big Picture",
        content:
          "Artificial Intelligence is the science of making machines do things that would require intelligence if done by humans. But it's crucial to understand we are not creating consciousness — we are creating complex math equations that learn.\n\nAI isn't magic. It's **Data**, **Math**, and **Compute** combining to mimic human logic.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Rule-Based vs. AI Systems",
        content:
          "In traditional code, you give the computer the exact steps. \n\n**Analogy**: Making a cake.\nIf you bake it via hard-coding, you give precise instructions: *Take 2 eggs, whisk for 3 mins, bake at 350F*.\n\nIf you use AI (Machine Learning), you show the computer 1,000 pictures of good cakes and bad cakes, and the recipes used. The AI eventually *figures out* the recipe on its own through trial and error.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Types of AI",
        content:
          "**Narrow AI (ANI)**: Highly specialized. It plays chess, recommends movies, or generates text. All AI today, including ChatGPT, is Narrow AI.\n\n**General AI (AGI)**: A hypothetical machine that can understand and learn *any* intellectual task a human can. An AGI could learn to drive a car, then instantly learn how to read medical scans with the same brain.\n\n**Super AI (ASI)**: An intellect vastly smarter than the best human brains in practically every field. This is purely theoretical.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1675271591211-126ad94e4958?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "How It Works Under the Hood",
        content:
          "For AI systems to understand real-world concepts like 'happy', they convert everything into **Numbers**. Specifically, arrays of numbers called vectors.\n\nFor example, 'Dog' might become `[0.9, 0.4, 0.1]` in the AI's brain. 'Wolf' might be `[0.9, 0.5, 0.2]`. By turning concepts into math, the computer can *calculate* that a dog is mathematically similar to a wolf.\n\nIt's all about geometry in high-dimensional space.",
        visualType: "3d",
        visualComponent: "WordEmbeddings3D",
      },
    ],
    quiz: [
      {
        question: "Which of these accurately describes all AI systems today?",
        options: ["Super AI", "General AI", "Narrow AI", "Conscious AI"],
        correctIndex: 2,
      },
      {
        question: "How does AI fundamentally understand real-world concepts like words or images?",
        options: [
          "By understanding emotion",
          "By converting them into numbers (vectors)",
          "By reading dictionaries",
          "Through hard-coded boolean logic",
        ],
        correctIndex: 1,
      },
      {
        question: "What replaces hard-coded instructions in AI systems?",
        options: [
          "Magic",
          "Learning from Data through Math and Compute",
          "Random guesses",
          "Quantum mechanics"
        ],
        correctIndex: 1,
      }
    ],
  },
  {
    slug: "what-is-ml",
    title: "Machine Learning Concepts",
    description:
      "Learn the exact paradigm shift of how systems 'learn' from raw data without explicit programming instructions.",
    icon: BarChart3,
    color: "#a78bfa",
    duration: "10 min",
    difficulty: "Beginner",
    order: 2,
    module: 1,
    sections: [
      {
        title: "The Paradigm Shift",
        content:
          "Machine Learning (ML) is the engine behind modern AI. Instead of writing infinite IF/ELSE statements, we feed data to an algorithm and let it find the rules.\n\n**Example**: How do you detect spam?\n\nIf you use traditional programming, you'll write rules: *If email contains \"FREE MONEY\", flag as spam.* \n\nBut spammers just change it to \"FR33 M0N3Y\". You can't write enough rules. ML solves this by looking at thousands of spam emails and mapping the mathematical patterns that distinguish them from regular emails.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "How Models Classify Data",
        content:
          "Let's look at **Classification**. Imagine we want to predict if a patient has a disease based on two metrics: Blood Pressure (X-axis) and Age (Y-axis).\n\nIf we map hundreds of patients onto a graph, we might see clusters — healthy patients clump together, and sick patients clump together.\n\nA Machine Learning model's job is simply drawing a distinct boundary (a line or a plane) between those groups. It 'learns' by repeatedly shifting this line until the separation is perfect.",
        visualType: "3d",
        visualComponent: "ScatterPlot3D",
      },
      {
        title: "Three Types of Learning",
        content:
          "**Supervised Learning**: The AI has the answers during training. You give it photos labeled 'Cat' and 'Dog'. It learns the patterns separating them. (Like having a teacher).\n\n**Unsupervised Learning**: The AI gets raw data with NO labels. It's asked to just find hidden structures. Example: Grouping customers by purchasing behavior.\n\n**Reinforcement Learning**: The AI is dropped into an environment. It makes random choices and gets 'points' for good outcomes and 'penalties' for bad ones. This is how AIs learn to beat humans at chess or Mario.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Generalization",
        content:
          "The ultimate goal of ML is NOT to memorize the training data. The goal is **Generalization** — performing accurately on data it has *never seen before*.\n\nIf you train an AI on 1,000 cat images, and it can only recognize those exact 1,000 images, it's useless. It has 'overfitted'. But if you show it a cat it has never seen, from a strange angle, and it still says 'Cat' — that means the model has successfully generalized the core concept of 'cat-ness'.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1506744626753-1fa76046e5dc?q=80&w=1000&auto=format&fit=crop",
      },
    ],
    quiz: [
      {
        question: "What is it called when a model just memorizes data but fails on new, unseen examples?",
        options: ["Generalization", "Supervised Learning", "Overfitting", "Reinforcement"],
        correctIndex: 2,
      },
      {
        question: "Training an AI to play Super Mario by giving it points for finishing a level is an example of:",
        options: ["Supervised Learning", "Reinforcement Learning", "Unsupervised Learning", "Hard-coding"],
        correctIndex: 1,
      },
      {
        question: "How does ML differ from traditional programming?",
        options: [
          "It uses faster CPUs",
          "It finds the rules from data rather than being given the rules",
          "It never makes mistakes",
          "It only works on images"
        ],
        correctIndex: 1,
      }
    ],
  },
  {
    slug: "data-and-features",
    title: "Data, Features & Preprocessing",
    description:
      "Garbage in, garbage out. Learn how data is collected, cleaned, and transformed into the fuel that powers AI.",
    icon: Database,
    color: "#38bdf8",
    duration: "12 min",
    difficulty: "Beginner",
    order: 3,
    module: 1,
    sections: [
      {
        title: "The Fuel of AI",
        content:
          "Data is the most critical component of any AI project. The most advanced neural network in the world will fail completely if trained on bad data.\n\nIn machine learning, we typically organize data into **Datasets**. Think of a dataset like a giant spreadsheet. Each row is an 'Example' (like a single house for sale), and each column is a 'Feature' (like the number of bedrooms, square footage, zip code).",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Garbage In, Garbage Out",
        content:
          "Real-world data is messy. It contains missing values, typos, and outliers.\n\n**Data Cleaning** involves:\n1. Removing duplicates\n2. Handling missing data (e.g., filling in the average value or deleting the row)\n3. Removing extreme outliers that might confuse the model (like a house listed for $1 billion).\n\nIf you skip this step, your model will learn the mistakes and make terrible predictions.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1592659762303-90081d37b9eb?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Feature Engineering",
        content:
          "Models only understand numbers, so we have to convert things like categories into math.\n\nIf a feature is 'Color' with values (Red, Green, Blue), we can't just assign them 1, 2, 3 because that implies Blue (3) is mathematically 'greater' than Red (1). \n\nInstead, we use **One-Hot Encoding**. We create three new columns: 'Is_Red', 'Is_Green', 'Is_Blue'. A red item gets `[1, 0, 0]`. Now the model understands them as distinct categories without false numerical relationships.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Normalization & Scaling",
        content:
          "Imagine predicting house prices. One feature is 'Number of Bedrooms' (range: 1-5). Another is 'Square Footage' (range: 500-5000).\n\nBecause the square footage numbers are so much larger, the model might mathematically assume it's thousands of times more important than the bedroom count!\n\nTo fix this, we **Scale** the data. We mathematically squish all features so they fall between 0 and 1, or have a mean of 0. This puts all features on an equal playing field.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop",
      }
    ],
    quiz: [
      {
        question: "Why do we scale or normalize data?",
        options: [
          "To make the data file smaller",
          "To prevent features with large numbers from dominating the model",
          "To fix missing values",
          "To encrypt the data"
        ],
        correctIndex: 1,
      },
      {
        question: "What is One-Hot Encoding used for?",
        options: [
          "Converting categorical text into distinct binary numerical arrays",
          "Making the model run faster",
          "Deleting outliers",
          "Compressing images"
        ],
        correctIndex: 0,
      },
      {
        question: "What does 'Garbage In, Garbage Out' mean in ML?",
        options: [
          "Deleting old models",
          "Poor quality training data results in poor quality predictions",
          "Recycling computer hardware",
          "Throwing away predictions that are wrong"
        ],
        correctIndex: 1,
      }
    ],
  },
  {
    slug: "math-for-ml",
    title: "The Math Behind ML",
    description:
      "Don't let the equations scare you. Grasp the intuition behind Linear Algebra and Calculus that drives AI.",
    icon: Calculator,
    color: "#f43f5e",
    duration: "14 min",
    difficulty: "Beginner",
    order: 4,
    module: 1,
    sections: [
      {
        title: "Why Math Matters",
        content:
          "You don't need a PhD in mathematics to use machine learning, but you do need **intuition**.\n\nAI relies primarily on three pillars of math:\n1. **Linear Algebra**: How we structure and move data (Vectors, Matrices).\n2. **Calculus**: How we learn and optimize (Derivatives, Gradients).\n3. **Probability & Statistics**: How we handle uncertainty and make predictions.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Linear Algebra: Vectors & Matrices",
        content:
          "A **Vector** is just a list of numbers, representing a point in space. e.g., `[0.5, 1.2]` is a point in 2D space.\n\nA **Matrix** is a grid of numbers (a list of vectors). Images are just matrices of pixel intensities! When a neural network processes data, it's just multiplying matrices together. GPUs are so important for AI because they are exceptionally fast at multiplying massive matrices simultaneously.",
        visualType: "3d",
        visualComponent: "WordEmbeddings3D",
      },
      {
        title: "Calculus: The Engine of Learning",
        content:
          "Calculus is the study of change. In ML, we care about **Derivatives**.\n\nA derivative tells you the slope of a curve at a specific point. If we have a curve representing our 'Error', the derivative tells us which direction is 'downhill'. By calculating the derivative, the AI knows exactly how to tweak its numbers to make the error smaller. This is the entire foundation of how AI 'learns'.",
        visualType: "3d",
        visualComponent: "GradientSurface3D",
      },
      {
        title: "Probability",
        content:
          "AI rarely deals in absolute certainties. When an AI looks at a picture of a cat, it doesn't say 'This is a cat.' It says 'There is a 94% probability this is a cat, and a 6% probability it is a dog.'\n\nProbability allows models to handle the messy ambiguity of the real world and express confidence in their predictions.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000&auto=format&fit=crop",
      }
    ],
    quiz: [
      {
        question: "Why are GPUs highly utilized in Machine Learning?",
        options: [
          "They have more storage space",
          "They are highly optimized for multiplying large matrices in parallel",
          "They use less electricity",
          "They can process audio files better"
        ],
        correctIndex: 1,
      },
      {
        question: "What does a derivative help the AI do?",
        options: [
          "Store data efficiently",
          "Find the 'downhill' direction to minimize error",
          "Generate random numbers",
          "Display graphics"
        ],
        correctIndex: 1,
      },
      {
        question: "An image is fundamentally represented to an AI as:",
        options: [
          "A matrix of numbers",
          "A string of text",
          "A sound wave",
          "A single vector"
        ],
        correctIndex: 0,
      }
    ],
  }
];
